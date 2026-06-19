import { pgTable, text, serial, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const perfumesTable = pgTable("perfumes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  pricePerMl: real("price_per_ml").notNull(),
  description: text("description"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  inStock: boolean("in_stock").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPerfumeSchema = createInsertSchema(perfumesTable).omit({ id: true, createdAt: true });
export type InsertPerfume = z.infer<typeof insertPerfumeSchema>;
export type Perfume = typeof perfumesTable.$inferSelect;
