import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Variant from "./VariantMd.js";
import ProductVariant from "../ProductVariant/ProductVariantMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  // FIX: "search" is not in vanta-api's RESERVED_QUERY_KEYS, so leaving it in
  // req.query causes ApiFeatures to also add a literal { search: <value> }
  // match filter (since no document has a "search" field, this always
  // returns 0 results). Strip it out before constructing ApiFeatures.
  const { search, ...restQuery } = req.query;
  const features = new ApiFeatures(Variant, restQuery, req.role)
    .addManualFilters({
      ...(search
        ? { value: { $regex: search, $options: "i" } }
        : {}),
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
  const features = new ApiFeatures(Variant, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);
  return res.status(201).json({
    success: true,
    message: "variant created successfully",
    data: variant,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "variant updated successfully",
    data: variant,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.find({ variantId: req.params.id });
  if (productVariant.length > 0) {
    return next(
      new HandleERROR(
        "this Variant contain some product you can not deleted",
        400,
      ),
    );
  }
  const variant = await Variant.findByIdAndDelete(req.params.id);
  return res.status(201).json({
    success: true,
    message: "variant deleted successfully",
    data: variant,
  });
});