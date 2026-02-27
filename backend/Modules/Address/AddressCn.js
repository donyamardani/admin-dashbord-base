import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";
import Address from "./AddressMd.js";
import User from "../User/UserMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters({
      ...(req.query?.search
        ? { title: { $regex: req.query.search, $options: "i" } }
        : {}),
      ...(req.role == "admin" || req.role == "superAdmin"
        ? {}
        : { userId: req.userId }),
    })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: 'userId', select: "phoneNumber fullName" });
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { userId: req.userId }] },
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({ path: 'userId', select: "phoneNumber fullName" });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const address = await Address.create({ ...req.body, userId: req.userId });
  await User.findByIdAndUpdate(req.userId, {
    $push: { addressIds: address._id },
  });
  return res.status(201).json({
    success: true,
    message: "address created successfully",
    data: address,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { userId = null, ...otherData } = req.body;
  const address = await Address.findById(req.params.id);
  if (
    address.userId.toString() != req.userId.toString() &&
    req.role != "admin" &&
    req.role != "superAdmin"
  ) {
    return next(new HandleERROR("you don't have permission", 401));
  }
  const newAddress = await Address.findByIdAndUpdate(req.params.id, otherData, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "address updated successfully",
    data: newAddress,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  if (
    address.userId.toString() != req.userId.toString() &&
    req.role != "admin" &&
    req.role != "superAdmin"
  ) {
    return next(new HandleERROR("you don't have permission", 401));
  }
  await Address.findByIdAndDelete(req.params.id);
 
  await User.findByIdAndUpdate(address.userId, {
    $pull: { addressIds: address._id },
  });

  return res.status(201).json({
    success: true,
    message: "address deleted successfully",
    data: Address,
  });
});
