import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

const IRAN_PHONE_REGEX = /^(?:\+98|0)?9\d{9}$/;

/* =========================================================
   PARAMS
========================================================= */

/* ---------- user id param ---------- */
export const userIdParam = [
  param("id")
    .notEmpty()
    .withMessage("user id is required")
    .custom(isMongoId)
    .withMessage("Invalid user id"),
];

/* =========================================================
   QUERY
========================================================= */

/* ---------- get all users ---------- */
export const getAllUserValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a number"),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be string")
];

/* =========================================================
   CREATE
========================================================= */


/* =========================================================
   UPDATE
========================================================= */

/* ---------- update user ---------- */
export const updateUserValidator = [
  ...userIdParam,

  body("phoneNumber")
    .optional()
    .matches(IRAN_PHONE_REGEX)
    .withMessage("invalid iranian phone number"),

  body("fullName")
    .optional()
    .isString()
    .withMessage("fullName must be string")
    .isLength({ max: 100 })
    .withMessage("fullName must be less than 100 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),

  body("role")
    .optional()
    .isIn(["admin", "user", "superAdmin"])
    .withMessage("invalid role value"),
];


// change password
export const changePasswordValidator = [
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

  body("oldPassword")
    .optional()
    .isString()
    .withMessage("oldPassword must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("oldPassword cannot be empty"),
];