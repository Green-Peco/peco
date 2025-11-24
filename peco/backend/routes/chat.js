const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { isLoggedIn } = require('../controllers/authController');

// All chat routes require login
router.use(isLoggedIn);

// GET /api/v1/chat/rooms - Get all chat rooms the user is a participant of
router.get('/rooms', chatController.getChatRooms);

// GET /api/v1/chat/rooms/:roomId/messages - Get messages for a specific room
router.get('/rooms/:roomId/messages', chatController.getMessages);

// Note: sendMessage is handled via WebSockets, not a REST endpoint

module.exports = router;
