import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const isMongoId = (v) => mongoose.Types.ObjectId.isValid(v);

/* =========================
   PARAMS
========================= */
export const commentIdParam = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .custom(isMongoId)
    .withMessage("Invalid id"),
];

/**
 * In your router:
 * - GET /:id is "getAllCommentsPost" where id = productId
 */
export const productIdParam = [
  param("id")
    .notEmpty()
    .withMessage("product id is required")
    .custom(isMongoId)
    .withMessage("Invalid product id"),
];

/* =========================
   QUERY (GET /api/comments) admin
   QUERY (GET /api/comments/:id) product comments
========================= */
export const getAllCommentValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive number"),
  query("limit").optional().isInt({ min: 1 }).withMessage("limit must be a positive number"),
  query("sort").optional().isString().withMessage("sort must be a string").bail().trim(),
  query("fields").optional().isString().withMessage("fields must be a string").bail().trim(),
  query("populate").optional().isString().withMessage("populate must be a string").bail().trim(),

  // helpful filters
  query("productId").optional().custom(isMongoId).withMessage("Invalid productId"),
  query("userId").optional().custom(isMongoId).withMessage("Invalid userId"),
  query("isPublished").optional().isBoolean().withMessage("isPublished must be boolean").toBoolean(),
  query("isReply").optional().isBoolean().withMessage("isReply must be boolean").toBoolean(),
];

/* =========================
   CREATE (POST /api/comments) login required
========================= */
export const createCommentValidator = [
  body("productId")
    .exists()
    .withMessage("productId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  body("content")
    .exists()
    .withMessage("content is required")
    .bail()
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .bail()
    .isLength({ min: 2, max: 1000 })
    .withMessage("content must be between 2 and 1000 characters"),

  body("rate")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("rate must be between 1 and 5"),
];

/* =========================
   REPLY (POST /api/comments/reply) admin
========================= */
export const replyCommentValidator = [
  body("replyTo")
    .exists()
    .withMessage("replyTo is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid replyTo"),

  // allow productId optional; but recommended to keep data consistent
  body("productId")
    .optional({ nullable: true })
    .custom((v) => v == null || isMongoId(v))
    .withMessage("Invalid productId"),

  body("content")
    .exists()
    .withMessage("content is required")
    .bail()
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .bail()
    .isLength({ min: 2, max: 1000 })
    .withMessage("content must be between 2 and 1000 characters"),
];

/* =========================
   CHANGE PUBLISH (PATCH /api/comments/:id) admin
========================= */
export const changePublishValidator = [...commentIdParam];

/* =========================
   REMOVE (DELETE /api/comments/:id) admin
========================= */
export const removeCommentValidator = [...commentIdParam];
