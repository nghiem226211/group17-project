// backend/controllers/authController.js (Fixed Reset Password)

const User = require('../models/user');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto');

// --- API ĐĂNG KÝ (SIGN UP) ---
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "Tạo tài khoản thành công!", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- API ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại." });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác." });
        }
        const payload = {
            id: user._id,
            role: user.role
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
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
    res.status(200).json({ message: "Đăng xuất thành công!" });
};

// --- API XEM THÔNG TIN CÁ NHÂN (GET PROFILE) ---
exports.getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

// --- API CẬP NHẬT THÔNG TIN CÁ NHÂN (UPDATE PROFILE) ---
exports.updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
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

// --- API QUÊN MẬT KHẨU (FORGOT PASSWORD) - ⭐ FIXED ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Nếu email tồn tại, link reset sẽ được gửi.' });
        }

        // ⭐ Tạo token ngẫu nhiên (40 ký tự hex)
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // ⭐ Hash token trước khi lưu vào DB
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save();

        // ⭐ QUAN TRỌNG: Gửi RAW TOKEN (chưa hash) cho user
        const resetURL = `http://localhost:3001/reset-password/${resetToken}`;
        
        console.log(`\n\n--- [MOCK EMAIL SENT] ---`);
        console.log(`To: ${email}`);
        console.log(`Reset URL: ${resetURL}`);
        console.log(`Token (Copy vào frontend): ${resetToken}`);
        console.log(`Token (Đã hash trong DB): ${hashedToken}`);
        console.log(`Expires: ${new Date(user.resetPasswordExpires)}`);
        console.log(`-------------------------\n`);

        res.status(200).json({ 
            message: 'Nếu email tồn tại, link reset đã được gửi thành công.',
            // ⭐ Trong môi trường DEV, có thể trả token về để test
            // NHỚ XÓA DÒNG NÀY KHI PRODUCTION!
            devToken: resetToken 
        });
    } catch (err) {
        console.error("Lỗi forgotPassword:", err);
        res.status(500).json({ message: 'Lỗi server khi xử lý quên mật khẩu.' });
    }
};

// --- API ĐỔI MẬT KHẨU (RESET PASSWORD) - ⭐ FIXED ---
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // ⭐ CRITICAL: Trim token để loại bỏ khoảng trắng/xuống dòng
        const cleanToken = token.trim();
        
        // ⭐ Hash token từ URL (giống như lúc lưu)
        const hashedToken = crypto.createHash('sha256').update(cleanToken).digest('hex');

        console.log(`\n--- [DEBUG RESET PASSWORD] ---`);
        console.log(`Token nhận được: "${token}"`);
        console.log(`Token sau trim: "${cleanToken}"`);
        console.log(`Token đã hash: ${hashedToken}`);
        console.log(`Thời gian hiện tại: ${new Date()}`);
        
        // ⭐ Tìm user với token đã hash
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log(`❌ Không tìm thấy user với token này`);
            
            // Debug: Tìm user có token bất kỳ để so sánh
            const anyUser = await User.findOne({ 
                resetPasswordToken: { $exists: true, $ne: null } 
            });
            
            if (anyUser) {
                console.log(`Token trong DB: ${anyUser.resetPasswordToken}`);
                console.log(`Token expires: ${anyUser.resetPasswordExpires}`);
                console.log(`Email: ${anyUser.email}`);
            }
            
            return res.status(400).json({ 
                message: 'Token không hợp lệ hoặc đã hết hạn.',
                debug: {
                    receivedToken: cleanToken,
                    hashedToken: hashedToken
                }
            });
        }

        console.log(`✅ Tìm thấy user: ${user.email}`);

        // ⭐ Hash mật khẩu mới
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(newPassword, salt);
        
        // ⭐ Xóa token reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        
        console.log(`✅ Đổi mật khẩu thành công cho ${user.email}`);
        console.log(`------------------------------\n`);
        
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (err) {
        console.error("Lỗi resetPassword:", err);
        res.status(500).json({ message: 'Lỗi server khi xử lý đổi mật khẩu.' });
    }
};

// --- API UPLOAD AVATAR ---
exports.uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        if (req.file && req.file.path) {
            user.avatar = req.file.path;
            await user.save();
            
            res.status(200).json({
                message: 'Upload Avatar thành công!',
                avatarUrl: user.avatar
            });
        } else {
            res.status(400).json({ message: 'Không tìm thấy file ảnh để upload' });
        }
    } catch (err) {
        console.error("Lỗi Upload:", err);
        res.status(500).json({ message: 'Lỗi server khi upload avatar.' });
    }
};