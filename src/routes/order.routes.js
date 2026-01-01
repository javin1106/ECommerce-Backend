import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const orderRoutes = Router();

orderRoutes.use(verifyJWT);

orderRoutes.post("/create", createOrder);

export default orderRoutes;
