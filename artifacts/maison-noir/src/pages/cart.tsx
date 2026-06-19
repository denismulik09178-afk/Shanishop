import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  customer_name: z.string().min(2, "Введіть ваше ім'я"),
  customer_phone: z.string().min(10, "Введіть коректний номер телефону"),
  customer_address: z.string().optional(),
  customer_comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      customer_comment: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (items.length === 0) return;

    createOrder.mutate(
      {
        data: {
          ...values,
          items: items.map(item => ({
            perfume_id: item.perfume.id,
            ml: item.ml
          }))
        }
      },
      {
        onSuccess: () => {
          clearCart();
          toast({
            title: "Замовлення оформлено",
            description: "Ми зв'яжемося з вами найближчим часом для підтвердження.",
          });
          setLocation("/");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Помилка",
            description: "Не вдалося оформити замовлення. Спробуйте пізніше.",
          });
        }
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">Кошик порожній</h1>
          <p className="text-muted-foreground">
            Відкрийте для себе світ розкішних ароматів у нашому каталозі.
          </p>
          <Link href="/catalog">
            <Button className="mt-4 rounded-none px-8 tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90">
              Перейти до каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 pb-32 px-4 md:px-8 bg-background min-h-[calc(100vh-300px)]">
      <div className="container mx-auto max-w-6xl mt-8">
        <h1 className="font-serif text-3xl md:text-5xl text-foreground tracking-wider mb-12">Кошик</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:w-3/5 space-y-6">
            <div className="border-b border-border pb-4 hidden md:grid grid-cols-12 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              <div className="col-span-6">Товар</div>
              <div className="col-span-2 text-center">Об'єм</div>
              <div className="col-span-3 text-right">Вартість</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-6 md:space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-border/50 pb-6 md:pb-4">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-20 bg-card shrink-0">
                      <img 
                        src={item.perfume.image_url || "/perfume-placeholder.png"} 
                        alt={item.perfume.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-primary tracking-widest uppercase mb-1">{item.perfume.brand}</div>
                      <Link href={`/perfume/${item.perfume.id}`} className="font-serif text-lg text-foreground hover:text-primary transition-colors">
                        {item.perfume.name}
                      </Link>
                      <div className="md:hidden mt-1 text-sm text-muted-foreground">{item.ml} мл</div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 hidden md:block text-center text-foreground font-medium">
                    {item.ml} мл
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                    <span className="md:hidden text-sm text-muted-foreground tracking-wide">Вартість:</span>
                    <span className="font-serif text-lg text-foreground">
                      {formatCurrency(item.perfume.price_per_ml * item.ml)}
                    </span>
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-border">
              <span className="font-serif text-xl tracking-wider text-foreground uppercase">Разом</span>
              <span className="font-serif text-3xl text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-2/5">
            <div className="bg-card p-6 md:p-8 border border-border">
              <h2 className="font-serif text-2xl tracking-wider text-foreground mb-6 uppercase">Оформлення</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Ім'я та Прізвище</FormLabel>
                        <FormControl>
                          <Input placeholder="Ваше ім'я" className="rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+38 (000) 000 00 00" className="rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Адреса доставки (Нова Пошта)</FormLabel>
                        <FormControl>
                          <Input placeholder="Місто, номер відділення" className="rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Коментар</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Особливі побажання..." className="rounded-none bg-background border-border focus-visible:ring-primary min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={createOrder.isPending}
                    className="w-full h-14 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest uppercase font-semibold mt-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  >
                    {createOrder.isPending ? "Обробка..." : "Підтвердити замовлення"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
