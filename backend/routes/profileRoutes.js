const express = require('express');
const auth = require('../middleware/auth');
const { getUserProfile, updateProfile, uploadProfilePhoto } = require('../controllers/profileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

const router = express.Router();

// GET /api/profile - Fetch user profile
router.get('/', auth, getUserProfile);

// PUT /api/profile - Update user profile
router.put('/', auth, updateProfile);

// POST /api/profile/photo - Upload profile photo
router.post('/photo', auth, upload.single('profilePhoto'), uploadProfilePhoto);

module.exports = router;
