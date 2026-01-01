import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkoutReview } from "../controllers/checkout.controller.js";

const checkoutRouter = Router();

checkoutRouter.use(verifyJWT);

checkoutRouter.get("/", checkoutReview);

export default checkoutRouter;