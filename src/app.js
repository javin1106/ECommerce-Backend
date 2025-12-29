import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes Import
// import authRoutes from "./routes/auth.routes.js";
// import productRoutes from "./routes/product.routes.js";

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Ecommerce Backend Running");
});

export default app;
