/**
 * @file ./Modules/Cart/docs.js
 * @description Swagger JSDoc for Cart module (login required via app.use + vanta-api query style)
 */

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: User cart (Login required). Get cart, add item, remove item.
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
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           description: Product reference (id or populated)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         productVariantId:
 *           description: ProductVariant reference (id or populated)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         categoryId:
 *           description: Category reference (id or populated)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         brandId:
 *           description: Brand reference (id or populated)
 *           oneOf:
 *             - $ref: "#/components/schemas/MongoId"
 *             - type: object
 *               additionalProperties: true
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: "#/components/schemas/MongoId"
 *         userId:
 *           $ref: "#/components/schemas/MongoId"
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CartItem"
 *         totalPrice:
 *           type: number
 *           example: 199.99
 *         totalPriceAfterDiscount:
 *           type: number
 *           example: 179.99
 *
 *     AddCartItemInput:
 *       type: object
 *       required: [productId, productVariantId]
 *       properties:
 *         productId:
 *           $ref: "#/components/schemas/MongoId"
 *         productVariantId:
 *           $ref: "#/components/schemas/MongoId"
 *
 *     RemoveCartItemInput:
 *       type: object
 *       required: [productVariantId]
 *       properties:
 *         productVariantId:
 *           $ref: "#/components/schemas/MongoId"
 *
 *     GetCartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: "#/components/schemas/Cart"
 *
 *     CartMutationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "add to cart successfully"
 *         data:
 *           $ref: "#/components/schemas/Cart"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "you can not add this item.not enough quantity"
 *         statusCode:
 *           type: integer
 *           example: 400
 */

/**
 * =========================
 * /api/cart (GET)
 * =========================
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart (Login required)
 *     description: |
 *       Requires JWT (router is mounted with isLogin).
 *
 *       Server behavior:
 *       - loads cart by userId=req.userId
 *       - populates items (product, variant, category, brand) in controller
 *       - auto-fixes quantities if variant stock is lower, and re-calculates totals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         required: false
 *         description: Select fields (ApiFeatures.limitFields)
 *         example: "items,totalPrice,totalPriceAfterDiscount"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         required: false
 *         description: Populate query (controller already populates items deeply)
 *         example: "items"
 *     responses:
 *       200:
 *         description: Cart returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetCartResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/cart/add (POST)
 * =========================
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart (or increase quantity by 1)
 *     description: |
 *       Requires JWT.
 *       - If variant quantity is 0 => error
 *       - If item exists => quantity++
 *       - If quantity exceeds stock => error
 *       - Recalculates totals (adds price and priceAfterDiscount)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddCartItemInput"
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CartMutationResponse"
 *       400:
 *         description: Not enough quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
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
 * /api/cart/remove (POST)
 * =========================
 * @swagger
 * /api/cart/remove:
 *   post:
 *     tags: [Cart]
 *     summary: Decrease quantity of an item by 1 (remove row if becomes 0)
 *     description: |
 *       Requires JWT.
 *       - Decreases quantity of the cart item that matches productVariantId
 *       - If quantity becomes 0 => removes it from cart
 *       - Decreases totals by variant price and priceAfterDiscount
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RemoveCartItemInput"
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CartMutationResponse"
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
