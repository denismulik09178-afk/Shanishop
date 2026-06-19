import { useState } from "react";
import { Link } from "wouter";
import { useListPerfumes, useListCategories } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { ArrowRight, Filter, ChevronDown } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Catalog() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sort, setSort] = useState<string>("id:desc");

  const { data: categories } = useListCategories();
  const { data: perfumes, isLoading } = useListPerfumes({ 
    category_id: categoryId ?? undefined,
    sort
  });

  return (
    <div className="w-full pt-24 pb-32 px-4 md:px-8 bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl mt-8">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider mb-4 text-center">Колекція</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-16"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className={`rounded-none border-border ${categoryId === null ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground hover:bg-white/5'}`}
              onClick={() => setCategoryId(null)}
            >
              Всі аромати
            </Button>
            {categories?.map((cat) => (
              <Button 
                key={cat.id}
                variant="outline" 
                className={`rounded-none border-border ${categoryId === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground hover:bg-white/5'}`}
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto self-end md:self-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px] rounded-none border-border bg-transparent">
                <SelectValue placeholder="Сортування" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                <SelectItem value="id:desc">Новинки</SelectItem>
                <SelectItem value="price_per_ml:asc">Від найдешевших</SelectItem>
                <SelectItem value="price_per_ml:desc">Від найдорожчих</SelectItem>
                <SelectItem value="name:asc">За назвою (А-Я)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-muted/20"></div>
                <div className="h-4 bg-muted/20 w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted/20 w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : perfumes?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl font-serif">Ароматів не знайдено</p>
            <p className="mt-2">Спробуйте змінити фільтри</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {perfumes?.map((perfume) => (
              <Link key={perfume.id} href={`/perfume/${perfume.id}`} className="group flex flex-col items-center text-center cursor-pointer">
                <div className="w-full aspect-[3/4] relative overflow-hidden mb-6 bg-card">
                  <img 
                    src={perfume.image_url || "/perfume-placeholder.png"} 
                    alt={perfume.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-primary text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                      Відкрити <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-2">{perfume.brand}</div>
                <h3 className="font-serif text-xl text-foreground mb-3">{perfume.name}</h3>
                <div className="text-primary font-medium">{formatCurrency(perfume.price_per_ml)} / мл</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
