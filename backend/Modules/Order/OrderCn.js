import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Order from "./OrderMd.js";
import Cart from "../Cart/CartMd.js";
import { validateCode } from "../DiscountCode/DiscountCodeCn.js";
import DiscountCode from "../DiscountCode/DiscountCodeMd.js";
import Address from "../Address/AddressMd.js";
import {
  createPayment,
  verifyPayment,
  ZARINPAL,
} from "../../Services/ZarinpalService.js";
import Product from "../Product/ProductMd.js";
import ProductVariant from "../ProductVariant/ProductVariantMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { userId: req.userId },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: "userId", select: "phoneNumber fullName" });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ userId: req.userId }, { _id: req.params.id }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: "userId", select: "phoneNumber fullName" });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const { authority = null, userId = null, ...otherData } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, otherData, {
    new: true,
    runValidators: true, // FIX #8: was "runValidator"
  });
  if (!order) {
    return next(new HandleERROR("order not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: order,
    message: "order updated successfully",
  });
});

export const payment = catchAsync(async (req, res, next) => {
  const { code = null, addressId = null } = req.body;
  if (!addressId) {
    return next(new HandleERROR("address is required", 400));
  }
  const address = await Address.findById(addressId);
  if (!address) {
    return next(new HandleERROR("address not found", 404));
  }
  const { userId } = req;

  let discountCode = null; // FIX #1: explicit null, never left undefined

  const cart = await Cart.findOne({ userId }).populate({
    path: "items",
    populate: [
      { path: "productId", select: "title images ratingCount avgRating" },
      {
        path: "productVariantId",
        select: "price priceAfterDiscount discountPercent quantity variantId",
        populate: { path: "variantId" },
      },
      { path: "categoryId", select: "title" },
      { path: "brandId", select: "title" },
    ],
  });

  // FIX #9: reject checkout on an empty cart before doing any further work
  if (!cart || !cart.items || cart.items.length === 0) {
    return next(new HandleERROR("your cart is empty", 400));
  }

  if (code) {
    discountCode = await DiscountCode.findOne({ code });
    if (!discountCode?._id) {
      return next(new HandleERROR("invalid code", 400));
    }
    const resultValidateCode = validateCode(
      userId,
      cart.totalPriceAfterDiscount,
      discountCode,
    );
    if (!resultValidateCode.success) {
      return res.status(400).json({
        success: false,
        message: "invalid code",
        error: resultValidateCode.error,
      });
    }
  }

  let newTotalPrice = 0;
  let newTotalPriceAfterDiscount = 0;
  let change = false;
  // FIX #3: work on a plain object copy, not the live Mongoose document,
  // same issue as in CartCt.js getOne
  const newCart = cart.toObject ? cart.toObject() : { ...cart };

  // Keep a reference to the populated items (with productId/productVariantId
  // still as objects) so we can build order item snapshots below, BEFORE
  // they get flattened to bare ObjectIds.
  const populatedItemsBeforeFlatten = JSON.parse(JSON.stringify(newCart.items));

  newCart.items = newCart.items?.filter((item) => {
    item.categoryId = item.categoryId._id;
    item.brandId = item.brandId._id;
    if (item.quantity > item.productVariantId.quantity) {
      change = true;
      item.quantity = item.productVariantId.quantity;
      if (item.quantity === 0) {
        return false;
      }
    }
    newTotalPrice += item.quantity * item.productVariantId.price;
    newTotalPriceAfterDiscount +=
      item.quantity * item.productVariantId.priceAfterDiscount;
    item.productVariantId = item.productVariantId._id;
    item.productId = item.productId._id;
    return true;
  });

  if (
    newCart.totalPrice !== newTotalPrice ||
    newCart.totalPriceAfterDiscount !== newTotalPriceAfterDiscount
  ) {
    change = true;
    newCart.totalPrice = newTotalPrice;
    newCart.totalPriceAfterDiscount = newTotalPriceAfterDiscount;
  }

  if (change) {
    const cartResult = await Cart.findByIdAndUpdate(cart._id, newCart, {
      new: true,
    }).populate({
      path: "items",
      populate: [
        { path: "productId", select: "title images ratingCount avgRating" },
        {
          path: "productVariantId",
          select: "price priceAfterDiscount discountPercent quantity variantId",
          populate: { path: "variantId" },
        },
        { path: "categoryId", select: "title" },
        { path: "brandId", select: "title" },
      ],
    });
    return res.status(400).json({
      success: false,
      message: "cart have changed",
      data: cartResult,
    });
  }

  if (discountCode) {
    if (discountCode.type === "amount") {
      newTotalPriceAfterDiscount -= discountCode.value;
    } else {
      newTotalPriceAfterDiscount =
        newTotalPriceAfterDiscount * (1 - discountCode.value / 100);
    }
    newTotalPriceAfterDiscount = Math.max(0, newTotalPriceAfterDiscount);
  }

  // FIX #1: build item snapshots required by OrderMd.js (title, image, price)
  // using the still-populated copy we saved before flattening above.
  const orderItems = populatedItemsBeforeFlatten.map((item) => ({
    productId: item.productId._id,
    productVariantId: item.productVariantId._id,
    title: item.productId.title,
    image: item.productId.images?.[0] || "",
    price: item.productVariantId.priceAfterDiscount ?? item.productVariantId.price,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    items: orderItems,
    userId,
    totalPrice: newTotalPrice,
    totalPriceAfterDiscount: newTotalPriceAfterDiscount,
    freeShipping: discountCode?.freeShipping || false, // FIX #1: safe access
    discountCode: discountCode
      ? {
          code: discountCode.code,
          amount: discountCode.type === "amount" ? discountCode.value : undefined,
          percentage: discountCode.type === "percent" ? discountCode.value : undefined,
        }
      : undefined,
    address: address
      ? {
          fullName: address.receiverFullName,
          phone: address.receiverPhoneNumber,
          province: address.province,
          city: address.city,
          postalCode: address.postalCode,
          addressLine: `${address.description}, building ${address.buildingNo}`,
        }
      : undefined,
  });

  const createBankGateway = await createPayment(
    order.totalPriceAfterDiscount,
    "i3center payment",
    order._id,
  );

  if (createBankGateway.data.code !== 100) {
    await Order.findByIdAndDelete(order._id); // FIX: was missing await
    return res.status(500).json({
      success: false,
      message: createBankGateway?.data?.message || "Bank No Response",
    });
  }

  order.authority = createBankGateway.data.authority;
  await order.save();

  if (discountCode?._id) {
    await DiscountCode.findByIdAndUpdate(discountCode._id, {
      $push: { userIdsUsed: userId },
    });
  }

  return res.status(201).json({
    bankGateway: ZARINPAL.GATEWAY + createBankGateway.data.authority,
    success: true,
  });
});

// FIX #4: extracted shared logic so boughtCount is updated consistently
// everywhere a successful payment is recorded (callback, manual check, cron)
const markOrderSuccess = async (order, refId) => {
  order.status = "success";
  order.refId = refId;
  await order.save();

  for (const item of order.items) {
    const decQuantity = item.quantity * -1;
    await ProductVariant.findByIdAndUpdate(item.productVariantId, {
      $inc: { quantity: decQuantity, boughtCount: item.quantity },
    });
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { boughtCount: item.quantity },
    });
  }
};

