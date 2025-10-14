import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import conjuntoCroppedJeans from "@/assets/products/conjunto-cropped-jeans.jpg";
import vestidoMidiFloral from "@/assets/products/vestido-midi-floral.jpg";
import blusaMangaBufante from "@/assets/products/blusa-manga-bufante.jpg";
import saiaLongaPlissada from "@/assets/products/saia-longa-plissada.jpg";
import conjuntoTwoPiece from "@/assets/products/conjunto-two-piece.jpg";
import calcaWideLeg from "@/assets/products/calca-wide-leg.jpg";
import topCroppedTricot from "@/assets/products/top-cropped-tricot.jpg";
import blazerOversized from "@/assets/products/blazer-oversized.jpg";

interface Sale {
  product: string;
  city: string;
  state: string;
  image: string;
}

const recentSales: Sale[] = [
  { product: "Conjunto Cropped Jeans", city: "Belo Horizonte", state: "MG", image: conjuntoCroppedJeans },
  { product: "Vestido Midi Floral", city: "São Paulo", state: "SP", image: vestidoMidiFloral },
  { product: "Blusa Manga Bufante", city: "Rio de Janeiro", state: "RJ", image: blusaMangaBufante },
  { product: "Saia Longa Plissada", city: "Curitiba", state: "PR", image: saiaLongaPlissada },
  { product: "Conjunto Two Piece", city: "Florianópolis", state: "SC", image: conjuntoTwoPiece },
  { product: "Calça Wide Leg", city: "Porto Alegre", state: "RS", image: calcaWideLeg },
  { product: "Top Cropped Tricot", city: "Brasília", state: "DF", image: topCroppedTricot },
  { product: "Blazer Oversized", city: "Salvador", state: "BA", image: blazerOversized },
];

export const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const randomSale = recentSales[Math.floor(Math.random() * recentSales.length)];
      setCurrentSale(randomSale);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);

    // Show subsequent notifications every 10-15 seconds
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 5000 + 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !currentSale) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-in-left">
      <div className="bg-background border border-border rounded-lg shadow-elegant max-w-xs relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3 p-3">
          <div className="flex-shrink-0">
            <img 
              src={currentSale.image} 
              alt={currentSale.product}
              className="w-16 h-16 object-cover rounded"
            />
          </div>
          
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <p className="font-semibold text-foreground text-sm">
                Vendido!!!
              </p>
            </div>
            <p className="text-xs text-foreground leading-tight">
              1 {currentSale.product} para {currentSale.city}, {currentSale.state}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
