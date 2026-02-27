import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./AddressCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import {
  getAllAddressValidator,
  createAddressValidator,
  updateAddressValidator,
  addressIdParam,
} from "./AddressValidator.js";

const addressRouter = Router();

addressRouter
  .route("/")
  .post(createAddressValidator, handleValidationErrors, create)
  .get(getAllAddressValidator, handleValidationErrors, getAll);

addressRouter
  .route("/:id")
  .get(addressIdParam, handleValidationErrors, getOne)
  .patch(updateAddressValidator, handleValidationErrors, update)
  .delete(addressIdParam, handleValidationErrors, remove);

export default addressRouter;
