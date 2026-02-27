
/**
 * @swagger
 * tags:
 *   - name: Brands
 *     description: Brand CRUD (public read, admin write)
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
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Brand title (unique)
 *           example: "Samsung"
 *         image:
 *           type: string
 *           description: Image path stored in DB (relative to /Public or upload folder)
 *           example: "brands/samsung.png"
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
 *     CreateBrandInput:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Samsung"
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: "brands/samsung.png"
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateBrandInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Samsung (Updated)"
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: "brands/samsung-new.png"
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     BrandWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "brand created successfully"
 *         data:
 *           $ref: "#/components/schemas/Brand"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "you don't have a permission"
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
 *       description: Populate referenced fields (if any). Comma-separated.
 *       example: ""
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         Advanced filtering via query params (if supported by your ApiFeatures).
 *         Use real params like:
 *         - `isPublished=true`
 *         - `createdAt[gte]=2026-01-01T00:00:00.000Z`
 *         - `title[regex]=sam`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/brands (GET)
 * =========================
 * @swagger
 * /api/brands:
 *   get:
 *     tags: [Brands]
 *     summary: Get all brands
 *     description: |
 *       Public endpoint (no admin required).
 *
 *       Controller behavior:
 *       - If role is admin/superAdmin => returns all brands
 *       - Else => forces `isPublished=true`
 *
 *       Validator supports:
 *       - page, limit, search (string), sort (string), fields (string), isPublished (boolean)
 *
 *       Note:
 *       - `search` is validated but your controller does not apply it manually.
 *         If ApiFeatures doesn't implement search, it will be ignored.
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
 *         description: Search string (validated). Effect depends on ApiFeatures implementation.
 *         example: "sam"
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by published status (public users will still only see published)
 *         example: true
 *     responses:
 *       200:
 *         description: Brands fetched successfully (shape depends on vanta-api execute() result)
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
 *                     title: "Samsung"
 *                     image: "brands/samsung.png"
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
 * /api/brands (POST)
 * =========================
 * @swagger
 * /api/brands:
 *   post:
 *     tags: [Brands]
 *     summary: Create brand (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin` middleware).
 *
 *       Validation:
 *       - title required (2..100)
 *       - image optional (string max 500)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBrandInput"
 *     responses:
 *       201:
 *         description: Brand created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BrandWriteResponse"
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
 * /api/brands/{id} (GET)
 * =========================
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Get one brand
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - Admin/SuperAdmin => can fetch any brand by id
 *       - Public => only fetches if `isPublished=true`
 *
 *       Supports vanta-api query options: `fields`, `populate` (and others if enabled).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Brand id (MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Brand fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     title: "Samsung"
 *                     image: "brands/samsung.png"
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
 * /api/brands/{id} (PATCH)
 * =========================
 * @swagger
 * /api/brands/{id}:
 *   patch:
 *     tags: [Brands]
 *     summary: Update brand (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Validation:
 *       - title optional (2..100)
 *       - image optional (string)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Brand id (MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateBrandInput"
 *     responses:
 *       201:
 *         description: Brand updated
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
 *                   example: "brand updated successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Brand"
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
 * /api/brands/{id} (DELETE)
 * =========================
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     tags: [Brands]
 *     summary: Delete brand (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Extra controller rule:
 *       - If any Product exists with `brandId=:id` => returns 400 and does NOT delete
 *       - If brand has an image file at `/Public/{brand.image}` => it will be removed from disk
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Brand id (MongoId)
 *     responses:
 *       201:
 *         description: Brand deleted
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
 *                   example: "brand deleted successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Brand"
 *       400:
 *         description: Brand contains products (cannot delete)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "this Brand contain some product you can not deleted"
 *               statusCode: 400
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
