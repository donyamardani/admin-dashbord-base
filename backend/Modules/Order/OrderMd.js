import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    // snapshot data — frozen at time of purchase so later price/title changes
    // don't retroactively alter past orders
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },

    discountCode: {
      code: String,
      amount: Number,
      percentage: Number,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    address: {
      fullName: String,
      phone: String,
      province: String,
      city: String,
      postalCode: String,
      addressLine: String,
    },

    // FIX #5: OrderCt.js sets status to "pending" / "success" / "failed",
    // but this enum only had "paid" / "shipped" / "delivered" / "cancelled".
    // Any save() with "success" would have thrown a validation error.
    // Kept post-purchase fulfillment statuses too, in case they're used later
    // (e.g. by an admin shipping flow) — controller code just needs to set them.
    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    authority: {
      type: String,
      default: "",
    },

    refId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;