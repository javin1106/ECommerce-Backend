import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(verifyJWT);

cartRouter.post("/add", addToCart);
cartRouter.delete("/remove", removeFromCart);
cartRouter.put("/update", updateQuantity);
cartRouter.get("/", getCart);

export default cartRouter;
