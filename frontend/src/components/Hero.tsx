import { Play } from "lucide-react";
import bannerPromo from "@/assets/banner-promo.png";

interface HeroProps {
  onVideoClick: () => void;
}

export const Hero = ({ onVideoClick }: HeroProps) => {
  return (
    <>
      <section className="relative w-full bg-white">
        <img 
          src={bannerPromo} 
          alt="Pangeia Escala Fashion - Lançamentos de 49 até 149" 
          className="w-full h-auto object-cover"
        />
      </section>

      <section className="relative bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div className="flex justify-center order-2 md:order-1">
              <button
                onClick={onVideoClick}
                className="relative group"
                aria-label="Assistir vídeo"
              >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary shadow-xl transition-transform group-hover:scale-105">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 md:h-8 md:w-8 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop" 
                      alt="Vídeo da loja" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse" />
              </button>
            </div>

            <div className="text-center md:text-left order-1 md:order-2">
              <div className="mb-6">
                <span className="font-display text-5xl md:text-6xl italic text-foreground">collab</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground mb-2">
                DELIZANDRA
              </h2>
              <p className="text-sm text-foreground mb-6">& MANOELLA DAMS</p>
              <button className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3 text-sm font-semibold transition-colors">
                compre aqui
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white py-8 text-center border-t border-b border-border">
        <p className="text-sm font-medium text-foreground">
          Primeira Compra? Cupom: NEWDELI em todo o site
        </p>
      </div>
    </>
  );
};
