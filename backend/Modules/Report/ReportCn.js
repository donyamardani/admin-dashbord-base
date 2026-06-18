import { catchAsync } from "vanta-api";
import Order from "../Order/OrderMd.js";

export const dashboardReport = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 100 } = req.query;
  const skip = (page - 1) * limit;

  const mostBoughtPricePipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        totalPricePerUser: { $sum: "$totalPriceAfterDiscount" },
      },
    },
    { $sort: { totalPricePerUser: -1 } },
    { $skip: Number(skip) },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  const mostBoughtCountPipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        boughtCount: { $sum: 1 },
      },
    },
    { $sort: { boughtCount: -1 } },
    { $skip: Number(skip) },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  // FIX #10: MongoDB aggregation works on raw documents — items.categoryId is a plain
  // ObjectId here, NOT a populated object. The original "$items.categoryId._id" always
  // resolved to undefined, grouping everything under _id: null.
  // Fix: group directly on "$items.categoryId" (the raw ObjectId), then $lookup
  // the category name from the categories collection afterward.
  const mostSoldByCategoryPipeline = [
    { $match: { status: "success" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.categoryId", // ← raw ObjectId, not ._id
        boughtCount: { $sum: "$items.quantity" },
      },
    },
    { $sort: { boughtCount: -1 } },
    { $skip: Number(skip) },
    { $limit: Number(limit) },
    // Join category title so the response is still human-readable
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        boughtCount: 1,
        categoryTitle: "$category.title",
      },
    },
  ];

  const [mostBoughtPrice, mostBoughtCount, mostSoldByCategory] =
    await Promise.all([
      Order.aggregate(mostBoughtPricePipeline),
      Order.aggregate(mostBoughtCountPipeline),
      Order.aggregate(mostSoldByCategoryPipeline),
    ]);

  return res.status(200).json({
    success: true,
    data: {
      mostBoughtPrice,
      mostBoughtCount,
      mostSoldByCategory,
    },
  });
});
