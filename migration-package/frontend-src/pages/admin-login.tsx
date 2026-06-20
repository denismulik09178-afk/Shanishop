import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAdminLogin, useAdminMe } from "@workspace/api-client-react";
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
import { useEffect } from "react";

const formSchema = z.object({
  password: z.string().min(1, "Введіть пароль"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();
  const { data: adminMe, isLoading } = useAdminMe();

  useEffect(() => {
    if (!isLoading && adminMe?.authenticated) {
      setLocation("/admin/dashboard");
    }
  }, [adminMe, isLoading, setLocation]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login.mutate(
      { data: { password: values.password } },
      {
        onSuccess: () => {
          setLocation("/admin/dashboard");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Помилка",
            description: "Невірний пароль",
          });
        },
      }
    );
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-widest text-primary mb-2">BABLGAM PARFUM</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Адміністративна панель</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Пароль доступу</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="rounded-none bg-background border-border focus-visible:ring-primary text-center tracking-widest" 
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
              className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest uppercase font-semibold h-12"
            >
              {login.isPending ? "Перевірка..." : "Увійти"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
