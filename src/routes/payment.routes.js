import { makePayment } from "../controllers/payment.controller";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.post("/payment-success", verifyJWT, makePayment);

export default paymentRouter;
