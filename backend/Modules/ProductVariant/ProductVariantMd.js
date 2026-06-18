import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    variantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0, "minimum 0"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "minimum price 0"],
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, "minimum discount percent 0"],
      max: [100, "maximum discount percent 100"],
    },
    // FIX #4: no longer set manually — auto-calculated by pre-save hook below
    priceAfterDiscount: {
      type: Number,
      min: [0, "minimum price 0"],
    },
    boughtCount: {
      type: Number,
      default: 0,
      min: [0, "minimum bought count 0"],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

// FIX #4: auto-calculate priceAfterDiscount on create / manual save
productVariantSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discountPercent")) {
    this.priceAfterDiscount = +(
      this.price *
      (1 - (this.discountPercent || 0) / 100)
    ).toFixed(2);
  }
  next();
});

// FIX #4: auto-calculate on findByIdAndUpdate / findOneAndUpdate
productVariantSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  // Fetch the current document so we can merge with incoming partial updates
  const current = await this.model.findOne(this.getQuery()).lean();

  const price =
    update.price !== undefined ? update.price : current?.price ?? 0;
  const discountPercent =
    update.discountPercent !== undefined
      ? update.discountPercent
      : current?.discountPercent ?? 0;

  update.priceAfterDiscount = +(price * (1 - discountPercent / 100)).toFixed(
    2,
  );
  next();
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
