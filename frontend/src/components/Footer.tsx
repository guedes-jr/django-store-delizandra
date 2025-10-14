import { Instagram, Facebook, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-light tracking-widest text-foreground">
              DELIZANDRA
            </h3>
            <p className="text-muted-foreground text-sm">
              Moda feminina com estilo único e peças exclusivas para você.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5548988686837"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">INSTITUCIONAL</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Nossa História
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Trabalhe Conosco
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">ATENDIMENTO</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Rastreamento
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">NEWSLETTER</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receba novidades e ofertas exclusivas
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 rounded border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <button className="w-10 h-10 rounded bg-foreground hover:bg-foreground/90 text-background flex items-center justify-center transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Delizandra. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
