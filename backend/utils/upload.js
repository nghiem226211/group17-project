// backend/utils/upload.js

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- 1. Cấu hình Cloudinary (Sử dụng keys từ .env) ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- 2. Cấu hình Multer Storage ---
// Định nghĩa nơi lưu trữ (Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mern_user_avatars', // Tên thư mục trong Cloudinary
        format: async (req, file) => 'jpg', // Định dạng file
        public_id: (req, file) => `${req.user.id}-${Date.now()}` // Đặt tên file dựa trên User ID
    }
});

// --- 3. Export Multer Middleware ---
// middleware 'upload' này sẽ xử lý file duy nhất có tên 'avatar'
const upload = multer({ storage: storage });

module.exports = upload;