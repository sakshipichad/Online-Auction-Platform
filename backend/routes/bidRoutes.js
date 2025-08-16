const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { placeBid } = require('../controllers/bidController');

router.post('/:auctionId', auth, placeBid);

module.exports = router;