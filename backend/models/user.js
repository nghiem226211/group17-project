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
        unique: true 
    },
    password: {
        type: String,
        required: true // Bắt buộc phải có mật khẩu
    },
    role: {
        type: String,
        default: 'User' // Mặc định là 'User' [cite: 18, 29]
    }
}, { timestamps: true }); 

// Tạo Model từ Schema
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Xuất Model
module.exports = User;