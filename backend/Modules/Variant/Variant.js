import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { create, getAll, getOne, remove, update } from "./VariantCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

import {
  getAllVariantValidator,
  createVariantValidator,
  updateVariantValidator,
  variantIdParam,
} from "./VariantValidator.js";

const variantRouter = Router();

variantRouter
  .route("/")
  .post(isAdmin, createVariantValidator, handleValidationErrors, create)
  .get(getAllVariantValidator, handleValidationErrors, getAll);

variantRouter
  .route("/:id")
  .get(variantIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateVariantValidator, handleValidationErrors, update)
  .delete(isAdmin, variantIdParam, handleValidationErrors, remove);

export default variantRouter;
