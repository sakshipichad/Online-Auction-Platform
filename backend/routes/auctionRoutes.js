const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const auctionController = require('../controllers/auctionController');
const upload = require('../middleware/upload'); // Import the upload middleware

// Routes
router.get('/', auctionController.getAllAuctions); // Get all auctions
router.get('/:id', auctionController.getAuction); // Get a single auction by ID
router.post(
  '/',
  auth,
  upload.single('image'), // Use the upload middleware for single file upload
  auctionController.createAuction
); // Create a new auction with image upload
router.post('/:id/determine-winner', auth, auctionController.determineWinner); // Determine the winner of an auction
module.exports = router;