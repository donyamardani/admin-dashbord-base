/**
 * @file ./Modules/Search/docs.js
 * @description Swagger JSDoc for Search module
 */

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Global search across Products, Categories, Brands (published only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchProductItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65a8f8f5f2c2a2b3c4d5e6f7"
 *         title:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/p1.webp", "uploads/p2.webp"]
 *
 *     SearchCategoryItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65a8f8f5f2c2a2b3c4d5e600"
 *         title:
 *           type: string
 *           example: "Mobile"
 *         image:
 *           type: string
 *           example: "uploads/cat.webp"
 *
 *     SearchBrandItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65a8f8f5f2c2a2b3c4d5e611"
 *         title:
 *           type: string
 *           example: "Apple"
 *         image:
 *           type: string
 *           example: "uploads/brand.webp"
 *
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SearchCategoryItem"
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SearchProductItem"
 *             brands:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SearchBrandItem"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "not found"
 *         statusCode:
 *           type: integer
 *           example: 404
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search published products, categories, brands
 *     description: |
 *       Searches in:
 *       - Products: title regex, isPublished=true, returns (title, images)
 *       - Categories: title regex, isPublished=true, returns (title, image)
 *       - Brands: title regex, isPublished=true, returns (title, image)
 *
 *       Each list is sorted by `-createdAt` and limited to 10.
 *       If all lists are empty => 404.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 80
 *         description: Search text
 *         example: "iphone"
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SearchResponse"
 *       400:
 *         description: Missing/invalid query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Nothing found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
