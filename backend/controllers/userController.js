// backend/controllers/userController.js

// 1. Nhúng Model User (kết nối với MongoDB)
const User = require('../models/User');

// GET: Lấy toàn bộ danh sách user (từ MongoDB)
const getUsers = async (req, res) => {
    try {
        // Lấy tất cả user từ database
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Thêm user mới (vào MongoDB)
const createUser = async (req, res) => {
    // Lấy name, email từ body của Postman
    const { name, email } = req.body;

    try {
        // Tạo user mới bằng Model 'User' và lưu vào MongoDB
        const user = await User.create({ name, email });
        res.status(201).json(user); // Trả về user (sẽ có _id)

    } catch (error) {
        // Lỗi thường gặp: email trùng lặp hoặc thiếu trường required
        res.status(400).json({ message: error.message });
    }
};

// 2. Thêm các hàm trống cho Hoạt động 7 (sẽ làm sau)
const updateUser = (req, res) => {
    res.send('Update user (chưa làm)');
};
const deleteUser = (req, res) => {
    res.send('Delete user (chưa làm)');
};


// 3. Xuất các hàm
module.exports = {
    getUsers,
    createUser,
    updateUser, // Sẽ cần cho HĐ 7
    deleteUser  // Sẽ cần cho HĐ 7
};