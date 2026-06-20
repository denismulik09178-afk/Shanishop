import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListCategories, 
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  getListCategoriesQueryKey,
  Category
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  slug: z.string().min(1, "Обов'язкове поле").regex(/^[a-z0-9-]+$/, "Лише малі літери, цифри та дефіс"),
  sort_order: z.coerce.number().optional().default(0),
});

export default function AdminCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: categories, isLoading } = useListCategories();
  
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      sort_order: 0,
    },
  });

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      slug: "",
      sort_order: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    form.reset({
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateCategory.mutate(
        { id: editingId, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
            toast({ title: "Категорію оновлено" });
            setIsModalOpen(false);
          }
        }
      );
    } else {
      createCategory.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
            toast({ title: "Категорію створено" });
            setIsModalOpen(false);
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію? Усі парфуми в цій категорії залишаться, але без неї.")) return;
    
    deleteCategory.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          toast({ title: "Категорію видалено" });
        }
      }
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl text-foreground">Категорії</h1>
        <Button 
          onClick={handleOpenNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none tracking-widest uppercase text-xs"
        >
          <Plus size={16} className="mr-2" /> Додати категорію
        </Button>
      </div>

      <div className="bg-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Назва</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Сортування</th>
                <th className="px-6 py-4 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Завантаження...</td>
                </tr>
              ) : categories?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Немає категорій</td>
                </tr>
              ) : (
                categories?.sort((a,b) => (a.sort_order||0) - (b.sort_order||0)).map((category) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-serif text-base">{category.name}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{category.slug}</td>
                    <td className="px-6 py-4 text-muted-foreground">{category.sort_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEdit(category)}
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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
        <DialogContent className="max-w-md bg-card border border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal tracking-wider">
              {editingId ? "Редагувати категорію" : "Додати категорію"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest">Назва</FormLabel>
                    <FormControl>
                      <Input className="rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest">URL Slug (для посилань)</FormLabel>
                    <FormControl>
                      <Input className="rounded-none bg-background border-border font-mono" placeholder="woody-spicy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest">Порядок сортування</FormLabel>
                    <FormControl>
                      <Input type="number" className="rounded-none bg-background border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  disabled={createCategory.isPending || updateCategory.isPending}
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
