import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "./SliderCn.js";

import {
  getAllSliderValidator,
  createSliderValidator,
  updateSliderValidator,
  sliderIdParam,
} from "./SliderValidator.js";

import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const sliderRouter = Router();

sliderRouter
  .route("/")
  .get(getAllSliderValidator, handleValidationErrors, getAll)
  .post(isAdmin, createSliderValidator, handleValidationErrors, create);

sliderRouter
  .route("/:id")
  .get(sliderIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateSliderValidator, handleValidationErrors, update)
  .delete(isAdmin, sliderIdParam, handleValidationErrors, remove);

export default sliderRouter;
