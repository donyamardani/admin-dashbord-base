/**
 * @file ./Modules/Category/docs.js
 * @description Swagger JSDoc for Category module (vanta-api ApiFeatures query support + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category CRUD (public read, admin write). Supports vanta-api ApiFeatures + manual search + populate supCategoryId
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
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Category title (unique)
 *           example: "Mobile"
 *         supCategoryId:
 *           description: Parent category (self reference). Can be null or populated object.
 *           oneOf:
 *             - type: "null"
 *               example: null
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         image:
 *           type: string
 *           example: "categories/mobile.png"
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T07:25:58.041Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T07:25:58.041Z"
 *
 *     CreateCategoryInput:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Mobile"
 *         supCategoryId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *           example: null
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: "categories/mobile.png"
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateCategoryInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Mobile (Updated)"
 *         supCategoryId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *           example: "65a8f8f5f2c2a2b3c4d5e6f1"
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: "categories/mobile-new.png"
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     CategoryWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "category created successfully"
 *         data:
 *           $ref: "#/components/schemas/Category"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "this Category contain some product you can not deleted or have sub Categories"
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
 *       description: Select returned fields. Comma-separated. Example `title,image,isPublished`
 *       example: "title,image,isPublished"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Populate referenced fields. Your controller already populates `supCategoryId`.
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
 *         - `isPublished=true`
 *         - `createdAt[gte]=2026-01-01T00:00:00.000Z`
 *         - `title[regex]=mob`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/categories (GET)
 * =========================
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - manual `search` applies regex on title
 *       - if not admin/superAdmin => forces `isPublished=true`
 *       - always populates `supCategoryId`
 *
 *       Supports vanta-api ApiFeatures:
 *       - filter, sort, fields, paginate, populate
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
 *         example: "mob"
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by published status (public users will still only see published)
 *         example: true
 *     responses:
 *       200:
 *         description: Categories fetched successfully (shape depends on vanta-api execute() result)
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
 *                     title: "Mobile"
 *                     supCategoryId: null
 *                     image: "categories/mobile.png"
 *                     isPublished: true
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f1"
 *                     title: "Android"
 *                     supCategoryId:
 *                       _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                       title: "Mobile"
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
 * /api/categories (POST)
 * =========================
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create category (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin` middleware).
 *
 *       Validation:
 *       - title required (2..100)
 *       - supCategoryId optional MongoId or null
 *       - image optional string (max 500)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCategoryInput"
 *           examples:
 *             root_category:
 *               summary: Root category
 *               value:
 *                 title: "Mobile"
 *                 image: "categories/mobile.png"
 *                 isPublished: true
 *                 supCategoryId: null
 *             sub_category:
 *               summary: Sub category
 *               value:
 *                 title: "Android"
 *                 supCategoryId: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                 isPublished: true
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CategoryWriteResponse"
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
 * /api/categories/{id} (GET)
 * =========================
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get one category
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - Admin/SuperAdmin => can fetch any category
 *       - Public => only fetches if `isPublished=true`
 *       - always populates `supCategoryId`
 *
 *       Supports vanta-api query options like `fields` (and others if enabled).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Category id (MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Category fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     title: "Mobile"
 *                     supCategoryId: null
 *                     isPublished: true
 *       422:
 *         description: Validation error (invalid id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/categories/{id} (PATCH)
 * =========================
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Update category (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Validation:
 *       - title optional (2..100)
 *       - supCategoryId optional MongoId or null
 *       - image optional string (max 500)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Category id (MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateCategoryInput"
 *     responses:
 *       201:
 *         description: Category updated
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
 *                   example: "category updated successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Category"
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
 * /api/categories/{id} (DELETE)
 * =========================
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Extra controller rule:
 *       - If Product exists (your code checks Product.find({ brandId: id }) - probably should be `categoryId`)
 *         OR category has subcategories (`supCategoryId = id`)
 *         => returns 400 and does NOT delete.
 *       - If category has an image file at `/Public/{category.image}` => it will be removed from disk.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Category id (MongoId)
 *     responses:
 *       201:
 *         description: Category deleted
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
 *                   example: "category deleted successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Category"
 *       400:
 *         description: Category contains products or has subcategories (cannot delete)
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
