// backend/controllers/authController.js
const User = require('../models/user');
const bcryptjs = require('bcryptjs'); // Nhúng thư viện mã hóa
const jwt = require('jsonwebtoken'); // Nhúng thư viện JWT

// --- API ĐĂNG KÝ (SIGN UP) --- 
exports.signup = async (req, res) => {
    try {
        // 1. Lấy name, email, password từ request body
        const { name, email, password } = req.body;

        // 2. Kiểm tra email đã tồn tại chưa 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // 3. Mã hóa mật khẩu 
        const salt = await bcryptjs.genSalt(10); // Tạo "muối"
        const hashedPassword = await bcryptjs.hash(password, salt); // Băm mật khẩu

        // 4. Tạo user mới
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
        });

        // 5. Trả về thành công
        res.status(201).json({ message: "Tạo tài khoản thành công!", userId: user._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- API ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    try {
        // 1. Lấy email và password từ request
        const { email, password } = req.body;

        // 2. Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại." });
        }

        // 3. So sánh mật khẩu
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác." });
        }

        // 4. Tạo JWT Token
        // Gói 'id' và 'role' của user vào token
        const payload = {
            id: user._id,
            role: user.role
        };

        // Ký token với một "khóa bí mật" (đặt trong .env)
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, // Bạn phải thêm khóa này vào .env
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        // 5. Trả về token cho client
        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- API ĐĂNG XUẤT (LOGOUT) ---
exports.logout = (req, res) => {
    // Về cơ bản, backend chỉ cần xác nhận
    // Việc xóa token sẽ do client (React) xử lý
    res.status(200).json({ message: "Đăng xuất thành công!" });
};

// --- API XEM THÔNG TIN CÁ NHÂN (GET PROFILE) ---
// Sẽ được bảo vệ bởi middleware
exports.getProfile = async (req, res) => {
    // req.user đã được middleware 'protect' gắn vào từ token
    const user = await User.findById(req.user.id);

    if (user) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

// --- API CẬP NHẬT THÔNG TIN CÁ NHÂN (UPDATE PROFILE) ---
exports.updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name; // Cập nhật tên nếu có
        user.email = req.body.email || user.email; // Cập nhật email nếu có

        // Nếu người dùng muốn đổi mật khẩu
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save(); // Lưu lại vào DB

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};