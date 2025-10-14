import { X, ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ReviewSection } from "./ReviewSection";
import { useCart } from "@/contexts/CartContext";

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

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor, selecione um tamanho");
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-background rounded-2xl shadow-2xl my-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews} avaliações)
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h2>
              <p className="text-4xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Cor: {selectedColor}
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Tamanho</label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Quantidade</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-accent text-primary-foreground h-12 text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">
                Peça confeccionada com materiais de alta qualidade, oferecendo conforto
                e elegância. Perfeita para diversas ocasiões, combinando estilo
                contemporâneo com sofisticação atemporal.
              </p>
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};
