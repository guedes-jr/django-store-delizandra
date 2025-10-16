// src/components/ProductModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { buyNow, listReviews, createReview } from "@/services/api";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type ModalProduct = {
  id: number;
  name: string;
  image: string;
  images?: string[];
  price: number;
  promo_price?: number | null;
  description?: string;
};

type ProductModalProps = { open: boolean; product: ModalProduct | null; onClose?: () => void; };
type Review = { id:number; name:string; rating:number; comment:string; created_at:string };

function StarRating({
  value,
  onChange,
  size = 22,
}: { value: number; onChange: (v:number)=>void; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`transition-transform hover:scale-110 ${n <= value ? "text-yellow-500" : "text-gray-300"}`}
          aria-label={`${n} estrelas`}
          title={`${n} estrelas`}
          style={{ lineHeight: 0 }}
        >
          <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductModal({ open, product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [sending, setSending] = useState(false);

  // ===== GALERIA =====
  const images = useMemo<string[]>(
    () => {
      const arr = product?.images?.length ? product.images! : (product?.image ? [product.image] : []);
      return arr.length ? arr : ["/placeholder.png"];
    },
    [product?.images, product?.image]
  );
  const [idx, setIdx] = useState(0);
  const mainImg = images[Math.min(idx, images.length - 1)];
  const startX = useRef<number | null>(null);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  // ===== REVIEWS =====
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [revSending, setRevSending] = useState(false);
  const [revOk, setRevOk] = useState<string>("");

  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  // ESC e setas
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  // reset ao abrir
  useEffect(() => { if (open) { setQty(1); setIdx(0); } }, [open, product?.id]);

  // carregar reviews
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
    addItem({ id: product.id, name: product.name, image: mainImg, price: product.price, promo_price: product.promo_price ?? null }, qty);
    onClose?.();
  };

  const handleBuyNow = async () => {
    try {
      setSending(true);
      const res = await buyNow(product.id, qty);
      window.location.href = res.whatsapp_link;
    } catch { alert("Não foi possível iniciar a compra agora."); }
    finally { setSending(false); }
  };

  const submitReview = async () => {
    setRevOk("");
    const name = revName.trim();
    if (!name) { alert("Informe seu nome."); return; }
    try {
      setRevSending(true);
      const r = await createReview(product.id, { name, rating: revRating, comment: revComment.trim() });
      setReviews(prev => [r as Review, ...prev]);
      setCount(c => c + 1);
      setAvg(((avg * count) + r.rating) / (count + 1));
      setRevName(""); setRevRating(5); setRevComment("");
      setShowForm(false);
      setRevOk("Obrigado! Seu depoimento foi registrado.");
      setTimeout(() => setRevOk(""), 4000);
    } catch (e:any) {
      alert(e.message || "Falha ao enviar depoimento.");
    } finally { setRevSending(false); }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={() => onClose?.()} />

      {/* painel: flex-col + scroll interno */}
      <div
        ref={panelRef}
        className="relative w-full max-w-[96vw] md:max-w-5xl lg:max-w-6xl
                   bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl ring-1
                   ring-black/5 dark:ring-white/10 max-h-[92vh]
                   flex flex-col overflow-hidden"
      >
        {/* header */}
        <div className="sticky top-0 z-10 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-4 md:p-5">
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

        {/* CONTEÚDO ROLÁVEL */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-y">
          <div className="grid gap-6 p-5 md:p-6 md:grid-cols-2">
            {/* ESQUERDA: galeria + reviews */}
            <div className="md:self-start">
              {/* imagem principal + setas/bullets + swipe */}
              <div
                className="relative rounded-2xl overflow-hidden shadow select-none"
                onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (startX.current === null) return;
                  const dx = e.changedTouches[0].clientX - startX.current;
                  if (dx > 50) prev();
                  if (dx < -50) next();
                  startX.current = null;
                }}
              >
                <img src={mainImg} alt={product.name} className="w-full h-auto object-cover max-h-[60vh] bg-white" loading="lazy" />
                {images.length > 1 && (
                  <>
                    <button onClick={prev} aria-label="Anterior" className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/70">‹</button>
                    <button onClick={next} aria-label="Próxima" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/70">›</button>
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setIdx(i)} aria-label={`Ir para ${i+1}`} className={`h-2 w-2 rounded-full ${i===idx ? "bg-white" : "bg-white/50"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* miniaturas */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 ${i===idx ? "ring-orange-500" : "ring-transparent"}`} aria-label={`Selecionar imagem ${i+1}`}>
                      <img src={src} alt={`Miniatura ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* DEP. ABAIXO DA IMAGEM */}
              <div className="mt-6 border-t border-black/5 dark:border-white/10 pt-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">Depoimentos</span>
                    <span className="text-sm opacity-70">
                      {count > 0 ? `${avg.toFixed(1)} ★ • ${count} avaliações` : "Seja o primeiro a avaliar"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForm(v => !v)}
                    className="h-9 px-3 rounded border hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
                  >
                    {showForm ? "Fechar formulário" : "Escrever um depoimento"}
                  </button>
                </div>

                {revOk && <div className="mb-3 text-sm text-emerald-600">{revOk}</div>}

                {showForm && (
                  <div className="mb-6 grid gap-3 rounded-2xl border border-black/5 dark:border-white/10 p-4">
                    <label className="text-sm">Sua nota</label>
                    <StarRating value={revRating} onChange={setRevRating} />

                    <div className="grid gap-2">
                      <label className="text-sm" htmlFor="rev-name">Seu nome</label>
                      <input
                        id="rev-name"
                        className="border rounded px-3 h-11"
                        placeholder="Como devemos te chamar?"
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm" htmlFor="rev-comment">Comentário (opcional)</label>
                      <textarea
                        id="rev-comment"
                        className="border rounded p-3 min-h-[90px]"
                        placeholder="Conte um pouco sobre sua experiência…"
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button className="h-10 px-4 rounded border" onClick={() => setShowForm(false)}>Cancelar</button>
                      <button
                        className="h-10 px-4 rounded bg-blue-600 text-white disabled:opacity-60"
                        onClick={submitReview}
                        disabled={revSending}
                      >
                        {revSending ? "Enviando..." : "Enviar depoimento"}
                      </button>
                    </div>
                  </div>
                )}

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

            {/* DIREITA: infos/compra */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-end gap-3">
                {typeof product.promo_price === "number" && (
                  <span className="line-through opacity-60">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                )}
                <span className="text-2xl font-bold">R$ {unit.toFixed(2).replace(".", ",")}</span>
              </div>

              {product.description && <p className="opacity-80 mb-4 whitespace-pre-line">{product.description}</p>}

              <div className="mb-4">
                <label className="text-sm block mb-2">Quantidade</label>
                <div className="inline-flex items-center gap-2">
                  <button className="px-3 py-2 border rounded" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir">−</button>
                  <input className="w-16 text-center border rounded py-2" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} />
                  <button className="px-3 py-2 border rounded" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Aumentar">+</button>
                </div>
              </div>

              <div className="mb-6 text-base">
                <span className="opacity-70 mr-2">Subtotal:</span>
                <strong>R$ {line.toFixed(2).replace(".", ",")}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-11 rounded border" onClick={() => onClose?.()}>Cancelar</button>
                <button className="h-11 rounded bg-black text-white dark:bg-white dark:text-black" onClick={handleAddToCart}>Adicionar à sacola</button>
                <button className="col-span-2 h-11 rounded bg-emerald-600 text-white disabled:opacity-60" onClick={handleBuyNow} disabled={sending}>
                  {sending ? "Gerando link..." : "Comprar agora pelo WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* fim do conteúdo rolável */}
      </div>
    </div>
  );
}
