const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../controllers/authController');

// All routes in this file are protected and require admin access
router.use(isAdmin);

// POST /api/v1/admin/courses - Create a new course
router.post('/courses', adminController.createCourse);

module.exports = router;
