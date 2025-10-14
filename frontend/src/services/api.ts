export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: string;
  promo_price: string | null;
  is_active: boolean;
  featured: boolean;
  images: { url: string; position: number }[];
}

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function listProducts(params?: { q?: string; category?: string; url?: string }) {
  let url = params?.url ?? `${API_BASE}/products/`;
  if (!params?.url) {
    const u = new URL(url, window.location.origin);
    if (params?.q) u.searchParams.set("q", params.q);
    if (params?.category) u.searchParams.set("category", params.category);
    url = u.toString();
  }
  const r = await fetch(url);
  if (!r.ok) throw new Error("Falha ao listar produtos");
  return r.json() as Promise<{ results: ApiProduct[]; next: string | null; previous: string | null }>;
}

export async function buyNow(productId: number, qty = 1) {
  const r = await fetch(`${API_BASE}/buynow/whatsapp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, qty }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.detail || "Erro ao comprar");
  return data as { whatsapp_link: string; total: string };
}

export async function checkout(items: { product_id: number; qty: number }[], customerName = "", customerPhone = "") {
  const r = await fetch(`${API_BASE}/checkout/whatsapp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, customer_name: customerName, customer_phone: customerPhone }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.detail || "Erro no checkout");
  return data as { whatsapp_link: string; total: string };
}

export async function listReviews(productId: number) {
  const r = await fetch(`${API_BASE}/products/${productId}/reviews/`);
  if (!r.ok) throw new Error("Falha ao carregar depoimentos");
  return r.json() as Promise<{ results: { id:number; name:string; rating:number; comment:string; created_at:string }[]; average:number; count:number }>;
}

export async function createReview(productId: number, payload: { name: string; rating: number; comment?: string }) {
  const r = await fetch(`${API_BASE}/products/${productId}/reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.detail || "Falha ao enviar depoimento");
  return data as { id:number; name:string; rating:number; comment:string; created_at:string };
}
