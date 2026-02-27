import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is required"],
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: [true, "product id is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "product id is required"],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "product id is required"],
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user id is required"],
  },
  items: {
    type: [itemSchema],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalPriceAfterDiscount: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
