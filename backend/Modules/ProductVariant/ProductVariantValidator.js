import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (v) => mongoose.Types.ObjectId.isValid(v);

/* =========================================================
   PARAMS
========================================================= */
export const productVariantIdParam = [
  param("id")
    .notEmpty()
    .withMessage("ProductVariant id is required")
    .custom(isMongoId)
    .withMessage("Invalid ProductVariant id"),
];

/* =========================================================
   QUERY (GET /api/product-variant)
========================================================= */
export const getAllProductVariantValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive number"),

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

  // common filters (ApiFeatures.filter can use them)
  query("productId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  query("variantId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid variantId"),
];

/* =========================================================
   CREATE (POST /api/product-variant) - Admin only
========================================================= */
export const createProductVariantValidator = [
  body("variantId")
    .exists()
    .withMessage("variantId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid variantId"),

  body("productId")
    .exists()
    .withMessage("productId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  body("quantity")
    .exists()
    .withMessage("quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("quantity must be an integer >= 0"),

  body("price")
    .exists()
    .withMessage("price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("price must be a number >= 0"),

  body("discountPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("discountPercent must be between 0 and 100"),

  // optional (schema validator checks <= price)
  body("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceAfterDiscount must be a number >= 0"),

  body("boughtCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("boughtCount must be >= 0"),
];

/* =========================================================
   UPDATE (PATCH /api/product-variant/:id) - Admin only
========================================================= */
export const updateProductVariantValidator = [
  ...productVariantIdParam,

  body("variantId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid variantId"),

  body("productId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("quantity must be an integer >= 0"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("price must be a number >= 0"),

  body("discountPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("discountPercent must be between 0 and 100"),

  body("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceAfterDiscount must be a number >= 0"),

  body("boughtCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("boughtCount must be >= 0"),
];
