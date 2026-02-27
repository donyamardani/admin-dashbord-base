import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { addItem, getOne, removeItem } from "./CartCn.js";
import { addItemValidator, getCartValidator, removeItemValidator } from "./CartValidator.js";

const cartRouter = Router();

cartRouter.get("/", getCartValidator, handleValidationErrors, getOne);

cartRouter.post("/add", addItemValidator, handleValidationErrors, addItem);

cartRouter.post("/remove", removeItemValidator, handleValidationErrors, removeItem);

export default cartRouter;
