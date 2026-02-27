import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "brand title is required"],
    unique: [true, "brand title must be unique"],
    trim: true,
  },
  supCategoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    default:null
  }
  ,
  image: {
    type: String,
    default: "",
  },
  isPublished:{
    type:Boolean,
    default:true
  }
},{timestamps:true});

const Category = mongoose.model("Category", categorySchema);
export default Category;