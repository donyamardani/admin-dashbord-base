import { body } from "express-validator";

/**
 * Shared phone number validator (Iran mobile format)
 * example: 09xxxxxxxxx
 */
const phoneNumberValidator = body("phoneNumber")
  .exists()
  .withMessage("phoneNumber is required")
  .bail()
  .isString()
  .withMessage("phoneNumber must be a string")
  .bail()
  .trim()
  .matches(/^09\d{9}$/)
  .withMessage("invalid phone number format");

/* ---------------------------------- */
/* AUTH (send otp or password login)  */
/* ---------------------------------- */
export const authValidator = [
  phoneNumberValidator,
];

/* ------------------------- */
/* LOGIN WITH PASSWORD      */
/* ------------------------- */
export const loginWithPasswordValidator = [
  phoneNumberValidator,

  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("password cannot be empty"),
];

/* ------------------------- */
/* LOGIN WITH OTP            */
/* ------------------------- */
export const loginWithOtpValidator = [
  phoneNumberValidator,

  body("code")
    .exists()
    .withMessage("code is required")
    .bail()
    .isString()
    .withMessage("code must be a string")
    .bail()
    .trim()
    .isLength({ min: 4, max: 6 })
    .withMessage("code must be 4 to 6 digits")
    .matches(/^\d+$/)
    .withMessage("code must be numeric"),
];

/* ------------------------- */
/* RESEND OTP CODE           */
/* ------------------------- */
export const resendCodeValidator = [
  phoneNumberValidator,
];

/* ------------------------- */
/* FORGET PASSWORD           */
/* ------------------------- */
export const forgetPasswordValidator = [
  phoneNumberValidator,

  body("code")
    .exists()
    .withMessage("code is required")
    .bail()
    .isString()
    .withMessage("code must be a string")
    .bail()
    .trim()
    .isLength({ min: 4, max: 6 })
    .withMessage("code must be 4 to 6 digits")
    .matches(/^\d+$/)
    .withMessage("code must be numeric"),

  body("newPassword")
    .exists()
    .withMessage("newPassword is required")
    .bail()
    .isString()
    .withMessage("newPassword must be a string")
    .bail()
    .trim()
    .isLength({ min: 8 })
    .withMessage("newPassword must be at least 8 characters long"),
];
