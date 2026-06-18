import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { checkCode, create, getAll, getOne, remove, update } from "./DiscountCodeCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";

import {
  getAllDiscountCodeValidator,
  createDiscountCodeValidator,
  updateDiscountCodeValidator,
  discountCodeIdParam,
  checkDiscountCodeValidator,
} from "./DiscountCodeValidator.js";

const discountCodeRouter = Router();

discountCodeRouter
  .route("/")
  .get(isAdmin, getAllDiscountCodeValidator, handleValidationErrors, getAll)
  .post(isAdmin, createDiscountCodeValidator, handleValidationErrors, create);

discountCodeRouter
  .route("/check-code")
  .post(isLogin, checkDiscountCodeValidator, handleValidationErrors, checkCode);

discountCodeRouter
  .route("/:id")
  .get(isAdmin, discountCodeIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateDiscountCodeValidator, handleValidationErrors, update)
  .delete(isAdmin, discountCodeIdParam, handleValidationErrors, remove);

export default discountCodeRouter;
