import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListPerfumes, useListCategories } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const CATEGORY_CONFIG: Record<string, { gradient: string; accent: string; emoji: string }> = {
  fresh:  { gradient: "from-sky-950 via-blue-900 to-black",   accent: "#7dd3fc", emoji: "🌊" },
  woody:  { gradient: "from-amber-950 via-stone-900 to-black", accent: "#d4a96a", emoji: "🪵" },
  sweet:  { gradient: "from-rose-950 via-purple-900 to-black", accent: "#f9a8d4", emoji: "🌹" },
  smoky:  { gradient: "from-zinc-900 via-neutral-950 to-black", accent: "#a8a29e", emoji: "🔥" },
};

export default function Home() {
  const { data: allPerfumes } = useListPerfumes({});
  const { data: categories } = useListCategories();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.7, 0]);

  const featuredPerfumes = allPerfumes
    ? allPerfumes.filter((p) => p.is_featured).slice(0, 4)
    : [];

  return (
    <div className="w-full bg-background text-foreground">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
      >
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-amber-950/50 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,169,106,0.15)_0%,_transparent_70%)]" />
        </motion.div>

        {/* Floating perfume bottles — decorative */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {allPerfumes?.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.id}
              className="absolute w-20 md:w-28 opacity-10"
              style={{
                left: `${10 + i * 16}%`,
                top: `${15 + (i % 3) * 20}%`,
              }}
              animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 3 : -3, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              <img src={p.image_url || ""} alt="" className="w-full h-auto object-contain" />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/30 to-black/60" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-7xl md:text-9xl lg:text-[11rem] tracking-[0.2em] text-white mb-2 drop-shadow-2xl font-bold uppercase leading-none">
              Bablgam
            </h1>
            <div className="font-serif text-lg md:text-2xl tracking-[0.6em] text-primary/90 uppercase font-light mb-8">
              Parfum
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="text-base md:text-xl text-white/60 font-light tracking-[0.2em] mb-14 max-w-xl mx-auto uppercase"
          >
            Мистецтво в кожній краплі
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link href="/catalog">
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-white tracking-[0.25em] uppercase font-semibold h-14 px-14 rounded-none transition-all duration-500"
              >
                До каталогу
              </Button>
            </Link>
            <Link href="#categories">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 border border-white/30 tracking-[0.25em] uppercase font-light h-14 px-12 rounded-none transition-all duration-500"
              >
                Категорії
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Category Sections ── */}
      <section id="categories" className="py-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="text-center pt-24 pb-16 px-4"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-foreground tracking-[0.1em] mb-6 font-light uppercase">
            Категорії
          </h2>
          <div className="w-px h-12 bg-primary/50 mx-auto mb-6" />
          <p className="text-foreground/50 text-sm tracking-[0.2em] uppercase max-w-lg mx-auto font-light">
            Знайдіть свій аромат серед чотирьох унікальних родин
          </p>
        </motion.div>

        {categories?.map((cat, idx) => {
          const cfg = CATEGORY_CONFIG[cat.slug] ?? { gradient: "from-zinc-900 to-black", accent: "#fff", emoji: "✨" };
          const catPerfumes = allPerfumes
            ?.filter((p) => p.category_id === cat.id)
            .slice(0, 4) ?? [];
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className={`relative overflow-hidden bg-gradient-to-br ${cfg.gradient} min-h-[500px] md:min-h-[600px] flex items-center`}
            >
              {/* Ambient glow */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(ellipse at ${isEven ? "30%" : "70%"} 50%, ${cfg.accent}33 0%, transparent 65%)`,
                }}
              />

              <div className="container mx-auto px-6 md:px-16 py-20 relative z-10">
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>
                  {/* Text block */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    <div className="text-4xl mb-6">{cfg.emoji}</div>
                    <h3
                      className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6 uppercase leading-tight"
                      style={{ color: cfg.accent }}
                    >
                      {cat.name}
                    </h3>
                    <div className="w-12 h-px mb-6" style={{ background: cfg.accent + "80" }} />
                    <p className="text-white/60 text-sm leading-loose font-light tracking-wide mb-10 max-w-sm">
                      {cat.description}
                    </p>
                    <Link href={`/catalog?category=${cat.id}`}>
                      <button
                        className="group flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-semibold transition-all duration-500 hover:gap-5"
                        style={{ color: cfg.accent }}
                      >
                        Переглянути колекцію
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </motion.div>

                  {/* Perfume grid */}
                  <div className="lg:w-3/5 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {catPerfumes.map((perfume, pIdx) => (
                        <motion.div
                          key={perfume.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: pIdx * 0.1 }}
                          className={`group ${pIdx % 2 !== 0 ? "mt-8" : ""}`}
                        >
                          <Link href={`/perfume/${perfume.id}`} className="block">
                            <div className="aspect-[3/4] relative overflow-hidden mb-3 bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-500">
                              <motion.img
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                src={perfume.image_url || "/perfume-placeholder.png"}
                                alt={perfume.name}
                                className="w-full h-full object-contain p-3 transition-all duration-700"
                              />
                            </div>
                            <div className="text-[9px] tracking-[0.2em] uppercase mb-1 opacity-60" style={{ color: cfg.accent }}>
                              {perfume.brand}
                            </div>
                            <div className="font-serif text-sm text-white/90 font-light leading-tight group-hover:text-white transition-colors">
                              {perfume.name}
                            </div>
                            <div className="text-xs mt-1 opacity-50" style={{ color: cfg.accent }}>
                              {formatCurrency(perfume.price_per_ml)} / мл
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Featured perfumes ── */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-background relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-center mb-24 md:mb-32 flex flex-col items-center"
          >
            <h2 className="font-serif text-4xl md:text-6xl text-foreground tracking-[0.1em] mb-8 font-light uppercase">
              Вибір Майстра
            </h2>
            <div className="w-px h-16 bg-primary/50 mb-8" />
            <p className="text-foreground/50 max-w-xl text-center font-light tracking-widest uppercase text-sm leading-loose">
              Найвишуканіші аромати, що залишають незабутній слід
            </p>
          </motion.div>

          {featuredPerfumes.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
            >
              {featuredPerfumes.map((perfume, idx) => (
                <motion.div
                  key={perfume.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className={`group flex flex-col items-center text-center cursor-pointer ${idx % 2 !== 0 ? "md:mt-16" : ""}`}
                >
                  <Link href={`/perfume/${perfume.id}`} className="w-full block">
                    <div className="w-full aspect-[3/4] relative overflow-hidden mb-8 bg-card">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={perfume.image_url || "/perfume-placeholder.png"}
                        alt={perfume.name}
                        className="w-full h-full object-contain p-4 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                      <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white text-[10px] uppercase tracking-[0.3em] border border-white/40 px-4 py-2">
                          Детальніше
                        </span>
                      </div>
                    </div>
                    <div className="text-primary/70 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                      {perfume.brand}
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-3 font-light tracking-wide group-hover:text-primary transition-colors duration-500">
                      {perfume.name}
                    </h3>
                    <div className="text-foreground/50 font-light tracking-widest text-sm">
                      {formatCurrency(perfume.price_per_ml)} / мл
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-32 text-center"
          >
            <Link href="/catalog">
              <Button
                variant="outline"
                className="border-white/20 text-foreground hover:bg-white hover:text-black rounded-none px-16 h-14 uppercase tracking-[0.2em] text-xs transition-all duration-500"
              >
                Вся колекція
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-32 md:py-48 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,169,106,0.08)_0%,_transparent_60%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2"
            >
              <div className="grid grid-cols-2 gap-3">
                {allPerfumes?.filter(p => p.is_featured).slice(0, 4).map((p, i) => (
                  <div
                    key={p.id}
                    className={`aspect-square overflow-hidden bg-white/5 ${i === 0 ? "row-span-2 aspect-auto" : ""}`}
                  >
                    <img
                      src={p.image_url || ""}
                      alt={p.name}
                      className="w-full h-full object-contain p-4 opacity-90 hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2 space-y-10"
            >
              <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-widest font-bold uppercase leading-tight">
                Bablgam<br />
                <span className="text-primary/80 italic font-light text-4xl md:text-5xl">Parfum</span>
              </h2>
              <div className="w-16 h-px bg-primary/40" />
              <div className="space-y-6 text-foreground/60 leading-loose text-base font-light tracking-wide">
                <p>
                  Bablgam Parfum — це не просто бутик парфумерії. Це колекція рідкісних ароматів від найвидатніших парфумерних будинків світу.
                </p>
                <p>
                  Ми пропонуємо розлив ексклюзивних ніш-парфумів — від 1 мл. Спробуйте аромат своєї мрії, не купуючи повний флакон.
                </p>
                <p className="text-primary italic font-serif text-xl tracking-widest">
                  Твій аромат — твоя підпис.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { num: "35+", label: "Ароматів" },
                  { num: "від 1", label: "мл" },
                  { num: "100%", label: "Оригінал" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center border border-white/10 py-6">
                    <div className="font-serif text-2xl text-primary font-light mb-1">{stat.num}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
