import { Router } from "express";
import { search } from "./SearchCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { searchValidator } from "./SearchValidator.js";

const searchRouter = Router();
searchRouter.route("/").get(searchValidator, handleValidationErrors, search);
export default searchRouter;
