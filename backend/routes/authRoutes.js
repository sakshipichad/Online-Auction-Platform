const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { signup, signin } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', auth, async (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email
  });
});

module.exports = router;

