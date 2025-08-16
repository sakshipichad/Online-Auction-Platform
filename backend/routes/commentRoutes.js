const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Add a comment to an auction
router.post('/:auctionId', auth, commentController.addComment);

// Get all comments for an auction
router.get('/:auctionId', commentController.getComments);

module.exports = router;