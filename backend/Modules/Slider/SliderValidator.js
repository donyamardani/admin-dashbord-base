import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */

/* ---------- slider id param ---------- */
export const sliderIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Slider id is required")
    .custom(isMongoId)
    .withMessage("Invalid slider id"),
];

/* =========================================================
   QUERY
========================================================= */

/* ---------- get all sliders ---------- */
export const getAllSliderValidator = [
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
    .withMessage("search must be a string"),

  query("sort")
    .optional()
    .isString()
    .withMessage("sort must be a string"),

  query("fields")
    .optional()
    .isString()
    .withMessage("fields must be a string"),

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   CREATE
========================================================= */

/* ---------- create slider ---------- */
export const createSliderValidator = [
  body("title")
    .exists()
    .withMessage("Slider title is required")
    .bail()
    .isString()
    .withMessage("Slider title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Slider title must be between 2 and 150 characters"),

  body("image")
    .exists()
    .withMessage("Slider image is required")
    .bail()
    .isString()
    .withMessage("Slider image must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider image cannot be empty"),

  body("href")
    .exists()
    .withMessage("Slider href is required")
    .bail()
    .isString()
    .withMessage("Slider href must be a string")
    .bail()
    .trim()
    .isURL()
    .withMessage("Slider href must be a valid URL"),

  body("path")
    .exists()
    .withMessage("Slider path is required")
    .bail()
    .isString()
    .withMessage("Slider path must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider path cannot be empty"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   UPDATE
========================================================= */

/* ---------- update slider ---------- */
export const updateSliderValidator = [
  ...sliderIdParam,

  body("title")
    .optional()
    .isString()
    .withMessage("Slider title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Slider title must be between 2 and 150 characters"),

  body("image")
    .optional()
    .isString()
    .withMessage("Slider image must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider image cannot be empty"),

  body("href")
    .optional()
    .isString()
    .withMessage("Slider href must be a string")
    .bail()
    .trim()
    .isURL()
    .withMessage("Slider href must be a valid URL"),

  body("path")
    .optional()
    .isString()
    .withMessage("Slider path must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slider path cannot be empty"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];
