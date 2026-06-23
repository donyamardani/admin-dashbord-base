import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "./ProductMd.js";
import { __dirname } from "../../app.js";
import fs from "fs";
import User from "../User/UserMd.js";
import ProductVariant from "../ProductVariant/ProductVariantMd.js";
import Comment from "../Comment/CommentMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  // FIX: "search" is not in vanta-api's RESERVED_QUERY_KEYS, so leaving it in
  // req.query causes ApiFeatures to also add a literal { search: <value> }
  // match filter (since no document has a "search" field, this always
  // returns 0 results). Strip it out before constructing ApiFeatures.
  const { search, ...restQuery } = req.query;
  const features = new ApiFeatures(Product, restQuery, req.role)
    .addManualFilters({
      ...(search
        ? { title: { $regex: search, $options: "i" } }
        : {}),
      ...(req.role === "admin" || req.role === "superAdmin"
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
  const product = await Product.findById(req.params.id)
    .populate({
      path: "productVariantIds",
      populate: {
        path: "variantIds",
        select: "value title",
      },
    })
    .populate("categoryId")
    .populate("brandId");

  if (!product) {
    return next(new HandleERROR("product not found", 404));
  }

  let isFavorite = false;
  let isBought = false;
  let isRated = false;

  if (req.userId) {
    const user = await User.findById(req.userId);
    if (user) {
      isFavorite = user.favoriteProductIds?.some(
        (id) => id.toString() === req.params.id,
      );
      isBought = user.boughtProductIds?.some(
        (id) => id.toString() === req.params.id,
      );
      isRated = user.ratedProductIds?.some(
        (id) => id.toString() === req.params.id,
      );
    }
  }

  return res.status(200).json({
    success: true,
    data: product,
    isFavorite,
    isBought,
    isRated,
  });
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
    runValidators: true, // FIX #7: was "runValidator" (missing 's') — Mongoose silently ignored it
    new: true,
  });
  if (!product) {
    return next(new HandleERROR("product not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "product updated successfully",
    data: product,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  // FIX #3: null check BEFORE accessing .boughtCount — previously crashed when product didn't exist
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleERROR("product not found", 404));
  }
  if (product.boughtCount > 0) {
    return next(
      new HandleERROR(
        "you can not delete this product. please change isPublished instead",
        400,
      ),
    );
  }
  await Product.findByIdAndDelete(req.params.id);
  for (const img of product.images) {
    if (fs.existsSync(`${__dirname}/Public/${img}`)) {
      fs.unlinkSync(`${__dirname}/Public/${img}`);
    }
  }
  await ProductVariant.deleteMany({ productId: req.params.id });
  await Comment.deleteMany({ productId: req.params.id });
  return res.status(200).json({
    success: true,
    message: "product deleted successfully",
    data: product,
  });
});

export const favorite = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  const isFav = user.favoriteProductIds.some(
    (item) => item.toString() === req.params.id.toString(),
  );
  if (isFav) {
    user.favoriteProductIds = user.favoriteProductIds.filter(
      (item) => item.toString() !== req.params.id.toString(),
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