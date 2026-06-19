import { useState } from "react";
import { useParams } from "wouter";
import { useGetPerfume } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="animate-pulse text-primary font-serif text-xl tracking-widest">Завантаження...</div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-3xl text-foreground">Аромат не знайдено</h1>
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
    <div className="w-full pt-24 pb-32 px-4 md:px-8 bg-background min-h-[calc(100vh-300px)]">
      <div className="container mx-auto max-w-6xl mt-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Image */}
          <div className="lg:w-1/2">
            <div className="aspect-[3/4] relative bg-card overflow-hidden">
              <img 
                src={perfume.image_url || "/perfume-placeholder.png"} 
                alt={perfume.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              {perfume.brand}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              {perfume.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-serif text-foreground">
                {formatCurrency(perfume.price_per_ml * selectedVolume)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({formatCurrency(perfume.price_per_ml)} / 1 мл)
              </span>
            </div>

            <div className="mb-10">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-semibold">Об'єм на розпив</h3>
              <div className="flex flex-wrap gap-3">
                {VOLUMES.map(vol => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`
                      px-4 py-2 border text-sm font-medium transition-all duration-300
                      ${selectedVolume === vol 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border text-foreground hover:border-primary/50'
                      }
                    `}
                  >
                    {vol} мл
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAddToCart}
              disabled={!perfume.in_stock}
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase font-semibold h-14 rounded-none mb-12 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
            >
              {perfume.in_stock ? "Додати до кошика" : "Немає в наявності"}
            </Button>

            <div className="space-y-8">
              {perfume.description && (
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-foreground mb-3 font-semibold">Опис аромату</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {perfume.description}
                  </p>
                </div>
              )}

              {perfume.notes && (
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-foreground mb-3 font-semibold">Ноти</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm italic font-serif">
                    {perfume.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
