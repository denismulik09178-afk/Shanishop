import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-8 relative z-10"
      >
        <h1 className="font-serif text-8xl md:text-9xl text-foreground/10 tracking-[0.2em] font-light uppercase mix-blend-luminosity">404</h1>
        <p className="text-2xl font-serif text-foreground font-light tracking-[0.1em] uppercase">Цю сторінку не знайдено</p>
        <p className="text-foreground/50 font-light tracking-widest text-sm max-w-sm mx-auto leading-loose">
          Здається, цей аромат випарувався. Повернемося до основної колекції.
        </p>
        <div className="pt-8">
          <Link href="/">
            <Button className="rounded-none px-12 h-14 tracking-[0.2em] uppercase bg-transparent text-foreground border border-white/30 hover:bg-white hover:text-black transition-all duration-500 font-light">
              Головна
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
