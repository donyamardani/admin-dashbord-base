import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */
export const categoryIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Category id is required")
    .custom(isMongoId)
    .withMessage("Invalid category id"),
];

/* =========================================================
   QUERY (GET /api/categories)
========================================================= */
export const getAllCategoryValidator = [
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

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   CREATE (POST /api/categories)  - Admin only
========================================================= */
export const createCategoryValidator = [
  body("title")
    .exists()
    .withMessage("Category title is required")
    .bail()
    .isString()
    .withMessage("Category title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category title must be between 2 and 100 characters"),

  body("supCategoryId")
    .optional({ nullable: true })
    .custom((value) => value === null || isMongoId(value))
    .withMessage("Invalid supCategoryId"),

  body("image")
    .optional()
    .isString()
    .withMessage("image must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("image cannot exceed 500 characters"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   UPDATE (PATCH /api/categories/:id) - Admin only
========================================================= */
export const updateCategoryValidator = [
  ...categoryIdParam,

  body("title")
    .optional()
    .isString()
    .withMessage("Category title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category title must be between 2 and 100 characters"),

  body("supCategoryId")
    .optional({ nullable: true })
    .custom((value) => value === null || isMongoId(value))
    .withMessage("Invalid supCategoryId"),

  body("image")
    .optional()
    .isString()
    .withMessage("image must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("image cannot exceed 500 characters"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];
