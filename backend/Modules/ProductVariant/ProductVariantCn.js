import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import ProductVariant from "./ProductVariantMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(ProductVariant, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(ProductVariant, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: "variantId" });
  const result = await features.execute();
  const product=await Product.findById(result.data[0].productId)
  if(!product.isPublished && req.role!='superAdmin' &&req.role!='admin'){
        return next(new HandleERROR("you don't have permission",401))
  }
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.create(req.body);
  const product = await Product.findById(productVariant.productId);
  if (!product?.defaultProductVariantId) {
    product.defaultProductVariantId = productVariant._id;
  }
  product.productVariantIds.push(productVariant._id);
  await product.save();
  return res.status(201).json({
    success: true,
    message: "ProductVariant created successfully",
    data: productVariant,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "productVariant updated successfully",
    data: productVariant,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id);
  if (productVariant.boughtCount > 0) {
    return next(new HandleERROR("you Can not deleted/", 400));
  }
  await ProductVariant.findByIdAndDelete(id);
  const product = await Product.findById(productVariant.productId);
  product.productVariantIds = product.productVariantIds.filter(
    (item) => item.toString() != id.toString(),
  );
  if (product.defaultProductVariantId.toString() == id.toString()) {
    product.defaultProductVariantId =
      product.productVariantIds.length > 0
        ? product.productVariantIds?.at(-1)
        : null;
  }
  await product.save()
  return res.status(201).json({
    success: true,
    message: "productVariant deleted successfully",
    data: productVariant,
  });
});
