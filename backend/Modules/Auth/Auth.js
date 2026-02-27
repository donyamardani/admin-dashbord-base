import { Router } from "express";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./AuthCn.js";
import {
  authValidator,
  forgetPasswordValidator,
  loginWithOtpValidator,
  loginWithPasswordValidator,
  resendCodeValidator,
} from "./AuthValidator.js";

const authRouter = Router();
authRouter.post("/", authValidator, handleValidationErrors, auth);
authRouter.post(
  "/login-password",
  loginWithPasswordValidator,
  handleValidationErrors,
  loginWithPassword
);
authRouter.post(
  "/login-otp",
  loginWithOtpValidator,
  handleValidationErrors,
  loginWithOtp
);
authRouter.post(
  "/resend-code",
  resendCodeValidator,
  handleValidationErrors,
  resendCode
);
authRouter.post(
  "/forget-password",
  forgetPasswordValidator,
  handleValidationErrors,
  forgetPassword
);
export default authRouter;
