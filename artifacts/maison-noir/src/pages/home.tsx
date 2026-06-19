import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListPerfumes } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const { data: featuredPerfumes, isLoading } = useListPerfumes({ sort: "id:desc" });

  const displayPerfumes = featuredPerfumes 
    ? (featuredPerfumes.filter(p => p.is_featured).length > 0 
        ? featuredPerfumes.filter(p => p.is_featured).slice(0, 4) 
        : featuredPerfumes.slice(0, 4))
    : [];

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Maison Noir Boutique" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/40 to-black/60 mix-blend-multiply" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-[0.15em] text-white mb-8 drop-shadow-2xl font-light uppercase">
              Maison Noir
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-lg md:text-2xl text-white/70 font-light tracking-[0.2em] mb-12 max-w-2xl mx-auto uppercase"
          >
            Мистецтво в кожній краплі
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            <Link href="/catalog">
              <Button size="lg" className="bg-transparent text-white hover:bg-white hover:text-black tracking-[0.25em] uppercase font-light h-14 px-12 rounded-none border border-white/30 transition-all duration-700">
                До каталогу
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Perfumes */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-background relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-center mb-24 md:mb-32 flex flex-col items-center"
          >
            <h2 className="font-serif text-4xl md:text-6xl text-foreground tracking-[0.1em] mb-8 font-light uppercase">Вибір Майстра</h2>
            <div className="w-px h-16 bg-primary/50 mb-8"></div>
            <p className="text-foreground/50 max-w-xl text-center font-light tracking-widest uppercase text-sm leading-loose">
              Колекція найвишуканіших ароматів, створених для того, щоб залишати незабутній слід в пам'яті.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-[3/4] bg-white/5"></div>
                  <div className="h-2 bg-white/5 w-1/2 mx-auto"></div>
                  <div className="h-4 bg-white/5 w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
            >
              {displayPerfumes.map((perfume, idx) => (
                <motion.div key={perfume.id} variants={itemVariants} className={`group flex flex-col items-center text-center cursor-pointer ${idx % 2 !== 0 ? 'md:mt-16' : ''}`}>
                  <Link href={`/perfume/${perfume.id}`} className="w-full block">
                    <div className="w-full aspect-[3/4] relative overflow-hidden mb-8 bg-card">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={perfume.image_url || "/perfume-placeholder.png"} 
                        alt={perfume.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                    </div>
                    <div className="text-primary/70 text-xs font-semibold tracking-[0.25em] uppercase mb-4">{perfume.brand}</div>
                    <h3 className="font-serif text-2xl text-foreground mb-4 font-light tracking-wide group-hover:text-primary transition-colors duration-500">{perfume.name}</h3>
                    <div className="text-foreground/50 font-light tracking-widest text-sm">{formatCurrency(perfume.price_per_ml)} / мл</div>
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
              <Button variant="outline" className="border-white/20 text-foreground hover:bg-white hover:text-black rounded-none px-12 h-14 uppercase tracking-[0.2em] text-xs transition-all duration-500">
                Уся колекція
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section - Manifesto */}
      <section id="about" className="py-32 md:py-48 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] relative z-10 w-full overflow-hidden">
                <img src="/about.png" alt="Maison Noir Atelier" className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale contrast-125" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2 space-y-12"
            >
              <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-widest font-light uppercase leading-tight">
                Мистецтво<br/>
                <span className="text-primary/80 italic font-normal">Темряви</span>
              </h2>
              <div className="w-16 h-px bg-white/20"></div>
              
              <div className="space-y-8 text-foreground/60 leading-loose text-lg font-light tracking-wide">
                <p>
                  Maison Noir — це не просто бутик парфумерії. Це святилище рідкісних ароматів, зібраних з найтемніших куточків світу. 
                </p>
                <p>
                  Ми віримо, що справжня розкіш полягає в деталях. Кожен парфум у нашій колекції — це шедевр ольфакторного мистецтва, створений видатними майстрами. 
                </p>
                <p className="text-primary italic font-serif text-2xl tracking-widest">
                  Дозвольте аромату стати вашим найщирішим секретом.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
