import mongoose from "mongoose";
const informationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "key is required"],
    },
    value: {
      type: String,
      required: [true, "value is required"],
    },
  },
  { _id: false },
);
const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "brand id is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category id is required"],
    },
    defaultProductVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    productVariantIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
      ],
      default: [],
    },
    ratingCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      unique: [true, "title is already exist"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    information: {
      type: [informationSchema],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    boughtCount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
