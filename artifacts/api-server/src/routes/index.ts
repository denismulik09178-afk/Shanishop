import { Router, type IRouter } from "express";
import healthRouter from "./health";
import perfumesRouter from "./perfumes";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(perfumesRouter);
router.use(categoriesRouter);
router.use(ordersRouter);

export default router;
