// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Đảm bảo đúng đường dẫn User.js

// --- 1. MIDDLEWARE BẢO VỆ (PROTECT) ---
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Lấy thông tin user (trừ mật khẩu)
            req.user = await User.findById(decoded.id).select('-password');

            // Nếu không tìm thấy user, trả về lỗi
            if (!req.user) {
                return res.status(401).json({ message: 'User không tồn tại' });
            }

            next(); 
        } catch (error) {
            // Lỗi Token không hợp lệ (hết hạn, sai chữ ký)
            return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
        }
    }

    // Nếu không có token trong header
    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
    }
};

// --- 2. MIDDLEWARE KIỂM TRA QUYỀN ADMIN (RBAC) ---
exports.admin = (req, res, next) => {
    // Kiểm tra req.user (được gắn vào bởi exports.protect)
    if (req.user && req.user.role === 'Admin') {
        next(); // Cho phép truy cập
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập Admin' });
    }
};