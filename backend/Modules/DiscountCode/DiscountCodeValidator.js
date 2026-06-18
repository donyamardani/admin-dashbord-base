import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const isMongoId = (v) => mongoose.Types.ObjectId.isValid(v);

/* =========================
   PARAMS
========================= */
export const discountCodeIdParam = [
  param("id")
    .notEmpty()
    .withMessage("discount code id is required")
    .custom(isMongoId)
    .withMessage("Invalid discount code id"),
];

/* =========================
   QUERY (GET /api/discount-code) admin
========================= */
export const getAllDiscountCodeValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive number"),
  query("limit").optional().isInt({ min: 1 }).withMessage("limit must be a positive number"),
  query("search").optional().isString().withMessage("search must be a string").bail().trim(),
  query("sort").optional().isString().withMessage("sort must be a string").bail().trim(),
  query("fields").optional().isString().withMessage("fields must be a string").bail().trim(),
  query("populate").optional().isString().withMessage("populate must be a string").bail().trim(),

  // optional direct filters if you want
  query("isPublished").optional().isBoolean().withMessage("isPublished must be boolean").toBoolean(),
  query("type").optional().isIn(["percent", "amount"]).withMessage("type must be percent or amount"),
];

/* =========================
   CREATE (POST /api/discount-code) admin
========================= */
export const createDiscountCodeValidator = [
  body("code")
    .exists()
    .withMessage("code is required")
    .bail()
    .isString()
    .withMessage("code must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("code cannot be empty")
    .bail()
    .isLength({ min: 3, max: 40 })
    .withMessage("code must be between 3 and 40 characters"),

  body("type")
    .exists()
    .withMessage("type is required")
    .bail()
    .isIn(["percent", "amount"])
    .withMessage("type must be percent or amount"),

  // your schema has value as String, but your logic uses numeric math => validate as number-like
  body("value")
    .exists()
    .withMessage("value is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("value must be a number >= 0"),

  body("minPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("minPrice must be >= 0"),

  body("maxPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be >= 0")
    .custom((v, { req }) => {
      const min = req.body?.minPrice;
      if (min == null) return true;
      return Number(v) >= Number(min);
    })
    .withMessage("maxPrice must be >= minPrice"),

  body("startDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("startDate must be a valid ISO date"),

  body("endDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("endDate must be a valid ISO date")
    .custom((v, { req }) => {
      const s = req.body?.startDate;
      if (!s) return true;
      return new Date(v) >= new Date(s);
    })
    .withMessage("endDate must be >= startDate"),

  body("maxUsedCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxUsedCount must be >= 1"),

  body("freeShipping")
    .optional()
    .isBoolean()
    .withMessage("freeShipping must be boolean")
    .toBoolean(),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================
   UPDATE (PATCH /api/discount-code/:id) admin
========================= */
export const updateDiscountCodeValidator = [
  ...discountCodeIdParam,

  body("code")
    .optional()
    .isString()
    .withMessage("code must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("code cannot be empty")
    .bail()
    .isLength({ min: 3, max: 40 })
    .withMessage("code must be between 3 and 40 characters"),

  body("type")
    .optional()
    .isIn(["percent", "amount"])
    .withMessage("type must be percent or amount"),

  body("value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("value must be a number >= 0"),

  body("minPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("minPrice must be >= 0"),

  body("maxPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be >= 0"),

  body("startDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("startDate must be a valid ISO date"),

  body("endDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("endDate must be a valid ISO date"),

  body("maxUsedCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxUsedCount must be >= 1"),

  body("freeShipping")
    .optional()
    .isBoolean()
    .withMessage("freeShipping must be boolean")
    .toBoolean(),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================
   CHECK CODE (POST /api/discount-code/check-code) login
========================= */
export const checkDiscountCodeValidator = [
  body("code")
    .exists()
    .withMessage("code is required")
    .bail()
    .isString()
    .withMessage("code must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("code cannot be empty")
    .bail()
    .isLength({ min: 3, max: 40 })
    .withMessage("code must be between 3 and 40 characters"),
];
