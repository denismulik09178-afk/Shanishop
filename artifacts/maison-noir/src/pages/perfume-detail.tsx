import { useState, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetPerfume, useListPerfumes } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const PRESET_VOLUMES = [1, 2, 3, 5, 10];

export default function PerfumeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [selectedVolume, setSelectedVolume] = useState<number>(5);
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [customMode, setCustomMode] = useState(false);

  const { data: perfume, isLoading } = useGetPerfume(id, {
    query: { enabled: !!id },
  });
  const { data: allPerfumes } = useListPerfumes({});

  const relatedPerfumes = allPerfumes
    ?.filter((p) => p.id !== id && p.category_id === perfume?.category_id)
    .slice(0, 4) ?? [];

  const activeVolume = customMode ? sliderValue : selectedVolume;

  const handlePresetClick = (vol: number) => {
    setSelectedVolume(vol);
    setSliderValue(vol);
    setCustomMode(false);
  };

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setSliderValue(v);
    setCustomMode(true);
  }, []);

  const handleAddToCart = () => {
    if (!perfume) return;
    addToCart(perfume, activeVolume);
    toast({
      title: "✅ Додано до кошика",
      description: `${perfume.name} · ${activeVolume} мл — ${formatCurrency(perfume.price_per_ml * activeVolume)}`,
    });
  };

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
          <h1 className="font-serif text-4xl text-foreground font-light tracking-widest uppercase">
            Аромат не знайдено
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Back */}
      <div className="pt-28 pb-4 px-6 md:px-12 container mx-auto max-w-7xl">
        <Link href="/catalog">
          <button className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors duration-300">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Назад до каталогу
          </button>
        </Link>
      </div>

      <div className="pt-8 pb-48 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2"
            >
              <div className="aspect-[3/4] relative bg-card overflow-hidden group">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src={perfume.image_url || "/perfume-placeholder.png"}
                  alt={perfume.name}
                  className="w-full h-full object-contain p-8 transition-all duration-1000"
                />
                {/* Category badge */}
                {perfume.category_name && (
                  <div className="absolute top-6 left-6 border border-white/20 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-foreground/50">
                    {perfume.category_name}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2 flex flex-col justify-center py-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4"
              >
                {perfume.brand}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 font-light tracking-wide uppercase leading-tight"
              >
                {perfume.name}
              </motion.h1>

              {/* Price display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-end gap-4 mb-10 border-b border-white/10 pb-8"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeVolume}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-serif text-foreground tracking-widest font-light"
                  >
                    {formatCurrency(perfume.price_per_ml * activeVolume)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-foreground/40 text-xs tracking-widest uppercase mb-1 pb-1">
                  {formatCurrency(perfume.price_per_ml)} / мл
                </span>
              </motion.div>

              {/* Volume selector */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-10"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-semibold">
                    Об'єм на розпив
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeVolume}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-serif text-primary tracking-widest"
                    >
                      {activeVolume} мл
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Preset buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {PRESET_VOLUMES.map((vol) => (
                    <button
                      key={vol}
                      onClick={() => handlePresetClick(vol)}
                      className={`
                        w-14 h-14 border text-sm font-medium transition-all duration-400 flex items-center justify-center tracking-wider
                        ${!customMode && selectedVolume === vol
                          ? "border-primary bg-primary text-black"
                          : "border-white/20 text-foreground hover:border-white/50 hover:bg-white/5"
                        }
                      `}
                    >
                      {vol}
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomMode(true)}
                    className={`
                      px-4 h-14 border text-xs font-medium transition-all duration-400 tracking-widest uppercase
                      ${customMode
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/20 text-foreground/50 hover:border-white/50 hover:bg-white/5"
                      }
                    `}
                  >
                    Свій обсяг
                  </button>
                </div>

                {/* Slider */}
                <AnimatePresence>
                  {customMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                          <span>1 мл</span>
                          <span className="text-primary font-semibold">{sliderValue} мл</span>
                          <span>50 мл</span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min={1}
                            max={50}
                            value={sliderValue}
                            onChange={handleSlider}
                            className="w-full h-1 bg-white/20 rounded-none appearance-none cursor-pointer accent-primary"
                            style={{
                              background: `linear-gradient(to right, var(--primary) ${((sliderValue - 1) / 49) * 100}%, rgba(255,255,255,0.15) ${((sliderValue - 1) / 49) * 100}%)`,
                            }}
                          />
                        </div>
                        <div className="text-center text-xs text-foreground/50 tracking-widest">
                          Вартість: <span className="text-primary font-serif text-lg">{formatCurrency(perfume.price_per_ml * sliderValue)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Add to cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-12"
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={!perfume.in_stock}
                  size="lg"
                  className="w-full bg-primary text-black hover:bg-white border-0 tracking-[0.2em] uppercase font-semibold h-16 rounded-none transition-all duration-500 text-sm"
                >
                  {perfume.in_stock
                    ? `Додати ${activeVolume} мл — ${formatCurrency(perfume.price_per_ml * activeVolume)}`
                    : "Немає в наявності"}
                </Button>
              </motion.div>

              {/* Description & notes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="space-y-8"
              >
                {perfume.description && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3 font-semibold">
                      Опис
                    </h3>
                    <p className="text-foreground/70 leading-loose text-sm font-light">
                      {perfume.description}
                    </p>
                  </div>
                )}

                {perfume.notes && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3 font-semibold">
                      Ноти
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {perfume.notes.split(" · ").map((note) => (
                        <span
                          key={note}
                          className="border border-primary/30 text-primary/80 text-xs px-3 py-1 tracking-widest font-light"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Related perfumes */}
          {relatedPerfumes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="mt-32 pt-16 border-t border-white/10"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-[0.1em] mb-16 font-light uppercase text-center">
                Схожі аромати
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {relatedPerfumes.map((p) => (
                  <Link key={p.id} href={`/perfume/${p.id}`} className="group block text-center">
                    <div className="aspect-[3/4] bg-card mb-4 overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 1 }}
                        src={p.image_url || "/perfume-placeholder.png"}
                        alt={p.name}
                        className="w-full h-full object-contain p-4 transition-all duration-700"
                      />
                    </div>
                    <div className="text-primary/70 text-[9px] tracking-[0.25em] uppercase mb-2">{p.brand}</div>
                    <div className="font-serif text-base font-light text-foreground group-hover:text-primary transition-colors">{p.name}</div>
                    <div className="text-foreground/40 text-xs mt-1">{formatCurrency(p.price_per_ml)} / мл</div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
