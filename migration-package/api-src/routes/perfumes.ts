import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, perfumesTable, categoriesTable } from "@workspace/db";
import {
  ListPerfumesQueryParams,
  CreatePerfumeBody,
  GetPerfumeParams,
  UpdatePerfumeParams,
  UpdatePerfumeBody,
  DeletePerfumeParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/perfumes", async (req, res): Promise<void> => {
  const query = ListPerfumesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category_id, search } = query.data;

  const conditions: SQL[] = [];
  if (category_id != null) conditions.push(eq(perfumesTable.categoryId, category_id));
  if (search) conditions.push(ilike(perfumesTable.name, `%${search}%`));

  const rows = await db
    .select({
      id: perfumesTable.id,
      name: perfumesTable.name,
      brand: perfumesTable.brand,
      price_per_ml: perfumesTable.pricePerMl,
      description: perfumesTable.description,
      notes: perfumesTable.notes,
      image_url: perfumesTable.imageUrl,
      category_id: perfumesTable.categoryId,
      category_name: categoriesTable.name,
      in_stock: perfumesTable.inStock,
      is_featured: perfumesTable.isFeatured,
      created_at: perfumesTable.createdAt,
    })
    .from(perfumesTable)
    .leftJoin(categoriesTable, eq(perfumesTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(perfumesTable.brand, perfumesTable.name);

  res.json(rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
  })));
});

router.post("/perfumes", async (req, res): Promise<void> => {
  const parsed = CreatePerfumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, brand, price_per_ml, description, notes, image_url, category_id, in_stock, is_featured } = parsed.data;

  const [row] = await db.insert(perfumesTable).values({
    name,
    brand,
    pricePerMl: price_per_ml,
    description: description ?? null,
    notes: notes ?? null,
    imageUrl: image_url ?? null,
    categoryId: category_id ?? null,
    inStock: in_stock ?? true,
    isFeatured: is_featured ?? false,
  }).returning();

  const perfume = await getPerfumeWithCategory(row.id);
  res.status(201).json(perfume);
});

router.get("/perfumes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPerfumeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const perfume = await getPerfumeWithCategory(params.data.id);
  if (!perfume) {
    res.status(404).json({ error: "Парфум не знайдено" });
    return;
  }

  res.json(perfume);
});

router.patch("/perfumes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdatePerfumeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePerfumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.brand !== undefined) update.brand = parsed.data.brand;
  if (parsed.data.price_per_ml !== undefined) update.pricePerMl = parsed.data.price_per_ml;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  if (parsed.data.notes !== undefined) update.notes = parsed.data.notes;
  if (parsed.data.image_url !== undefined) update.imageUrl = parsed.data.image_url;
  if (parsed.data.category_id !== undefined) update.categoryId = parsed.data.category_id;
  if (parsed.data.in_stock !== undefined) update.inStock = parsed.data.in_stock;
  if (parsed.data.is_featured !== undefined) update.isFeatured = parsed.data.is_featured;

  if (Object.keys(update).length === 0) {
    const perfume = await getPerfumeWithCategory(params.data.id);
    if (!perfume) {
      res.status(404).json({ error: "Парфум не знайдено" });
      return;
    }
    res.json(perfume);
    return;
  }

  const [updated] = await db
    .update(perfumesTable)
    .set(update)
    .where(eq(perfumesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Парфум не знайдено" });
    return;
  }

  const perfume = await getPerfumeWithCategory(updated.id);
  res.json(perfume);
});

router.delete("/perfumes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeletePerfumeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(perfumesTable)
    .where(eq(perfumesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Парфум не знайдено" });
    return;
  }

  res.json({ success: true });
});

async function getPerfumeWithCategory(id: number) {
  const [row] = await db
    .select({
      id: perfumesTable.id,
      name: perfumesTable.name,
      brand: perfumesTable.brand,
      price_per_ml: perfumesTable.pricePerMl,
      description: perfumesTable.description,
      notes: perfumesTable.notes,
      image_url: perfumesTable.imageUrl,
      category_id: perfumesTable.categoryId,
      category_name: categoriesTable.name,
      in_stock: perfumesTable.inStock,
      is_featured: perfumesTable.isFeatured,
      created_at: perfumesTable.createdAt,
    })
    .from(perfumesTable)
    .leftJoin(categoriesTable, eq(perfumesTable.categoryId, categoriesTable.id))
    .where(eq(perfumesTable.id, id));

  if (!row) return null;
  return { ...row, created_at: row.created_at.toISOString() };
}

export default router;
