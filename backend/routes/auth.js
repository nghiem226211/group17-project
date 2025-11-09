// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// POST /auth/signup
router.post('/signup', authController.signup);
// POST /auth/login
router.post('/login', authController.login);
// GET /auth/profile
router.get('/profile', protect, authController.getProfile);
// PUT /auth/profile
router.put('/profile', protect, authController.updateProfile);

// (Chúng ta sẽ thêm /login ở đây sau)

module.exports = router;