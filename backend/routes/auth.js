// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

// POST /auth/signup
router.post('/signup', authController.signup);
// POST /auth/login
router.post('/login', authController.login);
// GET /auth/profile
router.get('/profile', protect, authController.getProfile);
// PUT /auth/profile
router.put('/profile', protect, authController.updateProfile);

// Route POST /auth/forgot-password (HĐ 4) 
router.post('/forgot-password', authController.forgotPassword);

// Route POST /auth/reset-password (HĐ 4) 
// Token reset sẽ được gửi qua URL
router.post('/reset-password/:token', authController.resetPassword);
router.post('/upload-avatar', protect, upload.single('avatar'), authController.uploadAvatar);
module.exports = router;