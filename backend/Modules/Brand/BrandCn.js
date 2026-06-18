import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Brand from "./BrandMd.js";
import Product from "../Product/ProductMd.js";
import { __dirname } from "../../app.js";
import fs from "fs";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req.query, req.role)
    .addManualFilters({
      ...(req.query?.search
        ? { title: { $regex: req.query.search, $options: "i" } }
        : {}),
      ...(req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { isPublished: true }),
    })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  return res.status(201).json({
    success: true,
    message: "brand created successfully",
    data: brand,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true, // FIX #7: was "runValidator"
    new: true,
  });
  if (!brand) {
    return next(new HandleERROR("brand not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "brand updated successfully",
    data: brand,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.find({ brandId: req.params.id });
  if (products.length > 0) {
    return next(
      new HandleERROR(
        "this brand contains products and cannot be deleted",
        400,
      ),
    );
  }
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new HandleERROR("brand not found", 404));
  }
  if (fs.existsSync(`${__dirname}/Public/${brand.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${brand.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "brand deleted successfully",
    data: brand,
  });
});
