// backend/models/User.js

const mongoose = require('mongoose');

// Định nghĩa Schema (cấu trúc bảng) theo yêu cầu HĐ 5
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Đảm bảo email không trùng lặp
    },
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Tạo Model từ Schema
const User = mongoose.model('User', userSchema);

// Xuất Model để userController.js có thể sử dụng
module.exports = User;