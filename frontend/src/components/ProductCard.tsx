import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ProductModal } from "./ProductModal";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="group relative bg-white cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
            />
          </button>

          <div
            className={`absolute bottom-0 left-0 right-0 p-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="sm"
              className="w-full bg-black hover:bg-black/90 text-white text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              COMPRAR
            </Button>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 px-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-1">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>

          <p className="text-lg font-bold text-foreground">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
