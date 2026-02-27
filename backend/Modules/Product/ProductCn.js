import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "./ProductMd.js";
import { __dirname } from "../../app.js";
import fs from "fs";
import User from "../User/UserMd.js";
import ProductVariant from "../ProductVariant/ProductVariantMd.js";
import Comment from "../Comment/CommentMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters({
      ...(req.query?.search
        ? { title: { $regex: req.query.search, $options: "i" } }
        : {}),
      ...(req.role == "admin" || req.role == "superAdmin"
        ? {}
        : { isPublished: true }),
    })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "defaultProductVariantId", populate: { path: "variantId" } },
      { path: "categoryId" },
      { path: "brandId" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "productVariantIds", populate: { path: "variantId" } },
      { path: "categoryId" },
      { path: "brandId" },
    ]);
  const result = await features.execute();
  let isFavorite = false;
  let isBought = false;
  let isRated = false;
  if (req.userId) {
    const user = await User.findById(req.userId);
    isFavorite = user.favoriteProductIds?.find(
      (item) => item.toString() == req.params.id,
    )
      ? true
      : false;
    isBought = user.boughtProductIds?.find(
      (item) => item.toString() == req.params.id,
    )
      ? true
      : false;
    isRated = user.ratedProductIds?.find(
      (item) => item.toString() == req.params.id,
    )
      ? true
      : false;
  }
  return res.status(200).json({ ...result, isFavorite, isBought, isRated });
});

export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: "product created successfully",
    data: product,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "product updated successfully",
    data: product,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product.boughtCount > 0) {
    return next(
      new HandleERROR(
        "you can not delete this product.. please change is publish",
        400,
      ),
    );
  }
  await Product.findByIdAndDelete(req.params.id);
  for (let img of product.images) {
    if (fs.existsSync(`${__dirname}/Public/${img}`)) {
      fs.unlinkSync(`${__dirname}/Public/${img}`);
    }
  }
  await ProductVariant.deleteMany({ productId: req.params.id });
  await Comment.deleteMany({ productId: req.params.id });
  return res.status(201).json({
    success: true,
    message: "product deleted successfully",
    data: product,
  });
});

export const favorite = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  let isFav = user.favoriteProductIds.find(
    (item) => item.toString() == req.params.id.toString(),
  )
    ? true
    : false;
  if (isFav) {
    user.favoriteProductIds = user.favoriteProductIds.filter(
      (item) => item.toString() != req.params.id.toString(),
    );
  } else {
    user.favoriteProductIds.push(req.params.id);
  }
  await user.save();
  return res.status(200).json({
    success: true,
    message: isFav
      ? "product removed from your favorite list"
      : "add to favorite list",
  });
});
