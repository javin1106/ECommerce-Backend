import cron from "node-cron";
import { Order } from "../models/order.models.js";
import { Cart } from "../models/cart.models.js";

cron.schedule("*/2 * * * *", async () => {
  console.log("Running order expiry job");

  const expiredOrders = await Order.find({
    status: "PENDING_PAYMENT",
    expiresAt: { $lt: Date.now() },
  });

  for (let order of expiredOrders) {
    (order.status = "FAILED"), await order.save();

    await Cart.findOneAndUpdate(
      { user: order.user },
      {
        $set: {
          isLocked: false,
        },
      }
    );

    console.log(`Order ${order._id} expired & cart unlocked`);
  }
});
