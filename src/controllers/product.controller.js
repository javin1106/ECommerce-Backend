import Product from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    brand,
    thumbnail,
    images,
    stock,
  } = req.body;

  if (!title || !description || !price || !category || !thumbnail || !brand) {
    throw new ApiError(400, "Required fields are missing");
  }

  const existingProduct = await Product.findOne({ title, brand });

  if (existingProduct) {
    throw new ApiError(409, "Product with this title and brand already exists");
  }

  const product = await Product.create({
    title,
    description,
    price,
    category,
    brand,
    thumbnail,
    images,
    stock,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, search, category, sort } = req.query; // from frontend the urls send this

  page = Number(page); // req.quey returns string, so convert to integer
  limit = Number(limit);

  const query = { isActive: true };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  let productQuery = Product.find(query);

  // sorting
  if (sort === "price_asc") productQuery = productQuery.sort({ price: 1 });
  if (sort === "price_desc") productQuery = productQuery.sort({ price: -1 });
  if (sort === "newest") productQuery = productQuery.sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  const products = await productQuery.skip((page - 1) * limit).limit(limit);
  /*eg. page = 3; limit = 10; skip = (3-1) x 10 = 20;
  ignore first 20 items, give next 10 */

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Products fetched successfully"
    )
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});
