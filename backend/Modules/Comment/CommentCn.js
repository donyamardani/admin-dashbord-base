import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import User from "../User/UserMd.js";
import Comment from "./CommentMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters()
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "fullName phoneNumber role" },
      { path: "productId", select: "title" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getAllCommentsPost = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { productId: req.params.id }
        : { $and: [{ productId: req.params.id }, { isPublished: true }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate(
      { path: "userId", select: "fullName phoneNumber role" },
      { path: "productId", select: "title" },
    );
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  let isBought = user.boughtProductIds.find(
    (item) => item.toString() == req.body.productId.toString(),
  )
    ? true
    : false;
  const comment = await Comment.create({
    ...req.body,
    userId: req.userId,
    isReply: false,
    isPublished: false,
    isBought
  });
  if(req.body.rate && isBought){
    const product=await Product.findById(comment.productId)
    product.avgRating=((product.avgRating*product.ratingCount)+req.body.rate)/(product.ratingCount+1)
    product.ratingCount++
    await product.save()
  }

  return res.status(201).json({
    success: true,
    message: "comment created successfully",
    data: comment,
  });
});
export const changePublish = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  comment.isPublished = !comment.isPublished;
  const newComment = await comment.save();
  return res.status(201).json({
    success: true,
    message: "comment updated successfully",
    data: newComment,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ replyTo: req.params.id });
  return res.status(201).json({
    success: true,
    message: "comment removed successfully",
  });
});

export const reply=catchAsync(async(req,res,next)=>{
      const comment = await Comment.create({
    ...req.body,
    userId: req.userId,
    isReply: true,
    isPublished: true,
    isBought:false
  });
    return res.status(201).json({
    success: true,
    message: "reply comment created successfully",
    data: comment,
  });
})