// FIX #2/#10: previously referenced an undefined `userId` — should pull the
// discount usage for the *order's* user, via order.userId, not a stray global.
const markOrderFailed = async (order) => {
  order.status = "failed";
  if (order?.discountCode?.code) {
    const discountCode = await DiscountCode.findOne({
      code: order.discountCode.code,
    });
    if (discountCode?._id) {
      await DiscountCode.findByIdAndUpdate(discountCode._id, {
        $pull: { userIdsUsed: order.userId },
      });
    }
  }
  await order.save();
};

export const bankCallBack = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.redirect(process.env.FRONT_URL + "/failed-payment");
  }
  const verify = await verifyPayment(
    order.totalPriceAfterDiscount,
    order.authority,
  );

  if (verify.data.code !== 100 && verify.data.code !== 101) {
    await markOrderFailed(order); // FIX #2
    return res.redirect(process.env.FRONT_URL + "/failed-payment");
  }
  if (verify.data.code === 100) {
    await markOrderSuccess(order, verify.data.ref_id); // FIX #4
    return res.redirect(process.env.FRONT_URL + "/success-payment");
  }
  return res.redirect(process.env.FRONT_URL + "/success-payment");
});

export const checkPayment = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new HandleERROR("order not found", 404));
  }
  if (
    order.userId.toString() !== req.userId.toString() &&
    req.role !== "admin" &&
    req.role !== "superAdmin"
  ) {
    return next(new HandleERROR("you dont have a permission", 403));
  }

  const verify = await verifyPayment(
    order.totalPriceAfterDiscount,
    order.authority,
  );

  if (verify.data.code !== 100 && verify.data.code !== 101) {
    if (order.status === "pending") {
      await markOrderFailed(order); // FIX #2
    }
    return res.status(200).json({
      success: true,
      data: order,
      message: "update status of order",
    });
  }
  if (verify.data.code === 100) {
    await markOrderSuccess(order, verify.data.ref_id); // FIX #4
    return res.status(200).json({
      success: true,
      data: order,
      message: "change status to success",
    });
  }
  return res.status(200).json({
    success: true,
    data: order,
    message: "we dont have change on this order",
  });
});

export const cronJobPayment = async () => {
  const orders = await Order.find({
    $and: [
      { status: "pending" },
      { createdAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } },
    ],
  });
  for (const order of orders) {
    const verify = await verifyPayment(
      order.totalPriceAfterDiscount,
      order.authority,
    );
    if (verify.data.code !== 100 && verify.data.code !== 101) {
      if (order.status === "pending") {
        await markOrderFailed(order); // FIX #10
      }
    }
    if (verify.data.code === 100) {
      await markOrderSuccess(order, verify.data.ref_id); // FIX #4
    }
  }
};