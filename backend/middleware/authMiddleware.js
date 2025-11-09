// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware này sẽ "bảo vệ" các route
exports.protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Lấy token từ header (Bỏ chữ "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Lấy thông tin user từ token (trừ mật khẩu) và gắn vào request
            // req.user sẽ được dùng ở các bước sau
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Đi tiếp đến bước tiếp theo (ví dụ: hàm getProfile)
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không có quyền truy cập, token thất bại' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
    }
};