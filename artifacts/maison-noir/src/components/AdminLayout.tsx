import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Package, 
  Tags, 
  ShoppingCart, 
  LogOut,
  Menu,
  X,
  Activity
} from "lucide-react";
import { useAdminMe, useAdminLogout, useHealthCheck } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: adminMe, isLoading } = useAdminMe();
  const { data: healthData } = useHealthCheck();
  const logout = useAdminLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !adminMe?.authenticated) {
      setLocation("/admin");
    }
  }, [adminMe, isLoading, setLocation]);

  if (isLoading || !adminMe?.authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-serif text-xl tracking-widest">BABLGAM PARFUM</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout.mutate({}, {
      onSuccess: () => {
        setLocation("/admin");
      }
    });
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Дашборд", icon: BarChart3 },
    { href: "/admin/orders", label: "Замовлення", icon: ShoppingCart },
    { href: "/admin/perfumes", label: "Парфуми", icon: Package },
    { href: "/admin/categories", label: "Категорії", icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link href="/" className="font-serif text-xl tracking-widest text-primary">
              BABLGAM PARFUM
            </Link>
            <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-none transition-colors cursor-pointer
                    ${isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent'}
                  `}>
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 px-4 py-2 mb-2 text-xs text-muted-foreground tracking-widest uppercase">
              <Activity size={14} className={healthData?.status === "ok" ? "text-emerald-500" : "text-destructive"} />
              API: {healthData?.status === "ok" ? "ОК" : "Помилка"}
            </div>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
              <LogOut size={18} className="mr-3" />
              Вийти
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm text-muted-foreground">Адміністратор</div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
