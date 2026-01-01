import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const productRoutes = Router();

productRoutes.post("/", verifyJWT, createProduct);
productRoutes.get("/:id", verifyJWT, getProductById);
productRoutes.get("/", verifyJWT, getAllProducts);

export default productRoutes;