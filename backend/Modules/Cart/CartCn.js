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
        { path: "categoryId", select: "title" },
        { path: "brandId", select: "title" },
      ],
    });
  const result = await features.execute();
  let newTotalPrice = 0;
  let newTotalPriceAfterDiscount = 0;
  let change = false;
  const cart = result.data[0];
  // FIX: use .toObject() to avoid mutating a live Mongoose document
  let newCart = cart.toObject ? cart.toObject() : { ...cart };
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
        { path: "categoryId", select: "title" },
        { path: "brandId", select: "title" },
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

  if (!prv) {
    return next(new HandleERROR("product variant not found", 404));
  }
  if (prv.quantity === 0) {
    return next(
      new HandleERROR("you can not add this item. not enough quantity", 400),
    );
  }

  const cart = await Cart.findOne({ userId: req.userId });
  let add = false;
  // FIX #1: don't use .map() with next() — instead iterate with a for loop
  // so we can return early from the handler if quantity is exceeded.
  for (const item of cart.items) {
    if (item.productVariantId.toString() === productVariantId.toString()) {
      if (item.quantity + 1 > prv.quantity) {
        return next(
          new HandleERROR(
            "you can not add this item. not enough quantity",
            400,
          ),
        );
      }
      item.quantity++;
      add = true;
      break;
    }
  }

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

  const newCart = await Cart.findById(cart._id).populate({
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
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "add to cart successfully",
  });
});

export const removeItem = catchAsync(async (req, res, next) => {
  const { productVariantId } = req.body;
  const prv = await ProductVariant.findById(productVariantId);

  if (!prv) {
    return next(new HandleERROR("product variant not found", 404));
  }

  const cart = await Cart.findOne({ userId: req.userId });

  // FIX #2: check whether the item actually exists before decrementing totals
  const item = cart.items.find(
    (i) => i.productVariantId.toString() === productVariantId.toString(),
  );
  if (!item) {
    return next(new HandleERROR("item not found in cart", 404));
  }

  // FIX #2: guard against quantity already being 0
  if (item.quantity <= 0) {
    return next(new HandleERROR("item quantity is already zero", 400));
  }

  item.quantity--;
  if (item.quantity === 0) {
    cart.items = cart.items.filter(
      (i) => i.productVariantId.toString() !== productVariantId.toString(),
    );
  }

  // Only decrement totals once we've confirmed the item existed
  cart.totalPrice = Math.max(0, cart.totalPrice - prv.price);
  cart.totalPriceAfterDiscount = Math.max(
    0,
    cart.totalPriceAfterDiscount - prv.priceAfterDiscount,
  );
  await cart.save();

  const newCart = await Cart.findById(cart._id).populate({
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
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "remove from cart successfully",
  });
});
