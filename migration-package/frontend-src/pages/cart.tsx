import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { useCreateOrder, useAdminLogin, useAdminMe } from "@workspace/api-client-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const formSchema = z.object({
  customer_name: z.string().min(2, "Введіть ваше ім'я"),
  customer_phone: z.string().min(10, "Введіть коректний номер телефону"),
  nova_poshta_city: z.string().min(2, "Введіть місто"),
  nova_poshta_branch: z.string().min(1, "Введіть номер відділення"),
  customer_comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const inputCls =
  "rounded-none bg-transparent border-t-0 border-l-0 border-r-0 border-b border-white/20 focus-visible:ring-0 focus-visible:border-primary text-sm tracking-wide px-0 py-4 h-auto placeholder:text-white/20";
const labelCls = "text-[10px] uppercase tracking-[0.2em] text-foreground/50";

const adminPasswordSchema = z.object({ password: z.string().min(1) });

function AdminModal({ onClose }: { onClose: () => void }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();
  const { data: adminMe } = useAdminMe();
  const form = useForm<z.infer<typeof adminPasswordSchema>>({
    resolver: zodResolver(adminPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (adminMe?.authenticated) {
      setLocation("/admin/dashboard");
    }
  }, [adminMe, setLocation]);

  const onSubmit = (values: z.infer<typeof adminPasswordSchema>) => {
    login.mutate(
      { data: { password: values.password } },
      {
        onSuccess: () => setLocation("/admin/dashboard"),
        onError: () => {
          toast({ variant: "destructive", title: "Невірний пароль" });
          form.reset();
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-xl flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background border border-white/10 p-8 md:p-12 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl tracking-widest text-primary uppercase mb-1">Адмін</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">Введіть пароль доступу</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-none bg-transparent border-t-0 border-l-0 border-r-0 border-b border-white/20 focus-visible:ring-0 focus-visible:border-primary text-center tracking-[0.3em] h-14 text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-none bg-primary text-black hover:bg-white tracking-widest uppercase font-semibold h-12"
            >
              {login.isPending ? "..." : "Увійти"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
}

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 5) {
      setAdminModalOpen(true);
      setSecretClicks(0);
    }
    setTimeout(() => setSecretClicks(0), 3000);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      nova_poshta_city: "",
      nova_poshta_branch: "",
      customer_comment: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (items.length === 0) return;
    const address = `${values.nova_poshta_city}, Нова Пошта відділення №${values.nova_poshta_branch}`;
    createOrder.mutate(
      {
        data: {
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          customer_address: address,
          customer_comment: values.customer_comment || undefined,
          items: items.map((item) => ({ perfume_id: item.perfume.id, ml: item.ml })),
        },
      },
      {
        onSuccess: () => {
          clearCart();
          toast({ title: "✅ Замовлення оформлено", description: "Ми зв'яжемося з вами найближчим часом для підтвердження." });
          setLocation("/");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Помилка", description: "Не вдалося оформити замовлення. Спробуйте пізніше." });
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <>
        <AnimatePresence>
          {adminModalOpen && <AdminModal onClose={() => setAdminModalOpen(false)} />}
        </AnimatePresence>
        <div className="min-h-screen pt-28 pb-24 px-4 flex flex-col items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-md mx-auto"
          >
            <div className="text-6xl mb-6">🛍️</div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light tracking-widest uppercase">
              Кошик порожній
            </h1>
            <p className="text-foreground/50 font-light tracking-widest text-sm leading-loose">
              Відкрийте для себе мистецтво справжньої парфумерії.
            </p>
            <div className="pt-8">
              <Link href="/catalog">
                <Button className="rounded-none px-12 h-14 tracking-[0.2em] uppercase bg-transparent text-foreground border border-white/30 hover:bg-white hover:text-black transition-all duration-500 font-light">
                  До каталогу
                </Button>
              </Link>
            </div>
          </motion.div>
          <button
            onClick={handleSecretClick}
            className="mt-24 w-2 h-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-hidden="true"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {adminModalOpen && <AdminModal onClose={() => setAdminModalOpen(false)} />}
      </AnimatePresence>

      <div className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-4 md:px-12 bg-background min-h-screen">
        <div className="container mx-auto max-w-6xl mt-4 md:mt-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-4xl md:text-7xl text-foreground tracking-[0.1em] md:tracking-[0.15em] mb-14 md:mb-24 font-light uppercase text-center md:text-left"
          >
            Кошик
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-10 md:gap-16 lg:gap-24">
            {/* Cart Items */}
            <div className="lg:w-3/5 space-y-6 md:space-y-8">
              <div className="border-b border-white/10 pb-4 hidden md:grid grid-cols-12 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">
                <div className="col-span-6">Товар</div>
                <div className="col-span-2 text-center">Об'єм</div>
                <div className="col-span-3 text-right">Вартість</div>
                <div className="col-span-1" />
              </div>

              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.perfume.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.5 }}
                    className="flex md:grid md:grid-cols-12 gap-4 md:gap-6 items-center border-b border-white/5 pb-6 md:pb-6"
                  >
                    <div className="flex-1 md:col-span-6 flex items-center gap-4 md:gap-6">
                      <div className="w-16 h-20 md:w-20 md:h-24 bg-card shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={item.perfume.image_url || "/perfume-placeholder.png"}
                          alt={item.perfume.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-primary/70 tracking-[0.25em] uppercase mb-1 md:mb-2">
                          {item.perfume.brand}
                        </div>
                        <Link href={`/perfume/${item.perfume.id}`} className="font-serif text-base md:text-xl font-light text-foreground hover:text-primary transition-colors tracking-wide leading-tight">
                          {item.perfume.name}
                        </Link>
                        <div className="mt-1 text-xs text-foreground/50 tracking-widest uppercase">
                          {item.ml} мл · {formatCurrency(item.perfume.price_per_ml * item.ml)}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-center text-foreground font-light tracking-widest text-sm">
                      {item.ml} мл
                    </div>

                    <div className="hidden md:flex md:col-span-3 justify-end items-center">
                      <span className="font-serif text-2xl font-light text-foreground">
                        {formatCurrency(item.perfume.price_per_ml * item.ml)}
                      </span>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button onClick={() => removeFromCart(index)} className="text-foreground/30 hover:text-red-400 transition-colors p-2">
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex justify-between items-center pt-8 md:pt-12 border-t border-white/20"
              >
                <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-foreground font-light uppercase">Разом</span>
                <span className="font-serif text-3xl md:text-4xl text-primary font-light">{formatCurrency(total)}</span>
              </motion.div>
            </div>

            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:w-2/5"
            >
              <div className="bg-black/50 p-6 md:p-10 border border-white/10">
                <h2 className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-foreground mb-8 md:mb-10 font-light uppercase">
                  Оформлення
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    <FormField control={form.control} name="customer_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Ім'я та Прізвище</FormLabel>
                        <FormControl><Input className={inputCls} placeholder="Іван Іванов" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="customer_phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Номер телефону</FormLabel>
                        <FormControl><Input className={inputCls} placeholder="+380 99 123 45 67" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="border border-white/10 p-5 space-y-5 bg-white/2">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-semibold">Нова Пошта</span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>

                      <FormField control={form.control} name="nova_poshta_city" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Місто / Населений пункт</FormLabel>
                          <FormControl><Input className={inputCls} placeholder="Київ" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="nova_poshta_branch" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Номер відділення</FormLabel>
                          <FormControl><Input className={inputCls} placeholder="15" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="customer_comment" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Коментар (необов'язково)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="rounded-none bg-transparent border-t-0 border-l-0 border-r-0 border-b border-white/20 focus-visible:ring-0 focus-visible:border-primary text-sm tracking-wide px-0 py-4 min-h-[70px] resize-none"
                            placeholder="Ваші побажання..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      type="submit"
                      disabled={createOrder.isPending}
                      className="w-full h-14 md:h-16 rounded-none bg-primary text-black hover:bg-white tracking-[0.2em] uppercase font-semibold mt-6 transition-colors duration-500"
                    >
                      {createOrder.isPending ? "Обробка..." : "Підтвердити замовлення"}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>

          {/* Hidden admin trigger */}
          <div className="mt-20 flex justify-center">
            <button
              onClick={handleSecretClick}
              className="w-2 h-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </>
  );
}
