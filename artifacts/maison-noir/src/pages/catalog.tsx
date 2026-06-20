import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useListPerfumes, useListCategories } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { ArrowRight, SearchX } from "lucide-react";
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
  const urlSearch = new URLSearchParams(search).get("search") || "";
  const [categoryId, setCategoryId] = useState<number | null>(urlCategoryId ? parseInt(urlCategoryId) : null);
  const [sort, setSort] = useState<string>("id:desc");
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const id = params.get("category");
    const q = params.get("search") || "";
    setCategoryId(id ? parseInt(id) : null);
    setSearchTerm(q);
  }, [search]);

  const { data: categories } = useListCategories();
  const { data: perfumes, isLoading } = useListPerfumes({
    category_id: categoryId ?? undefined,
    sort,
    search: searchTerm || undefined,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-4 md:px-12 bg-background min-h-screen text-foreground">
      <div className="container mx-auto max-w-7xl mt-4 md:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12 md:mb-24"
        >
          <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl text-foreground tracking-[0.1em] md:tracking-[0.15em] mb-6 md:mb-8 font-light uppercase">
            {searchTerm ? `«${searchTerm}»` : "Колекція"}
          </h1>
          <div className="w-px h-10 md:h-16 bg-primary/50 mx-auto" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-12 md:mb-20 border-b border-white/5 pb-8 md:pb-10"
        >
          {/* Category buttons - horizontal scroll on mobile */}
          <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
              <button
                className={`whitespace-nowrap text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 pb-2 border-b-2 shrink-0 ${categoryId === null && !searchTerm ? 'text-primary border-primary' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
                onClick={() => { setCategoryId(null); setSearchTerm(""); }}
              >
                Всі аромати
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  className={`whitespace-nowrap text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 pb-2 border-b-2 shrink-0 ${categoryId === cat.id ? 'text-primary border-primary' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
                  onClick={() => { setCategoryId(cat.id); setSearchTerm(""); }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-[220px] rounded-none border-b border-t-0 border-l-0 border-r-0 border-white/20 bg-transparent text-xs tracking-widest uppercase focus:ring-0">
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
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-14 md:gap-y-24"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-white/5" />
                  <div className="h-2 bg-white/5 w-1/2 mx-auto" />
                  <div className="h-4 bg-white/5 w-3/4 mx-auto" />
                </div>
              ))}
            </motion.div>
          ) : perfumes?.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 text-foreground/50 flex flex-col items-center gap-6"
            >
              <SearchX className="w-12 h-12 text-foreground/20" />
              <p className="text-2xl md:text-3xl font-serif font-light tracking-widest uppercase">Ароматів не знайдено</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-xs uppercase tracking-[0.2em] text-primary/70 hover:text-primary border border-primary/30 px-6 py-3 transition-colors"
                >
                  Скинути пошук
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-24"
            >
              {perfumes?.map((perfume, idx) => (
                <motion.div
                  key={perfume.id}
                  variants={itemVariants}
                  className={`group flex flex-col items-center text-center cursor-pointer ${idx % 2 !== 0 ? 'lg:mt-16' : ''}`}
                >
                  <Link href={`/perfume/${perfume.id}`} className="w-full block">
                    <div className="w-full aspect-[3/4] relative overflow-hidden mb-4 md:mb-8 bg-card">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={perfume.image_url || "/perfume-placeholder.png"}
                        alt={perfume.name}
                        className="w-full h-full object-cover transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                      <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/40 backdrop-blur-sm">
                        <span className="text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-3">
                          Відкрити <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                    <div className="text-primary/70 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase mb-2 md:mb-4">{perfume.brand}</div>
                    <h3 className="font-serif text-base md:text-2xl text-foreground mb-2 md:mb-4 font-light tracking-wide group-hover:text-primary transition-colors duration-500 leading-snug px-1">{perfume.name}</h3>
                    <div className="text-foreground/50 font-light tracking-widest text-xs md:text-sm">{formatCurrency(perfume.price_per_ml)} / мл</div>
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
