import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-background/90 backdrop-blur-md border-border py-4" 
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <button 
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-muted-foreground">
            <Link href="/catalog" className="hover:text-primary transition-colors duration-300">
              Каталог
            </Link>
            <Link href="/#about" className="hover:text-primary transition-colors duration-300">
              Про нас
            </Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] font-semibold text-foreground uppercase">
              Maison Noir
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors duration-300">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-background/95 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          <button 
            className="self-end text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <nav className="flex flex-col items-center justify-center flex-1 gap-12 text-xl font-serif tracking-widest uppercase">
            <Link href="/" className="hover:text-primary transition-colors">Головна</Link>
            <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
            <Link href="/#about" className="hover:text-primary transition-colors">Про нас</Link>
            <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-2">
              Кошик {items.length > 0 && `(${items.length})`}
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link href="/" className="font-serif text-2xl tracking-[0.2em] font-semibold text-foreground uppercase">
                Maison Noir
              </Link>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                Мистецтво нішевої парфумерії. Ексклюзивні аромати для тих, хто цінує справжню розкіш та індивідуальність.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-serif text-lg tracking-wider uppercase text-foreground">Навігація</h4>
              <nav className="flex flex-col space-y-2 text-muted-foreground text-sm">
                <Link href="/catalog" className="hover:text-primary transition-colors">Каталог парфумів</Link>
                <Link href="/#about" className="hover:text-primary transition-colors">Історія бренду</Link>
                <Link href="/cart" className="hover:text-primary transition-colors">Кошик</Link>
              </nav>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="font-serif text-lg tracking-wider uppercase text-foreground">Контакти</h4>
              <div className="flex flex-col space-y-2 text-muted-foreground text-sm">
                <p>Київ, Україна</p>
                <p>atelier@maisonnoir.ua</p>
                <p>+38 (099) 123 45 67</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-foreground">
                  <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-center text-xs text-muted-foreground tracking-wider flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} MAISON NOIR. Всі права захищено.</p>
            <Link href="/admin" className="hover:text-primary transition-colors">Адміністрація</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
