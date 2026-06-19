import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListOrders, 
  useGetOrder,
  useUpdateOrder,
  getListOrdersQueryKey,
  getGetStatsQueryKey
} from "@workspace/api-client-react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: orders, isLoading } = useListOrders(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  
  const updateOrder = useUpdateOrder();

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateOrder.mutate(
      { id: orderId, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          toast({ title: "Статус оновлено" });
          setSelectedOrder(null);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Помилка оновлення" });
        }
      }
    );
  };

  const { data: orderDetails, isLoading: isOrderLoading } = useGetOrder(
    selectedOrder || 0,
    { query: { enabled: !!selectedOrder } }
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-serif text-3xl text-foreground">Замовлення</h1>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-card border-border rounded-none">
            <SelectValue placeholder="Всі статуси" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border">
            <SelectItem value="all">Всі статуси</SelectItem>
            <SelectItem value="pending">Нові</SelectItem>
            <SelectItem value="accepted">В роботі</SelectItem>
            <SelectItem value="completed">Виконані</SelectItem>
            <SelectItem value="cancelled">Скасовані</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Клієнт</th>
                <th className="px-6 py-4 font-medium">Дата</th>
                <th className="px-6 py-4 font-medium">Сума</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Завантаження...</td>
                </tr>
              ) : orders?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Замовлень не знайдено</td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                    </td>
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
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedOrder(order.id)}
                        className="text-primary hover:text-primary hover:bg-primary/10 rounded-none uppercase tracking-widest text-[10px]"
                      >
                        Деталі
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-card border border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal tracking-wider">
              Замовлення #{orderDetails?.id}
            </DialogTitle>
          </DialogHeader>

          {isOrderLoading ? (
            <div className="py-12 text-center text-muted-foreground">Завантаження деталей...</div>
          ) : orderDetails ? (
            <div className="space-y-8 mt-4">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Клієнт</h4>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{orderDetails.customer_name}</p>
                    <p className="text-muted-foreground">{orderDetails.customer_phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Доставка</h4>
                  <p className="text-foreground">{orderDetails.customer_address || "Не вказано"}</p>
                </div>
                {orderDetails.customer_comment && (
                  <div className="col-span-2">
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Коментар</h4>
                    <p className="text-foreground bg-background p-3 border border-border/50">{orderDetails.customer_comment}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Товари</h4>
                <div className="space-y-4">
                  {orderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <div className="font-serif text-lg text-foreground">{item.perfume_name}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">{item.brand} • {item.ml} мл</div>
                      </div>
                      <div className="font-medium text-primary">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-serif text-xl uppercase tracking-widest">Разом</span>
                  <span className="font-serif text-2xl text-primary">{formatCurrency(orderDetails.total)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-border">
                {orderDetails.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleStatusUpdate(orderDetails.id, 'accepted')}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-none tracking-widest uppercase text-xs"
                    >
                      В роботу
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate(orderDetails.id, 'cancelled')}
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-none tracking-widest uppercase text-xs"
                    >
                      Скасувати
                    </Button>
                  </>
                )}
                {orderDetails.status === 'accepted' && (
                  <Button 
                    onClick={() => handleStatusUpdate(orderDetails.id, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none tracking-widest uppercase text-xs"
                  >
                    Виконано
                  </Button>
                )}
                <Button 
                  onClick={() => setSelectedOrder(null)}
                  variant="ghost"
                  className="ml-auto rounded-none tracking-widest uppercase text-xs text-muted-foreground"
                >
                  Закрити
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
