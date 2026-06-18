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
import ProductVariant from "../ProductVariant/ProductVariantMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
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
      req.role == "admin" || req.role == "superAdmin"
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
    runValidator: true,
  });
  return res.status(201).json({
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
  const { userId } = req;
  let discountCode;
  const cart = await Cart.findOne({ userId }).populate({
    path: "items",
    populate: [
      { path: "productId", select: "title images ratingCount avgRating" },
      {
        path: "productVariantId",
        select: "price priceAfterDiscount discountPercent quantity variantId",
        populate: { path: "variantId" },
      },
      {
        path: "categoryId",
        select: "title",
      },
      {
        path: "brandId",
        select: "title",
      },
    ],
  });
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
  let newCart = cart;
  newCart.items = newCart.items?.filter((item) => {
    item.categoryId = item.categoryId._id;
    item.brandId = item.brandId._id;
    if (item.quantity > item.productVariantId.quantity) {
      change = true;
      item.quantity = item.productVariantId.quantity;
      if (item.quantity == 0) {
        return false;
      }
    }
    newTotalPrice += item.quantity * item.productVariantId.price;
    newTotalPriceAfterDiscount +=
      item.quantity * item.productVariantId.priceAfterDiscount;
    item.productVariantId = item.productVariantId._id;
    item.productId = item.productId._id;
    return item;
  });
  if (
    newCart.totalPrice != newTotalPrice ||
    newCart.totalPriceAfterDiscount != newTotalPriceAfterDiscount
  ) {
    change = true;
    newCart.totalPrice = newTotalPrice;
    newCart.totalPriceAfterDiscount = newTotalPriceAfterDiscount;
  }
  let cartResult;
  if (change) {
    cartResult = await Cart.findByIdAndUpdate(cart._id, newCart, {
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
        {
          path: "categoryId",
          select: "title",
        },
        {
          path: "brandId",
          select: "title",
        },
      ],
    });
    return res.status(400).json({
      success: false,
      message: "cart have changed",
      data: cartResult,
    });
  }
  if (discountCode) {
    if (discountCode.type == "amount") {
      newTotalPriceAfterDiscount =
        newTotalPriceAfterDiscount - discountCode.value;
    } else {
      newTotalPriceAfterDiscount =
        newTotalPriceAfterDiscount * (1 - discountCode.value / 100);
    }
  }
  const order = await Order.create({
    items: cart.items,
    userId,
    totalPrice: newTotalPrice,
    totalPriceAfterDiscount: newTotalPriceAfterDiscount,
    freeShipping: discountCode.freeShipping,
    discountCode,
    address,
  });
  const createBankGateway = await createPayment(
    order.totalPriceAfterDiscount,
    "i3center payment",
    order._id,
  );
  if (createBankGateway.data.code != 100) {
    Order.findByIdAndDelete(order._id);
    return res.status(500).json({
      success: false,
      message: createBankGateway?.data?.message || "Bank No Response",
    });
  }
  order.authority = createBankGateway.data.authority;
  await order.save();
  if (discountCode._id) {
    await DiscountCode.findByIdAndUpdate(discountCode._id, {
      $push: { userIdsUsed: userId },
    });
  }
  return res.status(201).json({
    bankGateway: ZARINPAL.GATEWAY + createBankGateway.data.authority,
    success: true,
  });
});

export const bankCallBack = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await Order.findById(orderId);
  const verify = await verifyPayment(
    order.totalPriceAfterDiscount,
    order.authority,
  );
  if (verify.data.code != 100 && verify.data.code != 101) {
    order.status = "failed";
    if (order?.discountCode?._id) {
      await DiscountCode.findByIdAndUpdate(order?.discountCode._id, {
        $pull: { userIdsUsed: userId },
      });
    }
    await order.save();
    return res.redirect(process.env.FRONT_URL + "/failed-payment");
  }
  if (verify.data.code == 100) {
    order.status = "success";
    order.refId = verify.data.ref_id;
    await order.save();
    for (let item of order.items) {
      let incQuantity = item.quantity * -1;
      await ProductVariant.findByIdAndUpdate(item.productVariantId._id, {
        $inc: { quantity: incQuantity },
      });
    }
    return res.redirect(process.env.FRONT_URL + "/success-payment");
  }
  return res.redirect(process.env.FRONT_URL + "/success-payment");
});

export const checkPayment = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (
    order.userId != req.userId &&
    req.role != "admin" &&
    req.role != "superAdmin"
  ) {
    return next(new HandleERROR("you dont have a permission", 403));
  }
  const verify = await verifyPayment(
    order.totalPriceAfterDiscount,
    order.authority,
  );
  if (verify.data.code != 100 && verify.data.code != 101) {
    if (order.status == "pending") {
      order.status = "failed";
      if (order?.discountCode?._id) {
        await DiscountCode.findByIdAndUpdate(order?.discountCode._id, {
          $pull: { userIdsUsed: userId },
        });
      }
      await order.save();
    }
    return res.status(200).json({
      success: true,
      data: order,
      message: "update status of order",
    });
  }
  if (verify.data.code == 100) {
    order.status = "success";
    order.refId = verify.data.ref_id;
    await order.save();
    for (let item of order.items) {
      let incQuantity = item.quantity * -1;
      await ProductVariant.findByIdAndUpdate(item.productVariantId._id, {
        $inc: { quantity: incQuantity },
      });
    }
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
  for (let order of orders) {
    const verify = await verifyPayment(
      order.totalPriceAfterDiscount,
      order.authority,
    );
    if (verify.data.code != 100 && verify.data.code != 101) {
      if (order.status == "pending") {
        order.status = "failed";
        if (order?.discountCode?._id) {
          await DiscountCode.findByIdAndUpdate(order?.discountCode._id, {
            $pull: { userIdsUsed: userId },
          });
        }
        await order.save();
      }
    }
    if (verify.data.code == 100) {
      order.status = "success";
      order.refId = verify.data.ref_id;
      await order.save();
      for (let item of order.items) {
        let incQuantity = item.quantity * -1;
        await ProductVariant.findByIdAndUpdate(item.productVariantId._id, {
          $inc: { quantity: incQuantity },
        });
      }
    }
  }
};
