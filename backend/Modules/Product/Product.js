import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { create, favorite, getAll, getOne, remove, update } from "./ProductCn.js";

import {
  getAllProductValidator,
  createProductValidator,
  updateProductValidator,
  productIdParam,
} from "./ProductValidator.js";

const productRouter = Router();

productRouter
  .route("/")
  .post(isAdmin, createProductValidator, handleValidationErrors, create)
  .get(getAllProductValidator, handleValidationErrors, getAll);

productRouter
  .route("/:id")
  .get(productIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateProductValidator, handleValidationErrors, update)
  .delete(isAdmin, productIdParam, handleValidationErrors, remove);

productRouter
  .route("/fav/:id")
  .post(isLogin, productIdParam, handleValidationErrors, favorite);

export default productRouter;
