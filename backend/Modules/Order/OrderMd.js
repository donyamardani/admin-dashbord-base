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

    // snapshot data
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
  { _id: false }
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

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "failed", "cancelled"],
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
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
