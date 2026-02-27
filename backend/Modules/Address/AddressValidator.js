import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const isMongoId = (v) => mongoose.Types.ObjectId.isValid(v);
const IRAN_PHONE_REGEX = /^(?:\+98|0)?9\d{9}$/;
const POSTAL_REGEX = /^\d{5}-?\d{5}$/;

/* =========================================================
   PARAMS
========================================================= */
export const addressIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Address id is required")
    .custom(isMongoId)
    .withMessage("Invalid address id"),
];

/* =========================================================
   QUERY (GET /api/addresses)
========================================================= */
export const getAllAddressValidator = [
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
];

/* =========================================================
   CREATE (POST /api/addresses) - Login required via app.use
========================================================= */
export const createAddressValidator = [
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
    .isLength({ min: 2, max: 120 })
    .withMessage("title must be between 2 and 120 characters"),

  body("description")
    .exists()
    .withMessage("description is required")
    .bail()
    .isString()
    .withMessage("description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty")
    .bail()
    .isLength({ min: 2, max: 500 })
    .withMessage("description must be between 2 and 500 characters"),

  body("city")
    .exists()
    .withMessage("city is required")
    .bail()
    .isString()
    .withMessage("city must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("city cannot be empty"),

  body("province")
    .exists()
    .withMessage("province is required")
    .bail()
    .isString()
    .withMessage("province must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("province cannot be empty"),

  body("NO")
    .exists()
    .withMessage("NO is required")
    .bail()
    .isString()
    .withMessage("NO must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("NO cannot be empty"),

  body("lat")
    .exists()
    .withMessage("lat is required")
    .bail()
    .isString()
    .withMessage("lat must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("lat cannot be empty"),

  body("lng")
    .exists()
    .withMessage("lng is required")
    .bail()
    .isString()
    .withMessage("lng must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("lng cannot be empty"),

  body("postalCode")
    .exists()
    .withMessage("postalCode is required")
    .bail()
    .isString()
    .withMessage("postalCode must be a string")
    .bail()
    .trim()
    .matches(POSTAL_REGEX)
    .withMessage("invalid postal code"),

  body("receiverPhoneNumber")
    .optional()
    .isString()
    .withMessage("receiverPhoneNumber must be a string")
    .bail()
    .trim()
    .matches(IRAN_PHONE_REGEX)
    .withMessage("invalid receiver phone number"),

  body("receiverFullName")
    .optional()
    .isString()
    .withMessage("receiverFullName must be a string")
    .bail()
    .trim()
    .isLength({ max: 120 })
    .withMessage("receiverFullName must be <= 120 chars"),

  body("floor")
    .optional()
    .isString()
    .withMessage("floor must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("floor must be <= 50 chars"),

  body("units")
    .optional()
    .isString()
    .withMessage("units must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("units must be <= 50 chars"),
];

/* =========================================================
   UPDATE (PATCH /api/addresses/:id) - Login required
========================================================= */
export const updateAddressValidator = [
  ...addressIdParam,

  // userId should not be accepted (your controller ignores it), but validate if someone sends it
  body("userId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid userId"),

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 120 })
    .withMessage("title must be between 2 and 120 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty")
    .bail()
    .isLength({ min: 2, max: 500 })
    .withMessage("description must be between 2 and 500 characters"),

  body("city")
    .optional()
    .isString()
    .withMessage("city must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("city cannot be empty"),

  body("province")
    .optional()
    .isString()
    .withMessage("province must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("province cannot be empty"),

  body("NO")
    .optional()
    .isString()
    .withMessage("NO must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("NO cannot be empty"),

  body("lat")
    .optional()
    .isString()
    .withMessage("lat must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("lat cannot be empty"),

  body("lng")
    .optional()
    .isString()
    .withMessage("lng must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("lng cannot be empty"),

  body("postalCode")
    .optional()
    .isString()
    .withMessage("postalCode must be a string")
    .bail()
    .trim()
    .matches(POSTAL_REGEX)
    .withMessage("invalid postal code"),

  body("receiverPhoneNumber")
    .optional()
    .isString()
    .withMessage("receiverPhoneNumber must be a string")
    .bail()
    .trim()
    .matches(IRAN_PHONE_REGEX)
    .withMessage("invalid receiver phone number"),

  body("receiverFullName")
    .optional()
    .isString()
    .withMessage("receiverFullName must be a string")
    .bail()
    .trim()
    .isLength({ max: 120 })
    .withMessage("receiverFullName must be <= 120 chars"),

  body("floor")
    .optional()
    .isString()
    .withMessage("floor must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("floor must be <= 50 chars"),

  body("units")
    .optional()
    .isString()
    .withMessage("units must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("units must be <= 50 chars"),
];
