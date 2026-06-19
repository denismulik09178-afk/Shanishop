import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { randomBytes, createHmac } from "crypto";
import { db, ordersTable, perfumesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";
import type { OrderItem } from "@workspace/db";

const router: IRouter = Router();

const SESSION_SECRET = process.env.SESSION_SECRET ?? "changeme";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1234";
const COOKIE_NAME = "mn_session";

const sessions = new Map<string, { role: string; createdAt: number }>();

function signToken(id: string): string {
  const sig = createHmac("sha256", SESSION_SECRET).update(id).digest("hex");
  return `${id}.${sig}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [id, sig] = parts;
  const expected = createHmac("sha256", SESSION_SECRET).update(id).digest("hex");
  if (sig !== expected) return null;
  return id;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const sessionId = verifyToken(raw);
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Невірний пароль" });
    return;
  }

  const sessionId = randomBytes(32).toString("hex");
  sessions.set(sessionId, { role: "admin", createdAt: Date.now() });

  const token = signToken(sessionId);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ authenticated: true, role: "admin" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  const raw = req.cookies?.[COOKIE_NAME];
  if (raw) {
    const sessionId = verifyToken(raw);
    if (sessionId) sessions.delete(sessionId);
  }
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) {
    res.json({ authenticated: false, role: null });
    return;
  }
  const sessionId = verifyToken(raw);
  if (!sessionId || !sessions.has(sessionId)) {
    res.json({ authenticated: false, role: null });
    return;
  }
  res.json({ authenticated: true, role: "admin" });
});

router.get("/stats", async (_req, res): Promise<void> => {
  const allOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  const allPerfumes = await db.select().from(perfumesTable);

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const totalPerfumes = allPerfumes.length;
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = allOrders.slice(0, 5).map((row) => ({
    id: row.id,
    customer_name: row.customerName,
    customer_phone: row.customerPhone,
    customer_address: row.customerAddress,
    customer_comment: row.customerComment,
    status: row.status,
    total: row.total,
    items: row.items as OrderItem[],
    created_at: row.createdAt.toISOString(),
  }));

  res.json({
    total_orders: totalOrders,
    pending_orders: pendingOrders,
    total_perfumes: totalPerfumes,
    total_revenue: totalRevenue,
    recent_orders: recentOrders,
  });
});

export default router;
