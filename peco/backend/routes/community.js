const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { isLoggedIn, isAdmin } = require('../controllers/authController');
const { validate, createCommunitySchema } = require('../middleware/validators');

// GET /api/v1/communities - Get all communities (public)
router.get('/', communityController.getAllCommunities);

// GET /api/v1/communities/:communityId - Get community details (public)
router.get('/:communityId', communityController.getCommunityById);

// POST /api/v1/communities - Create a new community (admin only)
router.post('/', isLoggedIn, isAdmin, validate(createCommunitySchema), communityController.createCommunity);

// POST /api/v1/communities/:communityId/join - Join a community (requires login)
router.post('/:communityId/join', isLoggedIn, communityController.joinCommunity);

module.exports = router;
