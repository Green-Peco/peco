const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const gamificationController = require('../controllers/gamificationController');
const authController = require('../controllers/authController');
const { validate, lessonCompletionSchema } = require('../middleware/validators');

// GET /api/v1/lessons/:lessonId - Get the content of a specific lesson
router.get('/:lessonId', courseController.getLessonById);

// POST /api/v1/lessons/:lessonId/complete - Complete a lesson
router.post('/:lessonId/complete', authController.isLoggedIn, validate(lessonCompletionSchema), gamificationController.completeLesson);

module.exports = router;
