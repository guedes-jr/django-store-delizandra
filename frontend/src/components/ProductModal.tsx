import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { buyNow, listReviews, createReview } from "@/services/api";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type ModalProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  promo_price?: number | null;
  description?: string;
};

type ProductModalProps = {
  open: boolean;
  product: ModalProduct | null;
  onClose?: () => void;
};

type Review = { id:number; name:string; rating:number; comment:string; created_at:string };

export default function ProductModal({ open, product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [sending, setSending] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [revSending, setRevSending] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setQty(1);
  }, [open, product?.id]);

  useEffect(() => {
    if (!open || !product) return;
    (async () => {
      try {
        const data = await listReviews(product.id);
        setReviews(data.results);
        setAvg(data.average || 0);
        setCount(data.count || 0);
      } catch {
        setReviews([]); setAvg(0); setCount(0);
      }
    })();
  }, [open, product?.id]);

  if (!open || !product) return null;

  const unit = typeof product.promo_price === "number" ? product.promo_price! : product.price;
  const line = unit * qty;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, image: product.image, price: product.price, promo_price: product.promo_price ?? null }, qty);
    onClose?.();
  };

  const handleBuyNow = async () => {
    try {
      setSending(true);
      const res = await buyNow(product.id, qty);
      window.location.href = res.whatsapp_link;
    } catch {
      alert("Não foi possível iniciar a compra agora. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const submitReview = async () => {
    if (!revName.trim()) { alert("Informe seu nome."); return; }
    try {
      setRevSending(true);
      const r = await createReview(product.id, { name: revName.trim(), rating: revRating, comment: revComment.trim() });
      setReviews(prev => [r as Review, ...prev]);
      setCount(c => c + 1);
      setAvg(((avg * count) + r.rating) / (count + 1));
      setRevName(""); setRevRating(5); setRevComment("");
    } catch (e:any) {
      alert(e.message || "Falha ao enviar depoimento.");
    } finally {
      setRevSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={() => onClose?.()} />

      {/* painel (card) */}
      <div
        ref={panelRef}
        className="relative w-full max-w-[92vw] md:max-w-3xl lg:max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl
                   ring-1 ring-black/5 dark:ring-white/10 max-h-[90vh] overflow-auto"
      >
        {/* header simples */}
        <div className="sticky top-0 z-10 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-4 md:p-5 rounded-t-3xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold line-clamp-1">{product.name}</h2>
            <button
              onClick={() => onClose?.()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:scale-105 transition"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* conteúdo */}
        <div className="grid gap-6 p-5 md:p-6 md:grid-cols-2">
          {/* imagem fixa no desktop */}
          <div className="md:sticky md:top-[88px] md:self-start">
            <div className="rounded-2xl overflow-hidden shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover max-h-[60vh]"
                loading="lazy"
              />
            </div>
          </div>

          {/* infos */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-end gap-3">
              {typeof product.promo_price === "number" && (
                <span className="line-through opacity-60">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
              )}
              <span className="text-2xl font-bold">
                R$ {unit.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {product.description && (
              <p className="opacity-80 mb-4 whitespace-pre-line">{product.description}</p>
            )}

            {/* quantidade */}
            <div className="mb-4">
              <label className="text-sm block mb-2">Quantidade</label>
              <div className="inline-flex items-center gap-2">
                <button className="px-3 py-2 border rounded" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir">−</button>
                <input className="w-16 text-center border rounded py-2" value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} />
                <button className="px-3 py-2 border rounded" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Aumentar">+</button>
              </div>
            </div>

            <div className="mb-6 text-base">
              <span className="opacity-70 mr-2">Subtotal:</span>
              <strong>R$ {line.toFixed(2).replace(".", ",")}</strong>
            </div>

            {/* ações */}
            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 rounded border" onClick={() => onClose?.()}>Cancelar</button>
              <button className="h-11 rounded bg-black text-white dark:bg-white dark:text-black" onClick={handleAddToCart}>Adicionar à sacola</button>
              <button className="col-span-2 h-11 rounded bg-emerald-600 text-white disabled:opacity-60" onClick={handleBuyNow} disabled={sending}>
                {sending ? "Gerando link..." : "Comprar agora pelo WhatsApp"}
              </button>
            </div>

            {/* reviews */}
            <div className="mt-8 border-t border-black/5 dark:border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">Depoimentos</span>
                  <span className="text-sm opacity-70">
                    {count > 0 ? `${avg.toFixed(1)} ★ • ${count} avaliações` : "Seja o primeiro a avaliar"}
                  </span>
                </div>
              </div>

              {/* form review */}
              <div className="mb-6 grid gap-2">
                <input
                  className="border rounded px-3 h-10"
                  placeholder="Seu nome"
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm">Nota:</label>
                  <select className="border rounded h-10 px-2" value={revRating} onChange={(e) => setRevRating(Number(e.target.value))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <textarea
                  className="border rounded p-3 min-h-[80px]"
                  placeholder="Seu comentário (opcional)"
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                />
                <div>
                  <button
                    className="h-10 px-4 rounded bg-blue-600 text-white disabled:opacity-60"
                    onClick={submitReview}
                    disabled={revSending}
                  >
                    {revSending ? "Enviando..." : "Enviar depoimento"}
                  </button>
                </div>
              </div>

              {/* lista de reviews */}
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-3 rounded-xl border border-black/5 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <strong>{r.name}</strong>
                      <span className="text-sm">{`${r.rating} ★`}</span>
                    </div>
                    {r.comment && <p className="mt-2 opacity-80 whitespace-pre-line">{r.comment}</p>}
                    <div className="mt-1 text-xs opacity-60">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {!reviews.length && <div className="opacity-70 text-sm">Ainda não há depoimentos.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
