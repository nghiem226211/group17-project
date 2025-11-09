const User = require('../models/user'); // Import User Model
const bcrypt = require('bcryptjs'); // Thư viện mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Thư viện tạo JWT

// --- 1. ĐĂNG KÝ (SIGN UP) ---
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Kiểm tra Email đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Tạo User mới
        user = new User({
            name,
            email,
            password
            // Mặc định role là 'user' (nếu không có logic role admin)
        });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Lưu user vào Database
        await user.save();

        // Trả về token (để đăng nhập ngay sau khi đăng ký)
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // JWT_SECRET cần được định nghĩa trong file .env
            { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- 2. ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra User có tồn tại không
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Email hoặc pass sai
        }

        // Kiểm tra Mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Email hoặc pass sai
        }

        // Tạo và trả về token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};