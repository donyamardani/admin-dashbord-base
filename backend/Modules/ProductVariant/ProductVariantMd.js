import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "variant",
      required: [true, "variant id is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is Required"],
      min: [0, "minimum 0"],
    },
    price: {
      type: Number,
      min: [0, "minimum price 0"],
      required: [true, "quantity is Required"],
    },
    discountPercent:{
      type:Number,
      default:0,
      min:[0,'minimum discount percent 0'],
      max:[100,'maximum discount percent 100']
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "minimum price 0"],
      validate: {
        validator: function (item) {
          return item<=this.price
        },
        message: 'price must be greater than price after discount',
      },
    },
    boughtCount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true },
);

productVariantSchema.pre('save',function(next){
  this.priceAfterDiscount=+(this.price * (1-this.discountPercent/100)).toFixed(2)
  next()
})
productVariantSchema.pre('findOneAndUpdate',function(next){
  this.priceAfterDiscount=+(this.price * (1-this.discountPercent/100)).toFixed(2)
  next()
})
const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);


export default ProductVariant;
