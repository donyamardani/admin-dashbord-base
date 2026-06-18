import { query } from "express-validator";

/* =========================
   QUERY (GET /api/search?q=...)
========================= */
export const searchValidator = [
  query("q")
    .exists()
    .withMessage("q is required")
    .bail()
    .isString()
    .withMessage("q must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("q cannot be empty")
    .bail()
    .isLength({ min: 1, max: 80 })
    .withMessage("q must be between 1 and 80 characters"),
];
