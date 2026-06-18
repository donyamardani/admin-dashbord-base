import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import DiscountCode from "./DiscountCodeMd.js";
import Cart from "../Cart/CartMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters(
      req.query?.search
        ? { code: { $regex: req.query.search, $options: "i" } }
        : {},
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({
      path: "userIdsUsed",
      select: "phoneNumber role fullName",
    });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.create(req.body);
  return res.status(201).json({
    success: true,
    message: "discountCode created successfully",
    data: discountCode,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true, // FIX #7: was "runValidator"
      new: true,
    },
  );
  return res.status(201).json({
    success: true,
    message: "discountCode updated successfully",
    data: discountCode,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.findById(req.params.id);
  if (discountCode.userIdsUsed.length > 0) {
    return next(new HandleERROR("you can't delete this discount code", 400));
  }
  await DiscountCode.findByIdAndDelete(req.params.id);
  return res.status(201).json({
    success: true,
    message: "discountCode deleted successfully",
    data: discountCode,
  });
});

export const validateCode = (userId, totalPrice, discountCode) => {
  const error = [];
  const now = new Date();

  const userUsed = discountCode.userIdsUsed?.filter(
    (item) => item.toString() === userId.toString(),
  ).length;

  if (!discountCode.isPublished) {
    error.push("discount code unavailable");
  }
  if (discountCode?.minPrice && totalPrice < discountCode.minPrice) {
    error.push(`min price to use this code is ${discountCode.minPrice}`);
  }
  if (discountCode?.maxPrice && totalPrice > discountCode.maxPrice) {
    error.push(`max price to use this code is ${discountCode.maxPrice}`);
  }
  if (userUsed >= discountCode.maxUsedCount) {
    error.push("used before");
  }
  if (now > discountCode.endDate || now < discountCode.startDate) {
    error.push("unavailable in this time");
  }

  return {
    success: error.length === 0,
    error,
  };
};

export const checkCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { userId } = req;

  const discountCode = await DiscountCode.findOne({ code });
  if (!discountCode) {
    return next(new HandleERROR("incorrect code", 400));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new HandleERROR("cart not found", 404));
  }

  // FIX #5: call validateCode and spread the RESULT object, not the function itself
  const validate = validateCode(userId, cart.totalPriceAfterDiscount, discountCode);
  if (!validate.success) {
    return res.status(400).json({
      success: false,
      ...validate,         // ← was "...validateCode" (spreading the function — bug fixed)
      message: "invalid code",
    });
  }

  let finalPrice = cart.totalPriceAfterDiscount;
  if (discountCode.type === "amount") {
    finalPrice -= discountCode.value;
  } else {
    finalPrice = finalPrice * (1 - discountCode.value / 100);
  }
  // Prevent negative final price
  finalPrice = Math.max(0, finalPrice);

  return res.status(200).json({
    success: true,
    data: finalPrice,
  });
});
