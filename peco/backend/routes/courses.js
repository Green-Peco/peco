const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/v1/courses - Get all courses
router.get('/', courseController.getAllCourses);

// GET /api/v1/courses/:courseId - Get a specific course with its units and lessons
router.get('/:courseId', courseController.getCourseById);

module.exports = router;
