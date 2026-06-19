import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useListPerfumes, useListCategories } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { ArrowRight } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function Catalog() {
  const search = useSearch();
  const urlCategoryId = new URLSearchParams(search).get("category");
  const [categoryId, setCategoryId] = useState<number | null>(urlCategoryId ? parseInt(urlCategoryId) : null);
  const [sort, setSort] = useState<string>("id:desc");

  useEffect(() => {
    const id = new URLSearchParams(search).get("category");
    setCategoryId(id ? parseInt(id) : null);
  }, [search]);

  const { data: categories } = useListCategories();
  const { data: perfumes, isLoading } = useListPerfumes({ 
    category_id: categoryId ?? undefined,
    sort
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full pt-32 pb-48 px-6 md:px-12 bg-background min-h-screen text-foreground">
      <div className="container mx-auto max-w-7xl mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground tracking-[0.15em] mb-8 font-light uppercase">Колекція</h1>
          <div className="w-px h-16 bg-primary/50 mx-auto"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20 border-b border-white/5 pb-10"
        >
          <div className="flex flex-wrap justify-center gap-6 w-full md:w-auto">
            <button 
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 pb-2 border-b-2 ${categoryId === null ? 'text-primary border-primary' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
              onClick={() => setCategoryId(null)}
            >
              Всі аромати
            </button>
            {categories?.map((cat) => (
              <button 
                key={cat.id}
                className={`text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 pb-2 border-b-2 ${categoryId === cat.id ? 'text-primary border-primary' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center w-full md:w-auto self-end md:self-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[240px] rounded-none border-b border-t-0 border-l-0 border-r-0 border-white/20 bg-transparent text-xs tracking-widest uppercase focus:ring-0">
                <SelectValue placeholder="Сортування" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-white/10 bg-black backdrop-blur-xl">
                <SelectItem value="id:desc" className="text-xs tracking-widest uppercase py-3 cursor-pointer">Новинки</SelectItem>
                <SelectItem value="price_per_ml:asc" className="text-xs tracking-widest uppercase py-3 cursor-pointer">Від найдешевших</SelectItem>
                <SelectItem value="price_per_ml:desc" className="text-xs tracking-widest uppercase py-3 cursor-pointer">Від найдорожчих</SelectItem>
                <SelectItem value="name:asc" className="text-xs tracking-widest uppercase py-3 cursor-pointer">За назвою (А-Я)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-[3/4] bg-white/5"></div>
                  <div className="h-2 bg-white/5 w-1/2 mx-auto"></div>
                  <div className="h-4 bg-white/5 w-3/4 mx-auto"></div>
                </div>
              ))}
            </motion.div>
          ) : perfumes?.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 text-foreground/50"
            >
              <p className="text-3xl font-serif font-light tracking-widest uppercase">Ароматів не знайдено</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24"
            >
              {perfumes?.map((perfume, idx) => (
                <motion.div key={perfume.id} variants={itemVariants} className={`group flex flex-col items-center text-center cursor-pointer ${idx % 2 !== 0 ? 'lg:mt-16' : ''}`}>
                  <Link href={`/perfume/${perfume.id}`} className="w-full block">
                    <div className="w-full aspect-[3/4] relative overflow-hidden mb-8 bg-card">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={perfume.image_url || "/perfume-placeholder.png"} 
                        alt={perfume.name}
                        className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/40 backdrop-blur-sm">
                        <span className="text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-3">
                          Відкрити <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                    <div className="text-primary/70 text-xs font-semibold tracking-[0.25em] uppercase mb-4">{perfume.brand}</div>
                    <h3 className="font-serif text-2xl text-foreground mb-4 font-light tracking-wide group-hover:text-primary transition-colors duration-500">{perfume.name}</h3>
                    <div className="text-foreground/50 font-light tracking-widest text-sm">{formatCurrency(perfume.price_per_ml)} / мл</div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
