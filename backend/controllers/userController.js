// backend/controllers/userController.js

// 1. Nhúng Model User (kết nối với MongoDB)
const User = require('../models/user'); 

// GET: Lấy toàn bộ danh sách user (từ MongoDB)
exports.getUsers = async (req, res) => { // CHỌN 'exports.getUsers'
    try {
        // Lấy tất cả user từ database
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Thêm user mới (HĐ 5)
exports.createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 

// PUT: Sửa user (HĐ 7)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE: Xóa user (HĐ 7)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
