// backend/models/User.js (Chỉ chứa Schema, KHÔNG chứa Express Router)

const mongoose = require('mongoose');

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
    password: { // Thêm cho Buổi 5
        type: String,
        required: true
    },
    role: { // Thêm cho Buổi 5
        type: String,
        default: 'User'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    avatar: {
    type: String, // Lưu URL của ảnh
    default: 'https://i.imgur.com/default.png' 
    },
}, { timestamps: true }); 

// Tạo Model từ Schema (Đây là dòng cuối cùng)
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;