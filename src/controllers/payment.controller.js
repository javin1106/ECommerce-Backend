import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import Product from "../models/product.models.js";
import { Cart } from "../models/cart.models.js";

export const paymentSuccess = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { orderId } = req.body;

  if (!userId) throw new ApiError(400, "User is not present");

  if (!orderId) throw new ApiError(400, "Order ID is not present");

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(403, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You cannot access this order");
  }

  if (order.expiresAt < Date.now()) {
    throw new ApiError(400, "Order expired, please create a new order");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new ApiError(400, "Order is not in payable state");
  }

  for (let item of order.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(400, `${item.title} doesn't exist anymore`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Not enough stock available for ${product.title}`
      );
    }
  }

  product.stock -= item.quantity;
  await product.save();

  order.status = "CONFIRMED";

  await order.save();

  await Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        items: [],
        cartTotal: 0,
      },
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, order, "Payment successful and order confirmed")
    );
});

export const paymentFailed = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { orderId } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  if (!userId) {
    throw new ApiError(400, "User does not exist");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to access this order");
  }

  if (order.expiresAt < Date.now()) {
    throw new ApiError(400, "Order expired, please create a new order");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new ApiError(400, "Order is not in payable state");
  }

  order.status = "FAILED";
  await order.save();

  await Cart.findOneAndUpdate({ user: userId }, { $set: { isLocked: false } });

  return res.status(200).json(new ApiResponse(200, order, "Payment failed!!"));
});
