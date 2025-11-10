// backend/routes/user.js
const { protect, admin } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

// GET /users
router.get('/', userController.getUsers);
// Áp dụng bảo vệ (protect) VÀ kiểm tra quyền (admin)
router.get('/', protect, admin, userController.getUsers);
// POST /users
router.post('/', userController.createUser);

// PUT /users/:id
router.put('/:id', userController.updateUser); // Sửa từ '/users/:id' thành '/:id'

// DELETE /users/:id
router.delete('/:id', userController.deleteUser); // Sửa từ '/users/:id' thành '/:id'
// DELETE /users/:id (Chỉ Admin mới xóa được user khác)
router.delete('/:id', protect, admin, userController.deleteUser);
module.exports = router;