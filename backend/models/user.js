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
}, { timestamps: true }); 

// Tạo Model từ Schema
const User = mongoose.model('User', userSchema);

// Xuất Model
module.exports = User;