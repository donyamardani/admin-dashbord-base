/**
 * @file ./Modules/Address/docs.js
 * @description Swagger JSDoc for Address module (login required via app.use + vanta-api ApiFeatures queries)
 */

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: Address CRUD (Login required). Admin can view all; users are limited to their own addresses.
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
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         userId:
 *           description: User reference (id or populated object with phoneNumber/fullName)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         title:
 *           type: string
 *           example: "Home"
 *         description:
 *           type: string
 *           example: "Near the main square..."
 *         city:
 *           type: string
 *           example: "Tehran"
 *         province:
 *           type: string
 *           example: "Tehran"
 *         postalCode:
 *           type: string
 *           example: "12345-67890"
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         receiverFullName:
 *           type: string
 *           example: "Ali Ahmadi"
 *         NO:
 *           type: string
 *           description: Plaque/number
 *           example: "12"
 *         lat:
 *           type: string
 *           example: "35.6892"
 *         lng:
 *           type: string
 *           example: "51.3890"
 *         floor:
 *           type: string
 *           example: "3"
 *         units:
 *           type: string
 *           example: "12"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateAddressInput:
 *       type: object
 *       required: [title, description, city, province, postalCode, NO, lat, lng]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 120
 *           example: "Home"
 *         description:
 *           type: string
 *           minLength: 2
 *           maxLength: 500
 *           example: "Near the main square..."
 *         city:
 *           type: string
 *           example: "Tehran"
 *         province:
 *           type: string
 *           example: "Tehran"
 *         postalCode:
 *           type: string
 *           example: "12345-67890"
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         receiverFullName:
 *           type: string
 *           example: "Ali Ahmadi"
 *         NO:
 *           type: string
 *           example: "12"
 *         lat:
 *           type: string
 *           example: "35.6892"
 *         lng:
 *           type: string
 *           example: "51.3890"
 *         floor:
 *           type: string
 *           example: "3"
 *         units:
 *           type: string
 *           example: "12"
 *
 *     UpdateAddressInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         city:
 *           type: string
 *         province:
 *           type: string
 *         postalCode:
 *           type: string
 *         receiverPhoneNumber:
 *           type: string
 *         receiverFullName:
 *           type: string
 *         NO:
 *           type: string
 *         lat:
 *           type: string
 *         lng:
 *           type: string
 *         floor:
 *           type: string
 *         units:
 *           type: string
 *
 *     AddressWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "address created successfully"
 *         data:
 *           $ref: "#/components/schemas/Address"
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
 *       example: "createdAt,-title"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       example: "title,city,postalCode"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Controller already populates userId with phoneNumber/fullName
 *       example: "userId"
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         Advanced filtering via query params (if supported by ApiFeatures).
 *         Examples:
 *         - `city=Tehran`
 *         - `createdAt[gte]=2026-01-01T00:00:00.000Z`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * /api/addresses (GET)
 * =========================
 * @swagger
 * /api/addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: Get all addresses (Login required)
 *     description: |
 *       Requires JWT (your app uses `isLogin` middleware before router).
 *
 *       Controller behavior:
 *       - Admin/SuperAdmin => can see all addresses
 *       - User => limited to `userId=req.userId`
 *       - manual `search` applies regex on title
 *       - populates `userId` (select: phoneNumber fullName)
 *     security:
 *       - bearerAuth: []
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
 *         example: "home"
 *     responses:
 *       200:
 *         description: Addresses fetched (shape depends on vanta-api execute() result)
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
 *                     title: "Home"
 *                     city: "Tehran"
 *                     userId:
 *                       _id: "65a8f8f5f2c2a2b3c4d5e600"
 *                       phoneNumber: "09123456789"
 *                       fullName: "Ali Ahmadi"
 */

/**
 * =========================
 * /api/addresses (POST)
 * =========================
 * @swagger
 * /api/addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Create address (Login required)
 *     description: |
 *       Requires JWT.
 *       Server always sets `userId` from token (ignores/overrides client userId).
 *       Also pushes addressId into user.addressIds.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateAddressInput"
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AddressWriteResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/addresses/{id} (GET)
 * =========================
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     tags: [Addresses]
 *     summary: Get one address (Login required)
 *     description: |
 *       Requires JWT.
 *       - Admin/SuperAdmin => can fetch any address
 *       - User => only own address
 *       Populates userId (phoneNumber fullName).
 *     security:
 *       - bearerAuth: []
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
 *         description: Address fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/addresses/{id} (PATCH)
 * =========================
 * @swagger
 * /api/addresses/{id}:
 *   patch:
 *     tags: [Addresses]
 *     summary: Update address (Login required)
 *     description: |
 *       Requires JWT.
 *       Only owner can update unless admin/superAdmin.
 *       Server ignores `userId` if provided.
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
 *             $ref: "#/components/schemas/UpdateAddressInput"
 *     responses:
 *       201:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AddressWriteResponse"
 *       401:
 *         description: No permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/addresses/{id} (DELETE)
 * =========================
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete address (Login required)
 *     description: |
 *       Requires JWT.
 *       Only owner can delete unless admin/superAdmin.
 *       Also pulls addressId from user.addressIds.
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
 *         description: Address deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AddressWriteResponse"
 *       401:
 *         description: No permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
