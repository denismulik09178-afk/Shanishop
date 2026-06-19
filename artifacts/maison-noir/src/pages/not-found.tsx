import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <h1 className="font-serif text-8xl md:text-9xl text-primary tracking-widest mb-4 opacity-50">404</h1>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Сторінку не знайдено</h2>
      <p className="text-muted-foreground max-w-md mb-12 font-light">
        Аромат, який ви шукаєте, розвіявся у повітрі або ніколи не існував.
      </p>
      <Link href="/">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase font-semibold rounded-none px-8 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          Повернутися до витоків
        </Button>
      </Link>
    </div>
  );
}
