import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { create, getAll, getOne, remove, update } from "./ProductVariantCn.js";

import {
  getAllProductVariantValidator,
  createProductVariantValidator,
  updateProductVariantValidator,
  productVariantIdParam,
} from "./ProductVariantValidator.js";

const productVariantRouter = Router();

productVariantRouter
  .route("/")
  .post(isAdmin, createProductVariantValidator, handleValidationErrors, create)
  .get(getAllProductVariantValidator, handleValidationErrors, getAll);

productVariantRouter
  .route("/:id")
  .get(productVariantIdParam, handleValidationErrors, getOne)
  .patch(isAdmin, updateProductVariantValidator, handleValidationErrors, update)
  .delete(isAdmin, productVariantIdParam, handleValidationErrors, remove);

export default productVariantRouter;
