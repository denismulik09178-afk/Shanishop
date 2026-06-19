import { Router, type IRouter } from "express";
import { eq, type SQL } from "drizzle-orm";
import { db, ordersTable, perfumesTable } from "@workspace/db";
import type { OrderItem } from "@workspace/db";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderParams,
  UpdateOrderBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res): Promise<void> => {
  const query = ListOrdersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.status) conditions.push(eq(ordersTable.status, query.data.status));

  const rows = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(ordersTable.createdAt);

  res.json(rows.map(formatOrder).reverse());
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customer_name, customer_phone, customer_address, customer_comment, items } = parsed.data;

  const perfumeIds = items.map((i) => i.perfume_id);
  const perfumes = await db
    .select()
    .from(perfumesTable)
    .where(eq(perfumesTable.id, perfumeIds[0]));

  const perfumeMap = new Map<number, typeof perfumes[0]>();
  for (const pid of perfumeIds) {
    const [p] = await db.select().from(perfumesTable).where(eq(perfumesTable.id, pid));
    if (p) perfumeMap.set(p.id, p);
  }

  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const perfume = perfumeMap.get(item.perfume_id);
    if (!perfume) {
      res.status(400).json({ error: `Парфум з ID ${item.perfume_id} не знайдено` });
      return;
    }
    const subtotal = perfume.pricePerMl * item.ml;
    total += subtotal;
    orderItems.push({
      perfume_id: perfume.id,
      perfume_name: perfume.name,
      brand: perfume.brand,
      price_per_ml: perfume.pricePerMl,
      ml: item.ml,
      subtotal,
    });
  }

  const [row] = await db.insert(ordersTable).values({
    customerName: customer_name,
    customerPhone: customer_phone,
    customerAddress: customer_address ?? null,
    customerComment: customer_comment ?? null,
    status: "pending",
    total,
    items: orderItems,
  }).returning();

  res.status(201).json(formatOrder(row));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Замовлення не знайдено" });
    return;
  }

  res.json(formatOrder(row));
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) update.status = parsed.data.status;

  const [row] = await db
    .update(ordersTable)
    .set(update)
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Замовлення не знайдено" });
    return;
  }

  res.json(formatOrder(row));
});

function formatOrder(row: typeof ordersTable.$inferSelect) {
  return {
    id: row.id,
    customer_name: row.customerName,
    customer_phone: row.customerPhone,
    customer_address: row.customerAddress,
    customer_comment: row.customerComment,
    status: row.status,
    total: row.total,
    items: row.items as OrderItem[],
    created_at: row.createdAt.toISOString(),
  };
}

export default router;
