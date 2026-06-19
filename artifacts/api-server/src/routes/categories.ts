import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, categoriesTable } from "@workspace/db";
import {
  CreateCategoryBody,
  UpdateCategoryParams,
  UpdateCategoryBody,
  DeleteCategoryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.sortOrder, categoriesTable.name);

  res.json(rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    image_url: r.imageUrl,
    sort_order: r.sortOrder,
  })));
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, slug, description, image_url, sort_order } = parsed.data;

  const [row] = await db.insert(categoriesTable).values({
    name,
    slug,
    description: description ?? null,
    imageUrl: image_url ?? null,
    sortOrder: sort_order ?? 0,
  }).returning();

  res.status(201).json({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.imageUrl,
    sort_order: row.sortOrder,
  });
});

router.patch("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCategoryParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.slug !== undefined) update.slug = parsed.data.slug;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  if (parsed.data.image_url !== undefined) update.imageUrl = parsed.data.image_url;
  if (parsed.data.sort_order !== undefined) update.sortOrder = parsed.data.sort_order;

  const [row] = await db
    .update(categoriesTable)
    .set(update)
    .where(eq(categoriesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Категорія не знайдена" });
    return;
  }

  res.json({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.imageUrl,
    sort_order: row.sortOrder,
  });
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCategoryParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Категорія не знайдена" });
    return;
  }

  res.json({ success: true });
});

export default router;
