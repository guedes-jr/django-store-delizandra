import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { listProducts, type ApiProduct } from "@/services/api";

export interface UiProduct {
  id: number;
  name: string;
  image: string;
  images: string[];
  price: number;
  promo_price?: number | null;
  description?: string;
}

export const ProductGrid = () => {
  const [items, setItems] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapToUi = (p: ApiProduct): UiProduct => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0]?.url || "https://via.placeholder.com/600",
    images: (p.images || []).map(i => i.url),
    price: Number(p.price),
    promo_price: p.promo_price ? Number(p.promo_price) : null,
    description: p.description ?? "",
  });

  const load = async (url?: string) => {
    try {
      setLoading(true);
      const data = await listProducts({ url });
      setItems(prev => prev.concat(data.results.map(mapToUi)));
      setNext(data.next);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <section className="container mx-auto p-4">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {next && (
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 border rounded" disabled={loading} onClick={() => load(next!)}>
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </section>
  );
};
