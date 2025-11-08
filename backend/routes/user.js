// backend/routes/user.js
const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

// GET /users
router.get('/', userController.getUsers);

// POST /users
router.post('/', userController.createUser);

// PUT /users/:id
router.put('/:id', userController.updateUser); // Sửa từ '/users/:id' thành '/:id'

// DELETE /users/:id
router.delete('/:id', userController.deleteUser); // Sửa từ '/users/:id' thành '/:id'

module.exports = router;