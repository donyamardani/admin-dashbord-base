import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */
export const productIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Product id is required")
    .custom(isMongoId)
    .withMessage("Invalid product id"),
];

/* =========================================================
   QUERY (GET /api/products)
========================================================= */
export const getAllProductValidator = [
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

  // helpful filters (ApiFeatures.filter() may use them)
  query("brandId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid brandId"),

  query("categoryId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid categoryId"),
];

/* =========================================================
   CREATE (POST /api/products) - Admin only
========================================================= */
const informationItemValidator = [
  body("information")
    .optional()
    .isArray()
    .withMessage("information must be an array"),

  body("information.*.key")
    .if(body("information").exists())
    .isString()
    .withMessage("information.key must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("information.key cannot be empty"),

  body("information.*.value")
    .if(body("information").exists())
    .isString()
    .withMessage("information.value must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("information.value cannot be empty"),
];

export const createProductValidator = [
  body("brandId")
    .exists()
    .withMessage("brandId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid brandId"),

  body("categoryId")
    .exists()
    .withMessage("categoryId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid categoryId"),

  body("title")
    .exists()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 200 })
    .withMessage("title must be between 2 and 200 characters"),

  body("description")
    .exists()
    .withMessage("description is required")
    .bail()
    .isString()
    .withMessage("description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty"),

  body("images")
    .optional()
    .isArray()
    .withMessage("images must be an array"),
  body("images.*")
    .optional()
    .isString()
    .withMessage("each image must be a string"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("each tag must be a string")
    .bail()
    .trim(),

  body("defaultProductVariantId")
    .optional({ nullable: true })
    .custom((v) => v === null || isMongoId(v))
    .withMessage("Invalid defaultProductVariantId"),

  body("productVariantIds")
    .optional()
    .isArray()
    .withMessage("productVariantIds must be an array"),
  body("productVariantIds.*")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid productVariantId"),

  body("avgRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("avgRating must be between 0 and 5"),

  body("ratingCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ratingCount must be >= 0"),

  body("boughtCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("boughtCount must be >= 0"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),

  ...informationItemValidator,
];

/* =========================================================
   UPDATE (PATCH /api/products/:id) - Admin only
========================================================= */
export const updateProductValidator = [
  ...productIdParam,

  body("brandId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid brandId"),

  body("categoryId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid categoryId"),

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 200 })
    .withMessage("title must be between 2 and 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty"),

  body("images")
    .optional()
    .isArray()
    .withMessage("images must be an array"),
  body("images.*")
    .optional()
    .isString()
    .withMessage("each image must be a string"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("each tag must be a string")
    .bail()
    .trim(),

  body("defaultProductVariantId")
    .optional({ nullable: true })
    .custom((v) => v === null || isMongoId(v))
    .withMessage("Invalid defaultProductVariantId"),

  body("productVariantIds")
    .optional()
    .isArray()
    .withMessage("productVariantIds must be an array"),
  body("productVariantIds.*")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid productVariantId"),

  body("avgRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("avgRating must be between 0 and 5"),

  body("ratingCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ratingCount must be >= 0"),

  body("boughtCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("boughtCount must be >= 0"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),

  ...informationItemValidator,
];
