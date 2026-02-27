import mongoose from "mongoose";
const variantSchema = new mongoose.Schema({
  type: {
    enum: ["size", "color"],
    required: [true, "type is required"],
    type: String,
  },
  value: {
    required: [true, "value is required"],
    type: String,
  },
},{timestamps:true});
const Variant=mongoose.model('Variant',variantSchema)
export default Variant