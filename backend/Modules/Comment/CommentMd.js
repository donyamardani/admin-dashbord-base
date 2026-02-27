import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    content: {
      type: String,
      required: [true, "content is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    rate: {
      min:1,
      max: 5,
      type: Number,
    },
    isBought: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
