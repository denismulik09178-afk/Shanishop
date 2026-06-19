import { Link } from "wouter";
import { ArrowRight, Sparkles, Droplet, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListPerfumes } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";

export default function Home() {
  const { data: featuredPerfumes, isLoading } = useListPerfumes({ sort: "id:desc" });

  // Get only featured or take first 4 if none are marked featured
  const displayPerfumes = featuredPerfumes 
    ? (featuredPerfumes.filter(p => p.is_featured).length > 0 
        ? featuredPerfumes.filter(p => p.is_featured).slice(0, 4) 
        : featuredPerfumes.slice(0, 4))
    : [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Maison Noir Boutique" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-widest text-primary mb-6 drop-shadow-2xl">
            MAISON NOIR
          </h1>
          <p className="text-lg md:text-2xl text-foreground/90 font-light tracking-wide mb-10 max-w-2xl mx-auto">
            Ексклюзивна нішева парфумерія для обраних. Відчуйте розкіш у кожній краплі.
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase font-semibold h-14 px-8 rounded-none border border-primary/20 hover:border-primary/50 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              До каталогу
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Perfumes */}
      <section className="py-24 md:py-32 px-4 md:px-8 bg-background relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wider mb-4">Вибір Майстра</h2>
            <div className="w-12 h-0.5 bg-primary mt-4 mb-6"></div>
            <p className="text-muted-foreground max-w-xl text-center">
              Колекція найвишуканіших ароматів, створених для того, щоб залишати незабутній слід в пам'яті.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-muted/20"></div>
                  <div className="h-4 bg-muted/20 w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted/20 w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {displayPerfumes.map((perfume) => (
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
                        Переглянути <ArrowRight size={14} />
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
          
          <div className="mt-20 text-center">
            <Link href="/catalog">
              <Button variant="outline" className="border-border text-foreground hover:bg-white/5 hover:text-primary rounded-none px-10 h-12 uppercase tracking-widest text-sm transition-all duration-300">
                Уся колекція
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] relative z-10 w-[90%] md:w-full overflow-hidden">
                <img src="/about.png" alt="Maison Noir Atelier" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-10 right-0 w-[80%] h-full border border-primary/30 z-0 translate-x-4 lg:translate-x-8"></div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wider">
                Мистецтво<br/>
                <span className="text-primary italic">Темряви</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary"></div>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-light">
                <p>
                  Maison Noir — це не просто бутик парфумерії. Це святилище рідкісних ароматів, зібраних з найтемніших куточків світу. 
                </p>
                <p>
                  Ми віримо, що справжня розкіш полягає в деталях. Кожен парфум у нашій колекції — це шедевр ольфакторного мистецтва, створений видатними майстрами. Ми пропонуємо можливість доторкнутися до прекрасного через унікальний формат розпиву.
                </p>
                <p>
                  Дозвольте аромату стати вашим найщирішим секретом.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP / Why Us */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Sparkles size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl tracking-wide">Автентичність</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                Лише 100% оригінальні аромати від офіційних дистриб'юторів.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Droplet size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl tracking-wide">Точність</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                Ювелірний розпив з точністю до краплі у скляні флакони преміум-класу.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl tracking-wide">Довіра</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                Тисячі задоволених клієнтів, які повертаються до нас знову.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 bg-card border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Секретне Товариство</h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Залиште свій email, щоб першими дізнаватися про надходження рідкісних екземплярів та закриті розпродажі.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="flex-1 bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors rounded-none"
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-3 h-auto tracking-wider uppercase text-sm font-semibold">
              Приєднатися
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
