import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */
export const variantIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Variant id is required")
    .custom(isMongoId)
    .withMessage("Invalid variant id"),
];

/* =========================================================
   QUERY (GET /api/variants)
========================================================= */
export const getAllVariantValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive number"),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be a string")
    .bail()
    .trim(),

  query("sort")
    .optional()
    .isString()
    .withMessage("sort must be a string")
    .bail()
    .trim(),

  query("fields")
    .optional()
    .isString()
    .withMessage("fields must be a string")
    .bail()
    .trim(),

  query("type")
    .optional()
    .isIn(["size", "color"])
    .withMessage("type must be one of: size, color"),
];

/* =========================================================
   CREATE (POST /api/variants) - Admin only
========================================================= */
export const createVariantValidator = [
  body("type")
    .exists()
    .withMessage("type is required")
    .bail()
    .isString()
    .withMessage("type must be a string")
    .bail()
    .isIn(["size", "color"])
    .withMessage("type must be one of: size, color"),

  body("value")
    .exists()
    .withMessage("value is required")
    .bail()
    .isString()
    .withMessage("value must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("value cannot be empty")
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage("value must be between 1 and 100 characters"),
];

/* =========================================================
   UPDATE (PATCH /api/variants/:id) - Admin only
========================================================= */
export const updateVariantValidator = [
  ...variantIdParam,

  body("type")
    .optional()
    .isString()
    .withMessage("type must be a string")
    .bail()
    .isIn(["size", "color"])
    .withMessage("type must be one of: size, color"),

  body("value")
    .optional()
    .isString()
    .withMessage("value must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("value cannot be empty")
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage("value must be between 1 and 100 characters"),
];
