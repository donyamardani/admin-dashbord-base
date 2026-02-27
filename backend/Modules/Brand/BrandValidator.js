import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */

/* ---------- brand id param ---------- */
export const brandIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Brand ID is required")
    .custom(isMongoId)
    .withMessage("Invalid brand ID format"),
];

/* =========================================================
   QUERY (for getAll)
========================================================= */

/* ---------- get all brands ---------- */
export const getAllBrandValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("search")
    .optional()
    .isString()
    .trim()
    .withMessage("Search term must be a string"),

  query("sort")
    .optional()
    .isString()
    .trim()
    .withMessage("Sort field must be a string"),

  query("fields")
    .optional()
    .isString()
    .trim()
    .withMessage("Fields must be a comma-separated string"),

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value")
    .toBoolean(),
];

/* =========================================================
   CREATE
========================================================= */

/* ---------- create brand ---------- */
export const createBrandValidator = [
  body("title")
    .exists()
    .withMessage("Brand title is required")
    .bail()
    .isString()
    .withMessage("Brand title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Brand title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Brand title must be between 2 and 100 characters"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image path must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Image path cannot exceed 500 characters"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value")
    .toBoolean(),
];

/* =========================================================
   UPDATE
========================================================= */

/* ---------- update brand ---------- */
export const updateBrandValidator = [
  ...brandIdParam,

  body("title")
    .optional()
    .isString()
    .withMessage("Brand title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Brand title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Brand title must be between 2 and 100 characters"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image path must be a string"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value")
    .toBoolean(),
];
