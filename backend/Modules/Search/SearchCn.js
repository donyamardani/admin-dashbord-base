import { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import Category from "../Category/CategoryMd.js";
import Brand from "../Brand/BrandMd.js";

export const search = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return next(new HandleERROR("search item must be fill", 400));
  }
  const products = await Product.find({
    title: { $regex: q, $options: "i" },
    isPublished: true,
  })
    .sort("-createdAt")
    .limit(10)
    .select("title images");
  const categories = await Category.find({
    title: { $regex: q, $options: "i" },
    isPublished: true,
  })
    .sort("-createdAt")
    .limit(10)
    .select("title image");
  const brands = await Brand.find({
    title: { $regex: q, $options: "i" },
    isPublished: true,
  })
    .sort("-createdAt")
    .limit(10)
    .select("title image");
  if (brands.length == 0 && categories.length == 0 && products.length == 0) {
    return next(new HandleERROR("not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: { categories, products, brands },
  });
});
