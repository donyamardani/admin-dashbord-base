import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import { changePassword, getAll, getOne, update } from "./UserCn.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  getAllUserValidator,
  updateUserValidator,
  userIdParam,
  changePasswordValidator,
} from "./UserValidator.js";
import { handleValidationErrors } from "./../../Utils/handleValidationError.js";
const userRouter = Router();
userRouter
  .route("/")
  .get(isAdmin, getAllUserValidator, handleValidationErrors, getAll);

userRouter
  .route("/change-password")
  .patch(
    isLogin,
    changePasswordValidator,
    handleValidationErrors,
    changePassword
  );
userRouter
  .route("/:id")
  .get(isLogin, userIdParam, handleValidationErrors, getOne)
  .patch(isLogin, updateUserValidator, handleValidationErrors, update);
export default userRouter;
