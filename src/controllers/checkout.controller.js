import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.models.js";

export const checkoutReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title price stock thumbnail"
  );

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  let updatedTotal = 0;
  let stockChanged = false;

  cart.items.forEach((item) => {
    const product = item.product;

    if (!product || product.stock === 0) {
      stockChanged = true;
      item.isActive = false;
      return;
    }

    if (item.quantity > product.stock) {
      // if requested qty is greater than available - clamp
      stockChanged = true;
      item.quantity = product.stock;
    }

    item.total = product.price * item.quantity;
    updatedTotal += item.total;
  });

  cart.cartTotal = updatedTotal;
  await cart.save();

  if (stockChanged) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          cart,
          checkoutAllowed: false,
        },
        "Some items were updated due to stock issues. Please review your cart"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cart,
        checkoutAllowed: true,
      },
      "Checkout ready"
    )
  );
});
