/**
 * @file ./Modules/Product/docs.js
 * @description Swagger JSDoc for Product module (vanta-api ApiFeatures query support + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product CRUD (public read, admin write) + favorite toggle (login required)
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
 *     ProductInformationItem:
 *       type: object
 *       required: [key, value]
 *       properties:
 *         key:
 *           type: string
 *           example: "Material"
 *         value:
 *           type: string
 *           example: "Cotton"
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         brandId:
 *           description: Brand reference (id or populated object)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         categoryId:
 *           description: Category reference (id or populated object)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         defaultProductVariantId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *           example: null
 *         productVariantIds:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: "#/components/schemas/MongoId"
 *               - type: object
 *                 additionalProperties: true
 *           default: []
 *         ratingCount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         avgRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 0
 *         title:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         description:
 *           type: string
 *           example: "A powerful phone with ..."
 *         information:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ProductInformationItem"
 *           default: []
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *           example: ["products/p1.jpg", "products/p2.jpg"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *           example: ["phone", "apple"]
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
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
 *     CreateProductInput:
 *       type: object
 *       required: [brandId, categoryId, title, description]
 *       properties:
 *         brandId:
 *           $ref: "#/components/schemas/MongoId"
 *         categoryId:
 *           $ref: "#/components/schemas/MongoId"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           example: "iPhone 15 Pro"
 *         description:
 *           type: string
 *           example: "A powerful phone with ..."
 *         information:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ProductInformationItem"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         defaultProductVariantId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *           example: null
 *         productVariantIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         brandId:
 *           $ref: "#/components/schemas/MongoId"
 *         categoryId:
 *           $ref: "#/components/schemas/MongoId"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *         description:
 *           type: string
 *         information:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ProductInformationItem"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         defaultProductVariantId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *         productVariantIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *         isPublished:
 *           type: boolean
 *         boughtCount:
 *           type: number
 *           minimum: 0
 *
 *     ProductWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "product created successfully"
 *         data:
 *           $ref: "#/components/schemas/Product"
 *
 *     FavoriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "add to favorite list"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "you can not delete this product.. please change is publish"
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
 *       description: Sort by fields. Comma-separated. Prefix `-` for desc. Example `createdAt,-title`
 *       example: "createdAt,-title"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       description: Select returned fields. Comma-separated. Example `title,avgRating,images`
 *       example: "title,avgRating,images"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Populate references (Brand, Category, ProductVariant, etc.) depending on your ApiFeatures implementation.
 *       example: "brandId,categoryId,defaultProductVariantId"
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         Advanced filtering via query params (if supported by ApiFeatures).
 *         Examples:
 *         - `brandId=...`
 *         - `categoryId=...`
 *         - `avgRating[gte]=4`
 *         - `title[regex]=iphone`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/products (GET)
 * =========================
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - manual `search` applies regex on title
 *       - if not admin/superAdmin => forces `isPublished=true`
 *       - supports vanta-api ApiFeatures: filter, sort, fields, paginate, populate
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
 *         description: Regex search on `title` (manual filter)
 *         example: "iphone"
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by published status (public users will still only see published)
 *         example: true
 *       - in: query
 *         name: brandId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         required: false
 *         description: Filter by brand
 *       - in: query
 *         name: categoryId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         required: false
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Products fetched successfully (shape depends on vanta-api execute() result)
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
 *                     title: "iPhone 15 Pro"
 *                     isPublished: true
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/products (POST)
 * =========================
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create product (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin` middleware).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateProductInput"
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductWriteResponse"
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
 * /api/products/{id} (GET)
 * =========================
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get one product
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - Admin/SuperAdmin => can fetch any product
 *       - Public => only fetches if `isPublished=true`
 *       - If request has a valid JWT (your exportValidationData sets req.userId),
 *         response includes: `isFavorite`, `isBought`, `isRated`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Product id (MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Product fetched successfully (includes flags if logged in)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Product"
 *                 isFavorite:
 *                   type: boolean
 *                 isBought:
 *                   type: boolean
 *                 isRated:
 *                   type: boolean
 *             example:
 *               success: true
 *               data:
 *                 - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                   title: "iPhone 15 Pro"
 *                   isPublished: true
 *               isFavorite: false
 *               isBought: false
 *               isRated: false
 *       422:
 *         description: Validation error (invalid id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/products/{id} (PATCH)
 * =========================
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Update product (Admin/SuperAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Product id (MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateProductInput"
 *     responses:
 *       201:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/Product"
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
 * /api/products/{id} (DELETE)
 * =========================
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Controller rule:
 *       - If `boughtCount > 0` => 400 (cannot delete, suggest unpublish instead)
 *       - Deletes product images from `/Public/{img}`
 *       - Deletes related ProductVariant & Comment docs by productId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Product id (MongoId)
 *     responses:
 *       201:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/Product"
 *       400:
 *         description: Cannot delete bought product
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

/**
 * =========================
 * /api/products/fav/{id} (POST)
 * =========================
 * @swagger
 * /api/products/fav/{id}:
 *   post:
 *     tags: [Products]
 *     summary: Toggle favorite product (Login required)
 *     description: |
 *       Requires login (`isLogin`).
 *       Toggles productId in user's `favoriteProductIds`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Product id (MongoId)
 *     responses:
 *       200:
 *         description: Favorite toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FavoriteResponse"
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
