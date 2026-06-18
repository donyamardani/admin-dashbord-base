import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    default:null,
    index:true
  },

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"userId is required"]
  },

  content:{
    type:String,
    required:[true,"content is required"],
    trim:true
  },

  replyTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment",
    default:null
  },

  rate:{
    type:Number,
    min:1,
    max:5
  },

  isBought:{
    type:Boolean,
    default:false
  },

  isPublished:{
    type:Boolean,
    default:false
  }

},
{timestamps:true}
)

const Comment = mongoose.model("Comment",commentSchema)

export default Comment
