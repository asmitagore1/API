const express = require('express');
const router = express.Router();
const { createPost, getUserPosts, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     PostInput:
 *       type: object
 *       required:
 *         - image
 *         - description
 *       properties:
 *         image:
 *           type: string
 *           example: "https://example.com/images/my-post.jpg"
 *         description:
 *           type: string
 *           example: "Having a wonderful time building Node.js APIs!"
 *     PostUpdate:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           example: "https://example.com/images/updated-post.jpg"
 *         description:
 *           type: string
 *           example: "Updated description for my post!"
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Upload a new post with image and description
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Missing image or description
 *       401:
 *         description: Unauthorized - missing token
 */
router.post('/', protect, createPost);

/**
 * @swagger
 * /api/posts/my-posts:
 *   get:
 *     summary: Fetch all posts created by the current user (for Profile view)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User posts retrieved successfully
 *       401:
 *         description: Unauthorized - missing token
 */
router.get('/my-posts', protect, getUserPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing post's image or description
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized - missing token
 *       403:
 *         description: User not authorized to update this post
 *       404:
 *         description: Post not found
 */
router.put('/:id', protect, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized - missing token
 *       403:
 *         description: User not authorized to delete this post
 *       404:
 *         description: Post not found
 */
router.delete('/:id', protect, deletePost);

module.exports = router;