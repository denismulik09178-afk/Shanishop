import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListPerfumes, 
  useCreatePerfume,
  useUpdatePerfume,
  useDeletePerfume,
  useListCategories,
  getListPerfumesQueryKey,
  Perfume
} from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Обов'язкове поле"),
  brand: z.string().min(1, "Обов'язкове поле"),
  price_per_ml: z.coerce.number().min(1, "Мінімум 1"),
  category_id: z.coerce.number().optional().nullable(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  in_stock: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export default function AdminPerfumes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: perfumes, isLoading } = useListPerfumes();
  const { data: categories } = useListCategories();
  
  const createPerfume = useCreatePerfume();
  const updatePerfume = useUpdatePerfume();
  const deletePerfume = useDeletePerfume();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      price_per_ml: 100,
      in_stock: true,
      is_featured: false,
    },
  });

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      brand: "",
      price_per_ml: 100,
      category_id: undefined,
      image_url: "",
      description: "",
      notes: "",
      in_stock: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (perfume: Perfume) => {
    setEditingId(perfume.id);
    form.reset({
      name: perfume.name,
      brand: perfume.brand,
      price_per_ml: perfume.price_per_ml,
      category_id: perfume.category_id,
      image_url: perfume.image_url || "",
      description: perfume.description || "",
      notes: perfume.notes || "",
      in_stock: perfume.in_stock,
      is_featured: perfume.is_featured,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updatePerfume.mutate(
        { id: editingId, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPerfumesQueryKey() });
            toast({ title: "Парфум оновлено" });
            setIsModalOpen(false);
          }
        }
      );
    } else {
      createPerfume.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPerfumesQueryKey() });
            toast({ title: "Парфум створено" });
            setIsModalOpen(false);
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей парфум?")) return;
    
    deletePerfume.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPerfumesQueryKey() });
          toast({ title: "Парфум видалено" });
        }
      }
    );
  };

  const handleToggleStock = (id: number, currentStock: boolean) => {
    updatePerfume.mutate(
      { id, data: { in_stock: !currentStock } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPerfumesQueryKey() });
        }
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl text-foreground">Парфуми</h1>
        <Button 
          onClick={handleOpenNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none tracking-widest uppercase text-xs"
        >
          <Plus size={16} className="mr-2" /> Додати парфум
        </Button>
      </div>

      <div className="bg-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Зобр.</th>
                <th className="px-6 py-4 font-medium">Назва / Бренд</th>
                <th className="px-6 py-4 font-medium">Категорія</th>
                <th className="px-6 py-4 font-medium">Ціна/мл</th>
                <th className="px-6 py-4 font-medium text-center">Наявність</th>
                <th className="px-6 py-4 font-medium text-center">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Завантаження...</td>
                </tr>
              ) : perfumes?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Немає парфумів</td>
                </tr>
              ) : (
                perfumes?.map((perfume) => (
                  <tr key={perfume.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-12 bg-background border border-border">
                        <img 
                          src={perfume.image_url || "/perfume-placeholder.png"} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-serif text-base text-foreground">{perfume.name}</div>
                      <div className="text-xs text-primary uppercase tracking-widest">{perfume.brand}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{perfume.category_name || "—"}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(perfume.price_per_ml)}</td>
                    <td className="px-6 py-4 text-center">
                      <Switch 
                        checked={perfume.in_stock} 
                        onCheckedChange={() => handleToggleStock(perfume.id, perfume.in_stock)} 
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-primary">
                      {perfume.is_featured ? 'Так' : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEdit(perfume)}
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(perfume.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border border-border rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal tracking-wider">
              {editingId ? "Редагувати парфум" : "Додати парфум"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Назва</FormLabel>
                      <FormControl>
                        <Input className="rounded-none bg-background border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Бренд</FormLabel>
                      <FormControl>
                        <Input className="rounded-none bg-background border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_per_ml"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Ціна за 1 мл (ГРН)</FormLabel>
                      <FormControl>
                        <Input type="number" className="rounded-none bg-background border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Категорія</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))} 
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none bg-background border-border">
                            <SelectValue placeholder="Оберіть категорію" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border">
                          <SelectItem value="none">Без категорії</SelectItem>
                          {categories?.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs uppercase tracking-widest">URL Зображення</FormLabel>
                      <FormControl>
                        <Input className="rounded-none bg-background border-border" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs uppercase tracking-widest">Опис</FormLabel>
                      <FormControl>
                        <Textarea className="rounded-none bg-background border-border min-h-[100px]" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs uppercase tracking-widest">Ноти</FormLabel>
                      <FormControl>
                        <Input className="rounded-none bg-background border-border" placeholder="Верхні: ... Середні: ... Базові: ..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="in_stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded border border-border p-4 bg-background">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">
                          В наявності
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded border border-border p-4 bg-background">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">
                          На головній (Featured)
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-none tracking-widest uppercase text-xs"
                >
                  Скасувати
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPerfume.isPending || updatePerfume.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none tracking-widest uppercase text-xs px-8"
                >
                  Зберегти
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
