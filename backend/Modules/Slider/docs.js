/**
 * @file ./Modules/Slider/docs.js
 * @description Swagger JSDoc for Slider module (vanta-api ApiFeatures query support + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: Sliders
 *     description: Slider CRUD (public read, admin write)
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
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: "Winter Sale"
 *         image:
 *           type: string
 *           description: Slider image path stored in DB (relative to /Public or upload folder)
 *           example: "sliders/slider-1.jpg"
 *         href:
 *           type: string
 *           format: uri
 *           example: "https://example.com/landing"
 *         path:
 *           type: string
 *           description: Frontend route path
 *           example: "/products?tag=winter"
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
 *     CreateSliderInput:
 *       type: object
 *       required: [title, image, href, path]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: "Winter Sale"
 *         image:
 *           type: string
 *           example: "sliders/slider-1.jpg"
 *         href:
 *           type: string
 *           format: uri
 *           example: "https://example.com/landing"
 *         path:
 *           type: string
 *           example: "/products?tag=winter"
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateSliderInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: "Updated title"
 *         image:
 *           type: string
 *           example: "sliders/slider-2.jpg"
 *         href:
 *           type: string
 *           format: uri
 *           example: "https://example.com/new"
 *         path:
 *           type: string
 *           example: "/pricing"
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     SliderWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "slider created successfully"
 *         data:
 *           $ref: "#/components/schemas/Slider"
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
 *         - `title[regex]=sale`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/sliders (GET)
 * =========================
 * @swagger
 * /api/sliders:
 *   get:
 *     tags: [Sliders]
 *     summary: Get all sliders
 *     description: |
 *       Public endpoint (no admin required).
 *
 *       Controller behavior:
 *       - If role is admin/superAdmin => returns all sliders
 *       - Else => forces `isPublished=true`
 *
 *       Validator supports:
 *       - page, limit, search (string), sort (string), fields (string), isPublished (boolean)
 *
 *       Notes:
 *       - You have a `search` query validated, but current controller does not apply it manually.
 *         If ApiFeatures supports search you can use it; otherwise it will be ignored.
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
 *         example: "sale"
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by published status (public users will still only see published)
 *         example: true
 *     responses:
 *       200:
 *         description: Sliders fetched successfully (shape depends on vanta-api execute() result)
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
 *                     title: "Winter Sale"
 *                     image: "sliders/slider-1.jpg"
 *                     href: "https://example.com/landing"
 *                     path: "/products?tag=winter"
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
 * /api/sliders (POST)
 * =========================
 * @swagger
 * /api/sliders:
 *   post:
 *     tags: [Sliders]
 *     summary: Create slider (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin` middleware).
 *
 *       Validation:
 *       - title (2..150)
 *       - image (non-empty string)
 *       - href (valid URL)
 *       - path (non-empty string)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSliderInput"
 *     responses:
 *       201:
 *         description: Slider created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SliderWriteResponse"
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
 * /api/sliders/{id} (GET)
 * =========================
 * @swagger
 * /api/sliders/{id}:
 *   get:
 *     tags: [Sliders]
 *     summary: Get one slider
 *     description: |
 *       Public endpoint.
 *
 *       Controller behavior:
 *       - Admin/SuperAdmin => can fetch any slider by id
 *       - Public => only fetches if `isPublished=true`
 *
 *       Supports vanta-api query options: `fields`, `populate` (and others if enabled).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Slider id (MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Slider fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     title: "Winter Sale"
 *                     image: "sliders/slider-1.jpg"
 *                     href: "https://example.com/landing"
 *                     path: "/products?tag=winter"
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
 * /api/sliders/{id} (PATCH)
 * =========================
 * @swagger
 * /api/sliders/{id}:
 *   patch:
 *     tags: [Sliders]
 *     summary: Update slider (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *
 *       Validation:
 *       - title optional (2..150)
 *       - image optional (non-empty string)
 *       - href optional (valid URL)
 *       - path optional (non-empty string)
 *       - isPublished optional boolean
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Slider id (MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateSliderInput"
 *     responses:
 *       201:
 *         description: Slider updated
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
 *                   example: "slider updated successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Slider"
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
 * /api/sliders/{id} (DELETE)
 * =========================
 * @swagger
 * /api/sliders/{id}:
 *   delete:
 *     tags: [Sliders]
 *     summary: Delete slider (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin (`isAdmin`).
 *       Also deletes the file from `/Public/{slider.image}` if exists.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: Slider id (MongoId)
 *     responses:
 *       201:
 *         description: Slider deleted
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
 *                   example: "slider deleted successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Slider"
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
