const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isLoggedIn } = require('../controllers/authController');
const { validate, createPostSchema } = require('../middleware/validators');

// GET /api/v1/posts - Get all posts
router.get('/', postController.getAllPosts);

// GET /api/v1/posts/:postId - Get a single post by ID
router.get('/:postId', postController.getPostById);

// POST /api/v1/posts - Create a new post (requires login)
router.post('/', isLoggedIn, validate(createPostSchema), postController.createPost);

module.exports = router;
