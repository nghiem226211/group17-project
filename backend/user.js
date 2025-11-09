// backend/models/User.js

const mongoose = require('mongoose');

// Định nghĩa Schema (cấu trúc bảng)
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
const User = mongoose.model('user', userSchema);

module.exports = User;