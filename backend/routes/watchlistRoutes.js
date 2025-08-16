const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToWatchlist, getWatchlist } = require('../controllers/watchlistController');

router.post('/:itemId', auth, addToWatchlist);
router.get('/', auth, getWatchlist);

module.exports = router;