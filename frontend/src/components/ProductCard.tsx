import { useState } from "react";
import ProductModal from "@/components/ProductModal";
import type { UiProduct } from "./ProductGrid";

type Props = { product: UiProduct };

export function ProductCard({ product }: Props) {
  const [open, setOpen] = useState(false);

  const unit = typeof product.promo_price === "number" ? product.promo_price : product.price;

  return (
    <>
      <article className="border rounded-xl overflow-hidden group">
        {/* IMAGEM: abre modal */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full aspect-square overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </button>

        {/* INFO */}
        <div className="p-3 flex flex-col gap-2">
          <h3 className="font-semibold line-clamp-2">{product.name}</h3>

          <div className="flex items-baseline gap-2">
            {typeof product.promo_price === "number" && (
              <span className="line-through opacity-60">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span className="font-semibold">
              R$ {unit.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="mt-2">
            {/* BOTÃO COMPRAR: abre modal */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full h-10 rounded bg-black text-white dark:bg-white dark:text-black"
            >
              Comprar
            </button>
          </div>
        </div>
      </article>

      {/* MODAL */}
      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          image: product.image,
          images: product.images,                // <<<<<<<<<<
          price: product.price,
          promo_price: product.promo_price ?? null,
          description: product.description ?? "",
        }}
      />
    </>
  );
}
