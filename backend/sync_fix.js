// // sync_all.js
// await mongoose.connect('mongodb://localhost:27017/e-commerce');
// import mongoose from 'mongoose';
// import Product from './Modules/Product/ProductMd.js';
// import ProductVariant from './Modules/ProductVariant/ProductVariantMd.js';

// async function runSync() {
//   await mongoose.connect('mongodb://localhost:27017/e-commerce');
  
//   const products = await Product.find({});
//   for (const product of products) {
//     // یافتن واریانت‌هایی که متعلق به این محصول هستند
//     const variants = await ProductVariant.find({ productId: product._id });
    
//     // استخراج فقط آیدی‌ها
//     const variantIds = variants.map(v => v._id);
    
//     // آپدیت کردن محصول
//     await Product.findByIdAndUpdate(product._id, { 
//       productVariantIds: variantIds 
//     });
//     console.log(`محصول ${product.title} با ${variantIds.length} واریانت سینک شد.`);
//   }
//   process.exit();
// }
// runSync();



// // sync_fix.js
// import mongoose from 'mongoose';
// import Product from './Modules/Product/ProductMd.js';

// async function fixSync() {
//   await mongoose.connect('mongodb://localhost:27017/e-commerce');
//   const products = await Product.find();

//   for (let p of products) {
//     // کپی کردن مقادیر از variantIds به productVariantIds (اگر خالی است)
//     if (p.variantIds && p.variantIds.length > 0) {
//       p.productVariantIds = p.variantIds;
//       await p.save();
//       console.log(`محصول ${p.title} اصلاح شد.`);
//     }
//   }
//   process.exit();
// }
// fixSync();
