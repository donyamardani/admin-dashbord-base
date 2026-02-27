import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Cart from "./CartMd.js";
import Product from "../Product/ProductMd.js";
import ProductVariant from "../ProductVariant/ProductVariantMd.js";

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Cart, req.query, req.role)
    .addManualFilters({ userId: req.userId })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({
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
  const result = await features.execute();
  let newTotalPrice = 0;
  let newTotalPriceAfterDiscount = 0;
  let change = false;
  const cart = result.data[0];
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
  } else {
    cartResult = cart;
  }
  return res.status(200).json({
    success: true,
    data: cartResult,
  });
});

export const addItem = catchAsync(async (req, res, next) => {
  const { productId, productVariantId } = req.body;
  const pr = await Product.findById(productId);
  const prv = await ProductVariant.findById(productVariantId);
  if (prv.quantity == 0) {
    return next(
      new HandleERROR("you can not add this item.not enough quantity"),
    );
  }
  const cart = await Cart.findOne({ userId: req.userId });
  let add = false;
  cart.items = cart.items.map((item) => {
    if (item.productVariantId == productVariantId) {
      item.quantity++;
      add = true;
      if (item.quantity > prv.quantity) {
        return next(
          new HandleERROR("you can not add this item.not enough quantity"),
        );
      }
    }
    return item;
  });
  if (!add) {
    cart.items.push({
      productId,
      productVariantId,
      quantity: 1,
      brandId: pr.brandId,
      categoryId: pr.categoryId,
    });
  }
  cart.totalPrice += prv.price;
  cart.totalPriceAfterDiscount += prv.priceAfterDiscount;
  await cart.save();
  let newCart = await Cart.findById(cart._id).populate({
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
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "add to cart successfully",
  });
});

export const removeItem = catchAsync(async (req, res, next) => {
  const {  productVariantId } = req.body;
  const prv = await ProductVariant.findById(productVariantId);
 
  const cart = await Cart.findOne({ userId: req.userId });
  cart.items = cart.items.filter((item) => {
    if (item.productVariantId == productVariantId) {
      item.quantity--;
      if (item.quantity==0) {
       return false
      }
    }
    return item;
  })
  cart.totalPrice -= prv.price;
  cart.totalPriceAfterDiscount -= prv.priceAfterDiscount;
  await cart.save();
  let newCart = await Cart.findById(cart._id).populate({
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
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "remove from cart successfully",
  });
});
