import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.models.js";
import Product from "../models/product.models.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { productId, quantity } = req.body; // body -> json, coming from the frontend, user is requesting to add in their cart

  if (!productId || !quantity || quantity < 1) {
    throw new ApiError(400, "Product ID and Valid quantity is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  if (product.stock === 0) {
    throw new ApiError(400, "Product is out of stock");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient product stock to be added in Cart");
  }

  let cart = await Cart.findOne({ user: userId }); // find or create cart for user

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartTotal: product.price * quantity,
      items: [
        {
          product: productId,
          quantity,
          priceAtTime: product.price,
          total: product.price * quantity,
        },
      ],
    });
  } else {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (newQty > product.stock) {
        throw new ApiError(400, "Not enough stock available");
      }

      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].total =
        newQty * cart.items[existingItemIndex].priceAtTime;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtTime: product.price,
        total: product.price * quantity,
      });
    }

    cart.cartTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    cart.markModified("items"); // explicitly tells mongoose that changes have been made
    // mongoose only auto-tracks the high level fields, not nested arrays
    await cart.save();
  }

  // Populate product details before sending response - replaces product IDs with full product documnets, so frontend doesn't have to make another call to get details from IDs
  await cart.populate("items.product");

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId, "items.product": productId },
    { $pull: { items: { product: productId } } },
    { new: true }
  );

  if (!updatedCart) {
    throw new ApiError(404, "Product not found in cart or cart does not exist");
  }

  updatedCart.cartTotal = (updatedCart.items || []).reduce(
    (sum, item) => sum + item.total,
    0
  );
  await updatedCart.save();

  await updatedCart.populate("items.product");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart,
        "Product removed from cart successfully"
      )
    );
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (quantity == null) {
    throw new ApiError(400, "Quantity is required");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((it) => it.product.toString() === productId);

  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity > product.stock) {
    throw new ApiError(400, "Requested quantity exceeds available stock");
  }

  item.quantity = quantity;
  item.total = item.quantity * item.priceAtTime;

  cart.cartTotal = cart.items.reduce((sum, it) => sum + it.total, 0);
  cart.markModified("items");
  await cart.save();
  await cart.populate("items.product");

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart quantity updated"));
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  cart.populate("items.product");

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: [],
          cartTotal: 0,
        },
        "Cart is empty"
      )
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, cart, "Cart fetched successfully"));
});
