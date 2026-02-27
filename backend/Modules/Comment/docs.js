/**
 * @file ./Modules/Comment/docs.js
 * @description Swagger JSDoc for Comment module (vanta-api ApiFeatures queries + validations)
 */

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comments and replies. Create requires login. Admin can list all, publish/unpublish, reply, delete.
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
 *       example: "65a8f8f5f2c2a2b3c4d5e6f7"
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         productId:
 *           description: Product reference (id or populated)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         content:
 *           type: string
 *           example: "Amazing quality!"
 *         userId:
 *           description: User reference (id or populated with fullName/phoneNumber/role)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         replyTo:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *           example: null
 *         isReply:
 *           type: boolean
 *           example: false
 *         rate:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         isBought:
 *           type: boolean
 *           example: true
 *         isPublished:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCommentInput:
 *       type: object
 *       required: [productId, content]
 *       properties:
 *         productId:
 *           $ref: "#/components/schemas/MongoId"
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 1000
 *           example: "Amazing quality!"
 *         rate:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Only counted if user bought the product (server checks)
 *           example: 5
 *
 *     ReplyCommentInput:
 *       type: object
 *       required: [replyTo, content]
 *       properties:
 *         replyTo:
 *           $ref: "#/components/schemas/MongoId"
 *         productId:
 *           oneOf:
 *             - type: "null"
 *             - $ref: "#/components/schemas/MongoId"
 *           example: null
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 1000
 *           example: "Thanks for your feedback 🙏"
 *
 *     CommentWriteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "comment created successfully"
 *         data:
 *           $ref: "#/components/schemas/Comment"
 *
 *     SimpleSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "comment removed successfully"
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
 *       example: "createdAt,-isPublished"
 *     FieldsParam:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       required: false
 *       example: "content,isPublished,rate,userId,productId"
 *     PopulateParam:
 *       in: query
 *       name: populate
 *       schema:
 *         type: string
 *       required: false
 *       description: Controller already populates userId and productId in list endpoints.
 *       example: "userId,productId"
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
 *         - `productId=...`
 *         - `userId=...`
 *       example: "Use real query params; see description."
 */

/**
 * =========================
 * GET /api/comments (Admin)
 * =========================
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin.
 *       Uses vanta-api ApiFeatures: filter, sort, fields, paginate, populate.
 *       Populates userId (fullName phoneNumber role) and productId (title).
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
 *         name: productId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *       - in: query
 *         name: userId
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isReply
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Comments fetched (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * =========================
 * POST /api/comments (Login)
 * =========================
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create comment (Login required)
 *     description: |
 *       Requires login.
 *       Server sets:
 *       - userId from token
 *       - isReply=false
 *       - isPublished=false
 *       - isBought calculated from user.boughtProductIds
 *
 *       Rating behavior:
 *       - If `rate` is provided AND user bought the product => updates product avgRating & ratingCount.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCommentInput"
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentWriteResponse"
 *       401:
 *         description: Unauthorized
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
 * POST /api/comments/reply (Admin)
 * =========================
 * @swagger
 * /api/comments/reply:
 *   post:
 *     tags: [Comments]
 *     summary: Reply to a comment (Admin/SuperAdmin)
 *     description: |
 *       Requires admin/superAdmin.
 *       Server sets:
 *       - userId from token
 *       - isReply=true
 *       - isPublished=true
 *       - isBought=false
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReplyCommentInput"
 *     responses:
 *       201:
 *         description: Reply created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentWriteResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * GET /api/comments/{id}  (Product comments by productId)
 * =========================
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a product (id = productId)
 *     description: |
 *       Here `{id}` is productId.
 *       - Admin/SuperAdmin: returns all comments for that product
 *       - Public: returns only published comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: productId
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/LimitParam"
 *       - $ref: "#/components/parameters/SortParam"
 *       - $ref: "#/components/parameters/FieldsParam"
 *       - $ref: "#/components/parameters/PopulateParam"
 *       - $ref: "#/components/parameters/AdvancedFilterParam"
 *     responses:
 *       200:
 *         description: Comments fetched (shape depends on vanta-api execute() result)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * =========================
 * PATCH /api/comments/{id} (Admin)  id = commentId
 * =========================
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Toggle publish/unpublish comment (Admin/SuperAdmin)
 *     description: |
 *       Here `{id}` is commentId.
 *       Toggles `isPublished`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: commentId
 *     responses:
 *       201:
 *         description: Comment updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentWriteResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * DELETE /api/comments/{id} (Admin) id = commentId
 * =========================
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Remove comment (Admin/SuperAdmin)
 *     description: |
 *       Here `{id}` is commentId.
 *       Also deletes replies: `Comment.deleteMany({ replyTo: id })`
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/MongoId"
 *         description: commentId
 *     responses:
 *       201:
 *         description: Comment removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SimpleSuccessResponse"
 *       401:
 *         description: Unauthorized / no permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
