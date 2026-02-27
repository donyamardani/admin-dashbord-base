import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { create, getAll, getOne, remove, update } from "./CategoryCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

import {
  getAllCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParam,
} from "./CategoryValidator.js";
const categoryRouter = Router();
categoryRouter
  .route("/")
  .post(isAdmin, createCategoryValidator, handleValidationErrors, create)
  .get(getAllCategoryValidator, handleValidationErrors, getAll);

categoryRouter
  .route("/:id")
  .get(categoryIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateCategoryValidator, handleValidationErrors, update)
  .delete(isAdmin, categoryIdParam, handleValidationErrors, remove);

export default categoryRouter;
