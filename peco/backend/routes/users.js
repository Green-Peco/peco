const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// All routes in this file are protected
router.use(authController.isLoggedIn);

// GET /api/users/profile - Get the logged-in user's profile
router.get('/profile', userController.getUserProfile);

// GET /api/users/progress - Get the logged-in user's progress
router.get('/progress', userController.getUserProgress);

module.exports = router;
