import { body, query } from "express-validator";
import mongoose from "mongoose";

const isMongoId = (v) => mongoose.Types.ObjectId.isValid(v);

/* =========================
   QUERY (GET /api/cart)
========================= */
export const getCartValidator = [
  query("fields")
    .optional()
    .isString()
    .withMessage("fields must be a string")
    .bail()
    .trim(),

  query("populate")
    .optional()
    .isString()
    .withMessage("populate must be a string")
    .bail()
    .trim(),
];

/* =========================
   BODY (POST /api/cart/add)
========================= */
export const addItemValidator = [
  body("productId")
    .exists()
    .withMessage("productId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  body("productVariantId")
    .exists()
    .withMessage("productVariantId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productVariantId"),
];

/* =========================
   BODY (POST /api/cart/remove)
========================= */
export const removeItemValidator = [
  body("productVariantId")
    .exists()
    .withMessage("productVariantId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productVariantId"),
];
