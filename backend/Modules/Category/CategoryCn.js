import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import { __dirname } from "../../app.js";
import fs from "fs";
import Category from "./CategoryMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
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
    .populate({ path: "supCategoryId" });
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: "supCategoryId" });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(201).json({
    success: true,
    message: "category created successfully",
    data: category,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "category updated successfully",
    data: category,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const product = await Product.find({ categoryId: req.params.id });
  const categories = await Category.find({ supCategoryId: req.params.id });
  if (product.length > 0 || categories.length > 0) {
    return next(
      new HandleERROR(
        "this Category contain some product you can not deleted or have sub Categories",
        400,
      ),
    );
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (fs.existsSync(`${__dirname}/Public/${category.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }
  return res.status(201).json({
    success: true,
    message: "category deleted successfully",
    data: category,
  });
});
