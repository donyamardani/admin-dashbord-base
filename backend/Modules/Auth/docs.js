
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints (OTP / Password)
 */

/**
 * =========================
 * Schemas
 * =========================
 * @swagger
 * components:
 *   schemas:
 *     AuthInitRequest:
 *       type: object
 *       required: [phoneNumber]
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Iranian phone number (validator requires 09xxxxxxxxx)
 *           pattern: "^09\\d{9}$"
 *           example: "09123456789"
 *
 *     AuthInitResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Otp Code sent"
 *         data:
 *           type: object
 *           properties:
 *             userExist:
 *               type: boolean
 *               example: false
 *             passwordExist:
 *               type: boolean
 *               example: false
 *
 *     LoginWithPasswordRequest:
 *       type: object
 *       required: [phoneNumber, password]
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: "^09\\d{9}$"
 *           example: "09123456789"
 *         password:
 *           type: string
 *           description: Raw password (will be compared with stored hash)
 *           minLength: 1
 *           example: "MyPass@123"
 *
 *     LoginWithOtpRequest:
 *       type: object
 *       required: [phoneNumber, code]
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: "^09\\d{9}$"
 *           example: "09123456789"
 *         code:
 *           type: string
 *           description: OTP code (4 to 6 numeric digits)
 *           minLength: 4
 *           maxLength: 6
 *           pattern: "^\\d{4,6}$"
 *           example: "12345"
 *
 *     ResendOtpRequest:
 *       type: object
 *       required: [phoneNumber]
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: "^09\\d{9}$"
 *           example: "09123456789"
 *
 *     ForgetPasswordRequest:
 *       type: object
 *       required: [phoneNumber, code, newPassword]
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: "^09\\d{9}$"
 *           example: "09123456789"
 *         code:
 *           type: string
 *           minLength: 4
 *           maxLength: 6
 *           pattern: "^\\d{4,6}$"
 *           example: "1234"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: "NewPass@123"
 *
 *     AuthUserPublic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65a8f8f5f2c2a2b3c4d5e6f7"
 *         role:
 *           type: string
 *           enum: [admin, user, superAdmin]
 *           example: "user"
 *         fullName:
 *           type: string
 *           example: ""
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         cartId:
 *           description: Can be object when populated OR string ObjectId (depending on controller)
 *           oneOf:
 *             - type: string
 *               example: "65a8f8f5f2c2a2b3c4d5e6f1"
 *             - type: object
 *               additionalProperties: true
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "login successfully"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: "#/components/schemas/AuthUserPublic"
 *
 *     SimpleSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Otp Code sent"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "invalid phone number or password"
 *         statusCode:
 *           type: integer
 *           example: 401
 */

/**
 * =========================
 * /api/auth (POST)
 * =========================
 * @swagger
 * /api/auth:
 *   post:
 *     tags: [Auth]
 *     summary: Start auth flow (send OTP or indicate password login)
 *     description: |
 *       Provide a phoneNumber.
 *       - If user doesn't exist or user has no password => sends OTP code
 *       - Else => tells client to login with password
 *
 *       Validation:
 *       - phoneNumber required
 *       - format: ^09\\d{9}$
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthInitRequest"
 *     responses:
 *       200:
 *         description: Auth flow started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthInitResponse"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: SMS sending failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/auth/login-password (POST)
 * =========================
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     tags: [Auth]
 *     summary: Login with phoneNumber + password
 *     description: |
 *       Validation:
 *       - phoneNumber required ^09\\d{9}$
 *       - password required (non-empty string)
 *
 *       Errors:
 *       - 401 if invalid phone or password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginWithPasswordRequest"
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       401:
 *         description: Invalid phone/password
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
 * /api/auth/login-otp (POST)
 * =========================
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Login (or register) with OTP
 *     description: |
 *       - Verifies OTP code
 *       - If user doesn't exist: creates User + Cart, links cartId
 *       - Returns JWT token + user payload
 *
 *       Validation:
 *       - phoneNumber required ^09\\d{9}$
 *       - code required, numeric string, 4..6 digits
 *
 *       Errors:
 *       - 401 if code invalid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginWithOtpRequest"
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       401:
 *         description: Invalid code
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
 * /api/auth/resend-code (POST)
 * =========================
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP code
 *     description: |
 *       Validation:
 *       - phoneNumber required ^09\\d{9}$
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResendOtpRequest"
 *     responses:
 *       200:
 *         description: OTP resent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SimpleSuccess"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: SMS sending failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * =========================
 * /api/auth/forget-password (POST)
 * =========================
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with OTP code
 *     description: |
 *       - Verifies OTP code
 *       - Finds user by phoneNumber
 *       - Sets new hashed password
 *
 *       Validation:
 *       - phoneNumber required ^09\\d{9}$
 *       - code required numeric string 4..6 digits
 *       - newPassword required min 8
 *
 *       Errors:
 *       - 401 invalid code
 *       - 404 user not found
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ForgetPasswordRequest"
 *     responses:
 *       200:
 *         description: Password changed
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
 *                   example: "password changed successfully"
 *       401:
 *         description: Invalid code
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
