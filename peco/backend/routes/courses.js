const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const gamificationController = require('../controllers/gamificationController');
const authController = require('../controllers/authController');
const { validate, lessonCompletionSchema } = require('../middleware/validators');

// GET /api/courses - Get all courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/:courseId - Get a specific course with its units and lessons
router.get('/:courseId', courseController.getCourseById);

// GET /api/courses/:courseId/lessons/:lessonId - Get the content of a specific lesson
router.get('/:courseId/lessons/:lessonId', courseController.getLessonById);

// POST /api/courses/lessons/:lessonId/complete - Complete a lesson
router.post('/lessons/:lessonId/complete', authController.isLoggedIn, validate(lessonCompletionSchema), gamificationController.completeLesson);

module.exports = router;