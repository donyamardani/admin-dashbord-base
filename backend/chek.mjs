// test.mjs
import mongoose from "mongoose";

// همه مدل‌های مورد نیاز را import کنید
import "./modules/Product/ProductMd.js";           // Product
import "./modules/ProductVariant/ProductVariantMd.js";    // ProductVariant
import "./modules/Variant/VariantMd.js";           // Variant
import "./modules/Category/CategoryMd.js";          // Category
import "./modules/Brand/BrandMd.js";             // Brand

// حالا Product را import کنید
import Product from "./modules/Product/ProductMd.js";

// await mongoose.connect("mongodb://localhost:27017/e-commerce");

// const product = await Product.findOne().populate([
//   {
//     path: "productVariantIds",
//     populate: { path: "variantId", model: "Variant" },
//   },
//   { path: "categoryId" },
//   { path: "brandId" },
// ]);

// console.log(JSON.stringify(product, null, 2));
// await mongoose.disconnect();


await mongoose.connect("mongodb://localhost:27017/e-commerce");

const id = "6a15c02d5cf7fe2936178a70";
console.log("Testing ID:", id);

const product = await Product.findById(id);
console.log("findById result:", product ? "FOUND" : "NOT FOUND");

const product2 = await Product.findOne({ _id: id });
console.log("findOne result:", product2 ? "FOUND" : "NOT FOUND");

await mongoose.disconnect();