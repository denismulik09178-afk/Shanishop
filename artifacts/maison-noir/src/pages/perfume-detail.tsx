import { useState } from "react";
import { useParams } from "wouter";
import { useGetPerfume } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const VOLUMES = [1, 2, 3, 5, 10, 20, 30, 50];

export default function PerfumeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [selectedVolume, setSelectedVolume] = useState<number>(5);

  const { data: perfume, isLoading } = useGetPerfume(id, { 
    query: { enabled: !!id } 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center bg-background">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-foreground/50 font-serif text-2xl tracking-[0.2em] uppercase font-light"
        >
          Завантаження
        </motion.div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl text-foreground font-light tracking-widest uppercase">Аромат не знайдено</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(perfume, selectedVolume);
    toast({
      title: "Додано до кошика",
      description: `${perfume.name} (${selectedVolume} мл) успішно додано.`,
    });
  };

  return (
    <div className="w-full pt-32 pb-48 px-6 md:px-12 bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl mt-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2"
          >
            <div className="aspect-[3/4] relative bg-card overflow-hidden">
              <img 
                src={perfume.image_url || "/perfume-placeholder.png"} 
                alt={perfume.name}
                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 flex flex-col justify-center py-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-6"
            >
              {perfume.brand}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground mb-8 font-light tracking-wide uppercase leading-tight"
            >
              {perfume.name}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-end gap-6 mb-16 border-b border-white/10 pb-10"
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key={selectedVolume}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-4xl font-serif text-foreground tracking-widest font-light"
                >
                  {formatCurrency(perfume.price_per_ml * selectedVolume)}
                </motion.span>
              </AnimatePresence>
              <span className="text-foreground/40 text-xs tracking-widest uppercase mb-1">
                ({formatCurrency(perfume.price_per_ml)} / 1 мл)
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-16"
            >
              <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 font-semibold">Об'єм на розпив</h3>
              <div className="flex flex-wrap gap-4">
                {VOLUMES.map(vol => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`
                      w-14 h-14 border text-xs font-medium transition-all duration-500 flex items-center justify-center tracking-wider
                      ${selectedVolume === vol 
                        ? 'border-primary bg-primary text-black' 
                        : 'border-white/20 text-foreground hover:border-white/60 hover:bg-white/5'
                      }
                    `}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                onClick={handleAddToCart}
                disabled={!perfume.in_stock}
                size="lg" 
                className="w-full bg-transparent hover:bg-white text-foreground hover:text-black border border-white/30 tracking-[0.2em] uppercase font-light h-16 rounded-none mb-20 transition-all duration-500"
              >
                {perfume.in_stock ? "Додати до кошика" : "Немає в наявності"}
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-12"
            >
              {perfume.description && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 font-semibold">Легенда</h3>
                  <p className="text-foreground/70 leading-loose text-sm font-light">
                    {perfume.description}
                  </p>
                </div>
              )}

              {perfume.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 font-semibold">Ноти</h3>
                  <p className="text-primary/80 leading-relaxed text-lg italic font-serif tracking-wide">
                    {perfume.notes}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
