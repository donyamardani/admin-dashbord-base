import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";
import fs from "fs";
import Slider from "./SliderMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Slider, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? {}
        : { isPublished: true }
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
  const features = new ApiFeatures(Slider, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] }
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  return res.status(201).json({
    success: true,
    message: "slider created successfully",
    data: slider,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    runValidator: true,
    new: true,
  });
  return res.status(201).json({
    success: true,
    message: "slider updated successfully",
    data: slider,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);
  if (fs.existsSync(`${__dirname}/Public/${slider.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${slider.image}`);
  }
  return res.status(201).json({
    success: true,
    message: "slider deleted successfully",
    data: slider,
  });
});
