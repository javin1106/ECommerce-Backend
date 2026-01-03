import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.models.js";
import { Cart } from "../models/cart.models.js";

// Initiating payment
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title price stock thumbnail"
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty, cannot place order");
  }

  let finalTotal = 0;
  const orderItems = [];

  cart.items.forEach((item) => {
    const product = item.product;

    if (!product || product.stock === 0) {
      throw new ApiError(400, "Cannot place order: product unavailable");
    }

    const itemTotal = product.price * item.quantity;
    finalTotal += itemTotal;

    orderItems.push({
      product: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      priceAtTime: product.price,
      quantity: item.quantity,
      total: itemTotal,
    });
  });

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount: finalTotal,
    status: "PENDING_PAYMENT",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: order._id,
        order,
      },
      "Order created. Awaiting payment"
    )
  );
});
