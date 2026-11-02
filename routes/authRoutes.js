const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - phone_number
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: john_doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phone_number:
 *           type: string
 *           example: "+1234567890"
 *         password:
 *           type: string
 *           example: secret123
 *         profile:
 *           type: object
 *           properties:
 *             bio:
 *               type: string
 *               example: Software Developer
 *             avatar:
 *               type: string
 *               example: https://example.com/avatar.jpg
 *             address:
 *               type: string
 *               example: New York, USA
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: secret123
 *     UserProfileUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: john_updated
 *         email:
 *           type: string
 *           example: john_updated@example.com
 *         phone_number:
 *           type: string
 *           example: "+1987654321"
 *         password:
 *           type: string
 *           example: newsecret123
 *         profile:
 *           type: object
 *           properties:
 *             bio:
 *               type: string
 *               example: Senior Full Stack Developer
 *             avatar:
 *               type: string
 *               example: https://example.com/new-avatar.jpg
 *             address:
 *               type: string
 *               example: San Francisco, USA
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and get token (Login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user / Clear session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', protect, logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Fetch current user profile (for Home Page)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile & credentials (Username, Email, Phone, Password, Avatar, Bio, Address)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 */
router.put('/profile', protect, updateProfile);

module.exports = router;
