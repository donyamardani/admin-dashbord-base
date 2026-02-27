/**
 * @file ./Modules/ProductVariant/docs.js
 * @description Swagger JSDoc for ProductVariant module (vanta-api ApiFeatures query support + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: ProductVariants
 *     description: Product Variant CRUD (Admin write). Public read with permission check on unpublished product.
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
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         variantId:
 *           description: Variant reference (id or populated object)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         productId:
 *           description: Product reference (id or populated object)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 10
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 199.99
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 10
 *         priceAfterDiscount:
 *           type: number
 *           minimum: 0
 *           description: Computed as price * (1 - discountPercent/100)
 *           example: 179.99
 *         boughtCount:
 *           type: number
 *           default: 0
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductVariantInput:
 *       type: object
 *       required: [variantId, productId, quantity, price]
 *       properties:
 *         variantId:
 *           $ref: "#/components/schemas/MongoId"
 *         productId:
 *           $ref: "#/components/schemas/MongoId"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 199.99
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 10
 *         priceAfterDiscount:
 *           type: number
 *           minimum: 0
 *           description: Optional; schema validates <= price (but hooks usually compute it)
 *           example: 179.99
 *
 *     UpdateProductVariantInput:
 *       type: object
 *       properties:
 *         variantId:
 *           $ref: "#/components/schemas/MongoId"
 *         productId:
 *           $ref: "#/components/schemas/MongoId"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *         price:
 *           type: number
 *           minimum: 0
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         priceAfterDiscount:
 *           type: number
 *           minimum: 0
 *         boughtCount:
 *           type: integer
 *           minimum: 0
 *
 *     ProductVariantWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "ProductVariant created successfully"
 *         data:
 *           $ref: "#/components/schemas/ProductVariant"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "you don't have permission"
 *         statusCode:
 *           type: integer
 *           example: 401
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
 *       example: 1
 *     LimitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *       required: false
 *       example: 10
 *     SortParam:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *       required: false
 *       description: Sort by fields. Comma-separated. Prefix `-` for desc.
 *       example: "createdAt,-price"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       description: Select returned fields. Comma-separated.
 *       example: "variantId,productId,price,quantity"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Populate referenced fields (depends on ApiFeatures). getOne also populates variantId.
 *       example: "variantId,productId"
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         Advanced filtering via query params (if supported by ApiFeatures).
 *         Examples:
 *         - `productId=...`
 *         - `variantId=...`
 *         - `price[gte]=100`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/product-variants (GET)
 * =========================
 * @swagger
 * /api/product-variant:
 *   get:
 *     tags: [ProductVariants]
 *     summary: Get all product variants
 *     description: |
 *       Public endpoint.
 *       Supports vanta-api ApiFeatures: filter, sort, fields, paginate, populate.
 *     parameters:
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/LimitParam"
 *       - $ref: "#/components/parameters/SortParam"
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *       - in: query
 *         name: productId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         required: false
 *       - in: query
 *         name: variantId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         required: false
 *     responses:
 *       200:
 *         description: ProductVariants fetched (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 results: 1
 *                 page: 1
 *                 limit: 10
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     variantId: "65a8f8f5f2c2a2b3c4d5e600"
 *                     productId: "65a8f8f5f2c2a2b3c4d5e611"
 *                     price: 199.99
 *                     discountPercent: 10
 *                     priceAfterDiscount: 179.99
 *                     quantity: 10
 */

/**
 * =========================
 * /api/product-variants (POST)
 * =========================
 * @swagger
 * /api/product-variant:
 *   post:
 *     tags: [ProductVariants]
 *     summary: Create product variant (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *       Also updates Product:
 *       - sets defaultProductVariantId if not set
 *       - pushes new variant id into productVariantIds
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateProductVariantInput"
 *     responses:
 *       201:
 *         description: ProductVariant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductVariantWriteResponse"
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
 * /api/product-variant/{id} (GET)
 * =========================
 * @swagger
 * /api/product-variants/{id}:
 *   get:
 *     tags: [ProductVariants]
 *     summary: Get one product variant
 *     description: |
 *       Public endpoint, BUT with permission check:
 *       - Controller loads product by productId
 *       - If product.isPublished=false and role is not admin/superAdmin => 401
 *
 *       Controller also populates `variantId`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: ProductVariant fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     variantId:
 *                       _id: "65a8f8f5f2c2a2b3c4d5e600"
 *                       type: "size"
 *                       value: "XL"
 *                     productId: "65a8f8f5f2c2a2b3c4d5e611"
 *                     price: 199.99
 *                     discountPercent: 10
 *                     priceAfterDiscount: 179.99
 *                     quantity: 10
 *       401:
 *         description: No permission to view variant of unpublished product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/product-variant/{id} (PATCH)
 * =========================
 * @swagger
 * /api/product-variants/{id}:
 *   patch:
 *     tags: [ProductVariants]
 *     summary: Update product variant (Admin/SuperAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateProductVariantInput"
 *     responses:
 *       201:
 *         description: ProductVariant updated
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
 *                   example: "productVariant updated successfully"
 *                 data:
 *                   $ref: "#/components/schemas/ProductVariant"
 */

/**
 * =========================
 * /api/product-variants/{id} (DELETE)
 * =========================
 * @swagger
 * /api/product-variant/{id}:
 *   delete:
 *     tags: [ProductVariants]
 *     summary: Delete product variant (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Controller rule:
 *       - If boughtCount > 0 => 400 (cannot delete)
 *       - Removes id from product.productVariantIds
 *       - If deleted id was defaultProductVariantId:
 *         sets default to last variant id or null
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *     responses:
 *       201:
 *         description: ProductVariant deleted
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
 *                   example: "productVariant deleted successfully"
 *                 data:
 *                   $ref: "#/components/schemas/ProductVariant"
 *       400:
 *         description: Cannot delete bought variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
