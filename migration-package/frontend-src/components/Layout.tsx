import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Search, Send, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { items } = useCart();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 selection:text-primary-foreground text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-white/5 py-3 md:py-4"
            : "bg-gradient-to-b from-black/80 to-transparent py-5 md:py-8"
        }`}
      >
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          {/* Left: hamburger (mobile) | nav (desktop) */}
          <div className="flex items-center gap-4 w-1/3">
            <button
              className="md:hidden text-foreground/80 hover:text-primary transition-colors p-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.2em] uppercase text-foreground/70">
              <Link href="/catalog" className="hover:text-primary transition-colors duration-500">
                Каталог
              </Link>
              <Link href="/#about" className="hover:text-primary transition-colors duration-500">
                Про нас
              </Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex flex-col items-center group w-1/3 justify-center">
            <span className="font-serif text-lg md:text-2xl tracking-[0.3em] font-bold text-foreground uppercase group-hover:text-primary transition-colors duration-700 drop-shadow-md">
              Bablgam
            </span>
            <span className="font-serif text-[9px] md:text-xs tracking-[0.5em] font-light text-primary/80 uppercase">
              Parfum
            </span>
          </Link>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-3 md:gap-6 w-1/3 justify-end">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground/70 hover:text-primary transition-colors duration-300 p-1"
              aria-label="Пошук"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/cart"
              className="relative text-foreground/80 hover:text-primary transition-colors duration-500 group flex items-center gap-2"
            >
              <span className="hidden md:inline text-xs font-semibold tracking-[0.2em] uppercase">Кошик</span>
              <div className="relative">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
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

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center px-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Пошук парфумів</p>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Назва аромату або бренд..."
                  className="w-full bg-transparent border-b-2 border-white/30 focus:border-primary outline-none text-2xl md:text-4xl font-serif font-light text-foreground placeholder:text-foreground/20 py-4 pr-16 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </form>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-foreground/30 hover:text-foreground/60 transition-colors flex items-center gap-2"
                >
                  <X className="w-3 h-3" /> Закрити
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <button
                className="self-end text-foreground/60 hover:text-foreground mt-4 mr-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </button>

              <div className="flex flex-col items-center justify-center mb-12 mt-4">
                <span className="font-serif text-4xl tracking-[0.3em] font-bold text-foreground uppercase">Bablgam</span>
                <span className="font-serif text-sm tracking-[0.5em] font-light text-primary/80 uppercase">Parfum</span>
              </div>

              <nav className="flex flex-col items-center justify-center flex-1 gap-10 text-2xl font-serif tracking-[0.15em] uppercase">
                {[
                  { href: "/", label: "Головна" },
                  { href: "/catalog", label: "Каталог" },
                  { href: "/#about", label: "Про нас" },
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                  >
                    <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                  </motion.div>
                ))}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-3 text-primary">
                    Кошик {items.length > 0 && `(${items.length})`}
                  </Link>
                </motion.div>
              </nav>

              {/* Mobile search */}
              <div className="pb-8">
                <button
                  onClick={() => { setMobileMenuOpen(false); setTimeout(() => setSearchOpen(true), 300); }}
                  className="w-full border border-white/20 py-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/50 hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <Search className="w-4 h-4" /> Пошук
                </button>
              </div>
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
        <div className="container relative z-10 mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-10 md:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-16 text-center md:text-left">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-5 flex flex-col items-center md:items-start space-y-5">
              <Link href="/" className="flex flex-col items-center md:items-start">
                <span className="font-serif text-3xl tracking-[0.3em] font-bold text-foreground uppercase">Bablgam</span>
                <span className="font-serif text-xs tracking-[0.5em] font-light text-primary/80 uppercase">Parfum</span>
              </Link>
              <p className="text-foreground/50 max-w-sm text-sm leading-loose font-light">
                Мистецтво нішевої парфумерії. Ексклюзивні аромати для тих, хто цінує справжню розкіш, глибину та безкомпромісну індивідуальність.
              </p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3 flex flex-col space-y-5">
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-foreground/40">Навігація</h4>
              <nav className="flex flex-col space-y-3 text-foreground/80 text-sm font-light tracking-wide">
                <Link href="/catalog" className="hover:text-primary transition-colors duration-300">Каталог парфумів</Link>
                <Link href="/#about" className="hover:text-primary transition-colors duration-300">Про нас</Link>
                <Link href="/cart" className="hover:text-primary transition-colors duration-300">Кошик</Link>
              </nav>
            </div>

            {/* Contacts */}
            <div className="md:col-span-4 flex flex-col space-y-5">
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-foreground/40">Контакти</h4>
              <div className="flex flex-col space-y-4 text-foreground/80 text-sm font-light tracking-wide">
                <a
                  href="tel:+380683091778"
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                  +38 068 309 17 78
                </a>
                <a
                  href="https://t.me/bablgam_parfum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors"
                >
                  <Send className="w-4 h-4 text-primary/60 shrink-0" />
                  Telegram канал
                </a>
                <p className="text-foreground/40">Україна · Доставка по всій країні</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center text-xs text-foreground/30 tracking-[0.1em] uppercase flex flex-col md:flex-row justify-between items-center gap-3">
            <p>&copy; {new Date().getFullYear()} BABLGAM PARFUM. Всі права захищено.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
