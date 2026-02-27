
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management (Admin list, logged-in user read/update, password change)
 */

/**
 * =============== Common Schemas ===============
 * @swagger
 * components:
 *   schemas:
 *     MongoId:
 *       type: string
 *       description: MongoDB ObjectId
 *       example: "65a8f8f5f2c2a2b3c4d5e6f7"
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         phoneNumber:
 *           type: string
 *           description: Iranian phone number
 *           pattern: "^(?:\\+98|0)?9\\d{9}$"
 *           example: "09123456789"
 *         password:
 *           type: string
 *           description: Hashed password (usually not returned in list endpoints)
 *           example: ""
 *         fullName:
 *           type: string
 *           maxLength: 100
 *           example: "Ali Ahmadi"
 *         cartId:
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: "null"
 *           example: null
 *         addressIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *           default: []
 *         favoriteProductIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *           default: []
 *         BoughtProductIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *           default: []
 *         ratedProductIds:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MongoId"
 *           default: []
 *         role:
 *           type: string
 *           enum: [admin, user, superAdmin]
 *           default: user
 *           example: "user"
 *         isActive:
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
 *     UpdateUserInput:
 *       type: object
 *       description: Allowed fields depend on role (see endpoint notes)
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: "^(?:\\+98|0)?9\\d{9}$"
 *           example: "09123456789"
 *         fullName:
 *           type: string
 *           maxLength: 100
 *           example: "Ali Ahmadi"
 *         isActive:
 *           type: boolean
 *           example: true
 *         role:
 *           type: string
 *           enum: [admin, user, superAdmin]
 *           example: "admin"
 *
 *     ChangePasswordInput:
 *       type: object
 *       required: [newPassword]
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: Required only if user already has a password set (in your controller logic)
 *           example: "OldPass@123"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: "NewPass@123"
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
 *
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "password set successfully"
 *
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "user Updated successfully"
 *         data:
 *           $ref: "#/components/schemas/User"
 */

/**
 * =============== vanta-api ApiFeatures Query Parameters ===============
 * We can’t perfectly guarantee vanta-api syntax without its README,
 * so we document the "standard" style used by ApiFeatures patterns:
 * filter/sort/fields/page/limit/populate + advanced operators via bracket notation.
 *
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
 *       description: Sort by fields. Use comma-separated list. Prefix with `-` for desc. Example `createdAt,-fullName`
 *       example: "createdAt,-fullName"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       description: Select/limit returned fields. Comma-separated. Example `phoneNumber,fullName,role`
 *       example: "phoneNumber,fullName,role"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Populate referenced fields. Comma-separated. Example `cartId,addressIds`
 *       example: "cartId,addressIds"
 *
 *     AdvancedFilterParam:
 *       in: query
 *       name: _filters
 *       schema:
 *         type: string
 *       required: false
 *       description: |
 *         **Advanced filtering (bracket operators) supported by many ApiFeatures implementations.**
 *         Use real query params, not `_filters`. Examples:
 *         - `role=admin`
 *         - `isActive=true`
 *         - `createdAt[gte]=2026-01-01T00:00:00.000Z`
 *         - `createdAt[lte]=2026-01-31T23:59:59.999Z`
 *         - `phoneNumber[regex]=0912`
 *         - `role[in]=admin,user`
 *         Operators commonly used: `gte,gt,lte,lt,ne,eq,in,nin,regex`
 *       example: "Use real query params; see description."
 */

/**
 * =============== /api/users (GET) ===============
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin/SuperAdmin only)
 *     description: |
 *       Requires **admin** or **superAdmin** (your `isAdmin` middleware).
 *
 *       Supports:
 *       - `search` (manual regex on `phoneNumber` from your controller)
 *       - vanta-api `ApiFeatures`: `filter`, `sort`, `fields`, `page`, `limit`, `populate`
 *       - advanced bracket filters (if enabled by ApiFeatures)
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
 *         description: Regex search on phoneNumber (manual filter in controller)
 *         example: "0912"
 *     responses:
 *       200:
 *         description: Users fetched successfully (shape depends on vanta-api execute() result)
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
 *                     phoneNumber: "09123456789"
 *                     fullName: "Ali Ahmadi"
 *                     role: "user"
 *                     isActive: true
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =============== /api/users/{id} (GET) ===============
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get one user
 *     description: |
 *       Requires login (`isLogin`).
 *
 *       Behavior from your controller:
 *       - If `req.role === "user"` it forces `_id = req.userId` (ignores path id effectively)
 *       - Otherwise (admin/superAdmin) it uses `:id`
 *
 *       Supports vanta-api query options: `fields`, `populate` (and others if enabled).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: User id (must be MongoId)
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: User fetched successfully (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Result object returned by vanta-api ApiFeatures.execute()
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "65a8f8f5f2c2a2b3c4d5e6f7"
 *                     phoneNumber: "09123456789"
 *                     fullName: "Ali Ahmadi"
 *                     role: "user"
 *                     isActive: true
 *       401:
 *         description: Unauthorized (no token / invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Validation error (invalid MongoId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =============== /api/users/{id} (PATCH) ===============
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user
 *     description: |
 *       Requires login (`isLogin`).
 *
 *       Important rules from your controller:
 *       - If role is `user`: can only update **their own** account (id must equal req.userId) and only `fullName` is applied.
 *       - If role is `admin`: cannot update other `admin/superAdmin` accounts.
 *       - If role is `superAdmin`: can update `role`, `isActive`, and others.
 *
 *       Validator rules:
 *       - phoneNumber must match Iran regex
 *       - fullName string max 100
 *       - isActive boolean
 *       - role in [admin,user,superAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: User id (must be MongoId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserInput"
 *           examples:
 *             user_update_self:
 *               summary: Normal user updates own name
 *               value:
 *                 fullName: "Ali Ahmadi"
 *             superadmin_update_role:
 *               summary: SuperAdmin updates role/isActive
 *               value:
 *                 role: "admin"
 *                 isActive: true
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateUserResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (your controller permission checks)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       422:
 *         description: Validation error (MongoId / body validation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =============== /api/users/change-password (PATCH) ===============
 * @swagger
 * /api/users/change-password:
 *   patch:
 *     tags: [Users]
 *     summary: Change password (set first password or change existing)
 *     description: |
 *       Requires login (`isLogin`).
 *
 *       Validator:
 *       - `newPassword` required, min 8
 *       - `oldPassword` optional string (but controller requires it if user already has password)
 *
 *       Controller behavior:
 *       - If user has no password yet: sets it using newPassword
 *       - Else: requires oldPassword + newPassword and checks oldPassword
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordInput"
 *           examples:
 *             first_time_set:
 *               summary: First time password set (no oldPassword needed)
 *               value:
 *                 newPassword: "NewPass@123"
 *             change_existing:
 *               summary: Change existing password
 *               value:
 *                 oldPassword: "OldPass@123"
 *                 newPassword: "NewPass@123"
 *     responses:
 *       200:
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessMessage"
 *       400:
 *         description: Bad request (missing oldPassword when required / incorrect old password)
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
 *       404:
 *         description: User not found
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
