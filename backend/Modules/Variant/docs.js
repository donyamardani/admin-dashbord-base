/**
 * @file ./Modules/Variant/docs.js
 * @description Swagger JSDoc for Variant module (vanta-api ApiFeatures query support + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: Variants
 *     description: Variant CRUD (size/color). Public read, admin write.
 */

/**
 * =========================
 * Schemas
 * =========================
 * @swagger
 * components:
 *   schemas:
 *     MongoId:
 *       type: string
 *       description: MongoDB ObjectId
 *       example: "65a8f8f5f2c2a2b3c4d5e6f7"
 *
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "size"
 *         value:
 *           type: string
 *           example: "XL"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T07:25:58.041Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T07:25:58.041Z"
 *
 *     CreateVariantInput:
 *       type: object
 *       required: [type, value]
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "color"
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Red"
 *
 *     UpdateVariantInput:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "size"
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "L"
 *
 *     VariantWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "variant created successfully"
 *         data:
 *           $ref: "#/components/schemas/Variant"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "this Variant contain some product you can not deleted"
 *         statusCode:
 *           type: integer
 *           example: 400
 */

/**
 * =========================
 * vanta-api ApiFeatures query params (common)
 * =========================
 * @swagger
 * components:
 *   parameters:
 *     PageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         minimum: 1
 *       required: false
 *       description: Page number (pagination)
 *       example: 1
 *     LimitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *       required: false
 *       description: Page size (pagination)
 *       example: 10
 *     SortParam:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *       required: false
 *       description: Sort by fields. Comma-separated. Prefix `-` for desc. Example `createdAt,-value`
 *       example: "createdAt,-value"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       description: Select returned fields. Comma-separated. Example `type,value`
 *       example: "type,value"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Populate referenced fields (none in Variant model by default)
 *       example: ""
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         Advanced filtering via query params (if supported by ApiFeatures).
 *         Examples:
 *         - `type=size`
 *         - `value[regex]=x`
 *         - `createdAt[gte]=2026-01-01T00:00:00.000Z`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/variants (GET)
 * =========================
 * @swagger
 * /api/variants:
 *   get:
 *     tags: [Variants]
 *     summary: Get all variants
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - manual `search` applies regex on `value`
 *       - supports vanta-api ApiFeatures: filter, sort, fields, paginate, populate
 *
 *       Useful filters:
 *       - `type=size|color`
 *       - `search` (regex on value)
 *     parameters:
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/LimitParam"
 *       - $ref: "#/components/parameters/SortParam"
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Regex search on `value` (manual filter)
 *         example: "re"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [size, color]
 *         required: false
 *         description: Filter by variant type
 *         example: "color"
 *     responses:
 *       200:
 *         description: Variants fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 results: 2
 *                 page: 1
 *                 limit: 10
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     type: "color"
 *                     value: "Red"
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f1"
 *                     type: "size"
 *                     value: "XL"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/variants (POST)
 * =========================
 * @swagger
 * /api/variants:
 *   post:
 *     tags: [Variants]
 *     summary: Create variant (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin` middleware).
 *
 *       Validation:
 *       - type required in [size,color]
 *       - value required string (1..100)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateVariantInput"
 *     responses:
 *       201:
 *         description: Variant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VariantWriteResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/variants/{id} (GET)
 * =========================
 * @swagger
 * /api/variants/{id}:
 *   get:
 *     tags: [Variants]
 *     summary: Get one variant
 *     description: |
 *       Public endpoint.
 *       Supports vanta-api query options like `fields`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Variant id (MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Variant fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     type: "size"
 *                     value: "XL"
 *       422:
 *         description: Validation error (invalid id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/variants/{id} (PATCH)
 * =========================
 * @swagger
 * /api/variants/{id}:
 *   patch:
 *     tags: [Variants]
 *     summary: Update variant (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Validation:
 *       - type optional in [size,color]
 *       - value optional string (1..100)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Variant id (MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateVariantInput"
 *     responses:
 *       201:
 *         description: Variant updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "variant updated successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Variant"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/variants/{id} (DELETE)
 * =========================
 * @swagger
 * /api/variants/{id}:
 *   delete:
 *     tags: [Variants]
 *     summary: Delete variant (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Extra controller rule:
 *       - If ProductVariant exists with `variantId=:id` => returns 400 and does NOT delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Variant id (MongoId)
 *     responses:
 *       201:
 *         description: Variant deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "variant deleted successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Variant"
 *       400:
 *         description: Variant is used by products (cannot delete)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Validation error (invalid id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
