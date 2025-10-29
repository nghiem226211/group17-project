const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

// GET /users → lấy danh sách user
router.get('/', userController.getUsers);

// POST /users → thêm user mới
router.post('/', userController.createUser);

module.exports = router;
