import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import { __dirname } from "../../app.js";
import fs from "fs";
import Category from "./CategoryMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  // FIX: "search" is not in vanta-api's RESERVED_QUERY_KEYS, so leaving it in
  // req.query causes ApiFeatures to also add a literal { search: <value> }
  // match filter (since no document has a "search" field, this always
  // returns 0 results). Strip it out before constructing ApiFeatures.
  const { search, ...restQuery } = req.query;
  const features = new ApiFeatures(Category, restQuery, req.role)
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
    .populate({ path: "supCategoryId" });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
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
    runValidators: true, // FIX #7: was "runValidator"
    new: true,
  });
  if (!category) {
    return next(new HandleERROR("category not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "category updated successfully",
    data: category,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.find({ categoryId: req.params.id });
  const subcategories = await Category.find({ supCategoryId: req.params.id });
  if (products.length > 0 || subcategories.length > 0) {
    return next(
      new HandleERROR(
        "this category contains products or sub-categories and cannot be deleted",
        400,
      ),
    );
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new HandleERROR("category not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "category deleted successfully",
    data: category,
  });
});