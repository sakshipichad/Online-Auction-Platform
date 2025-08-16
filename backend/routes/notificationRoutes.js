const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', auth, getNotifications);
router.patch('/:id/read', auth, markAsRead);

module.exports = router;