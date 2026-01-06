import { paymentSuccess } from "../controllers/payment.controller.js";
import { paymentFailed } from "../controllers/payment.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.post("/success", verifyJWT, paymentSuccess);
paymentRouter.post("/failed", paymentFailed);

export default paymentRouter;
