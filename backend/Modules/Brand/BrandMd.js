import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "brand title is required"],
    unique: [true, "brand title must be unique"],
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  isPublished:{
    type:Boolean,
    default:true
  }
},{timestamps:true});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
