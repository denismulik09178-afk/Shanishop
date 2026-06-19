import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 selection:text-primary-foreground text-foreground">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? "bg-background/90 backdrop-blur-xl border-b border-white/5 py-4" 
            : "bg-gradient-to-b from-black/80 to-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <button 
            className="md:hidden text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-foreground/70">
            <Link href="/catalog" className="hover:text-primary transition-colors duration-500">
              Каталог
            </Link>
            <Link href="/#about" className="hover:text-primary transition-colors duration-500">
              Про нас
            </Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] font-semibold text-foreground uppercase group-hover:text-primary transition-colors duration-700 drop-shadow-md">
              Maison Noir
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative text-foreground/80 hover:text-primary transition-colors duration-500 group flex items-center gap-3">
              <span className="hidden md:inline text-xs font-semibold tracking-[0.2em] uppercase">Кошик</span>
              <div className="relative">
                <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {items.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-primary text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {items.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <button 
                className="self-end text-foreground/60 hover:text-foreground mt-4 mr-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </button>

              <nav className="flex flex-col items-center justify-center flex-1 gap-12 text-2xl font-serif tracking-[0.15em] uppercase">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <Link href="/" className="hover:text-primary transition-colors">Головна</Link>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <Link href="/#about" className="hover:text-primary transition-colors">Про нас</Link>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-3 text-primary">
                    Кошик {items.length > 0 && `(${items.length})`}
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-20" />
        <div className="container relative z-10 mx-auto px-6 md:px-12 pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20 text-center md:text-left">
            <div className="md:col-span-5 flex flex-col items-center md:items-start space-y-6">
              <Link href="/" className="font-serif text-3xl tracking-[0.25em] font-semibold text-foreground uppercase">
                Maison Noir
              </Link>
              <p className="text-foreground/50 max-w-sm text-sm leading-loose font-light">
                Мистецтво нішевої парфумерії. Ексклюзивні аромати для тих, хто цінує справжню розкіш, глибину та безкомпромісну індивідуальність.
              </p>
            </div>
            
            <div className="md:col-span-3 flex flex-col space-y-6">
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-foreground/40">Навігація</h4>
              <nav className="flex flex-col space-y-4 text-foreground/80 text-sm font-light tracking-wide">
                <Link href="/catalog" className="hover:text-primary transition-colors duration-300">Каталог парфумів</Link>
                <Link href="/#about" className="hover:text-primary transition-colors duration-300">Історія бренду</Link>
                <Link href="/cart" className="hover:text-primary transition-colors duration-300">Кошик</Link>
              </nav>
            </div>

            <div className="md:col-span-4 flex flex-col space-y-6">
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-foreground/40">Ательє</h4>
              <div className="flex flex-col space-y-4 text-foreground/80 text-sm font-light tracking-wide">
                <p>Київ, Україна</p>
                <p className="hover:text-primary transition-colors cursor-pointer">atelier@maisonnoir.ua</p>
                <p className="hover:text-primary transition-colors cursor-pointer">+38 (099) 123 45 67</p>
                <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
                  <a href="#" className="text-foreground/40 hover:text-primary transition-colors duration-300"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="text-foreground/40 hover:text-primary transition-colors duration-300"><Facebook className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-xs text-foreground/40 tracking-[0.1em] uppercase flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} MAISON NOIR. Всі права захищено.</p>
            <Link href="/admin" className="hover:text-primary transition-colors duration-300">Secret Entrance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
