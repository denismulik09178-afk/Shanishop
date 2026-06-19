import { useGetStats } from "@workspace/api-client-react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Link } from "wouter";
import { 
  ShoppingBag, 
  Clock, 
  Package, 
  Banknote,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-card rounded border border-border"></div>;
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Нові замовлення",
      value: stats.pending_orders,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Всього замовлень",
      value: stats.total_orders,
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      title: "Дохід",
      value: formatCurrency(stats.total_revenue),
      icon: Banknote,
      color: "text-emerald-500",
    },
    {
      title: "Парфумів у каталозі",
      value: stats.total_perfumes,
      icon: Package,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-foreground">Огляд</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-card border border-border p-6 rounded-none flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{card.title}</p>
                <h3 className="font-serif text-3xl text-foreground">{card.value}</h3>
              </div>
              <div className={`p-3 bg-background rounded-full ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl text-foreground">Останні замовлення</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            Всі замовлення <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Клієнт</th>
                <th className="px-6 py-4 font-medium">Дата</th>
                <th className="px-6 py-4 font-medium">Сума</th>
                <th className="px-6 py-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recent_orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Немає замовлень
                  </td>
                </tr>
              ) : (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">#{order.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{order.customer_name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDateTime(order.created_at)}</td>
                    <td className="px-6 py-4 font-serif text-primary">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        order.status === 'accepted' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {order.status === 'pending' ? 'Нове' :
                         order.status === 'accepted' ? 'В роботі' :
                         order.status === 'completed' ? 'Виконано' : 'Скасовано'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
