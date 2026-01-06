import { Router } from "express";
import { authorizeRole } from "../middleware/auth.roles.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const productRoutes = Router();

productRoutes.post("/", verifyJWT, authorizeRole("admin"), createProduct);
productRoutes.get("/:id", verifyJWT, getProductById);
productRoutes.get("/", verifyJWT, getAllProducts);

export default productRoutes;
