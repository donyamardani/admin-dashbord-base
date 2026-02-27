import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    match: [/^(?:\+98|0)?9\d{9}$/, "invalid Phone number"],
    unique: [true, "phone number already exist"],
    required: [true, "phone number is required"],
  },
  password: {
    type: String,
    default:''
  },
  fullName: {
    type: String,
    default: "",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    default: null,
  },
  addressIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    default: [],
  },
  favoriteProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  boughtProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: ["admin", "user", "superAdmin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ratedProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
},{timestamps:true});
const User=mongoose.model('User',userSchema)
export default User
