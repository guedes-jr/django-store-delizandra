import { ShoppingBag, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "./Cart";

export const Header = () => {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-black text-white py-2 text-center text-sm">
        <span>TELEFONE (48) 98868-6837</span>
        <span className="float-right mr-4 hidden md:inline">MEUS PEDIDOS</span>
      </div>
      
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1 md:flex-initial">
            <Search className="h-5 w-5 text-muted-foreground hidden md:block" />
            <input
              type="text"
              placeholder="o que procura hoje?"
              className="hidden md:block text-sm border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <h1 className="font-display text-3xl font-light tracking-widest text-foreground absolute left-1/2 transform -translate-x-1/2">
            DELIZANDRA
          </h1>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 py-4 border-t border-border text-xs font-semibold">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            COLLAB MANOELLA DAMS
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            NEW IN
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            SHOP
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            BEST SELLER'S
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            MEGA SALE
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            ESPIAR TUDO
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            VALE PRESENTE
          </a>
        </nav>
      </header>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
