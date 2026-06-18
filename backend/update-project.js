// import { MongoClient, ObjectId } from "mongodb";

// async function updateProducts() {
//   const client = new MongoClient("mongodb://localhost:27017"); // آدرس دیتابیس
//   try {
//     await client.connect();
//     const db = client.db("e-commerce"); // نام دیتابیس خود را اینجا بنویسید
//     const productsCollection = db.collection("products");

//     // طبق داده‌های ارسالی شما، این نگاشت IDها به محصولات است:
//     const updates = [
//       {
//         filter: { _id: new ObjectId("6a0de9ee7d3ba16f7b8da22a") }, // iPhone 15
//         update: { $set: { productVariantIds: [new ObjectId("6a0cf927956392b43f16856b"), new ObjectId("6a0cf927956392b43f168576")], defaultProductVariantId: new ObjectId("6a0cf927956392b43f16856b") } }
//       },
//       {
//         filter: { _id: new ObjectId("6a0de9ee7d3ba16f7b8da22b") }, // iPhone 16
//         update: { $set: { productVariantIds: [new ObjectId("6a0cf927956392b43f16856c"), new ObjectId("6a0cf927956392b43f168577")], defaultProductVariantId: new ObjectId("6a0cf927956392b43f16856c") } }
//       },
//       // می‌توانید برای بقیه محصولات هم به همین ترتیب ادامه دهید...
//     ];

//     for (const op of updates) {
//       await productsCollection.updateOne(op.filter, op.update);
//     }
//     console.log("Products updated successfully!");
//   } catch (e) { console.error(e); } finally { await client.close(); }
// }
// updateProducts();
