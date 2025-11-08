// backend/server.js

// 1. Nhúng thư viện dotenv và mongoose
require('dotenv').config(); // Đảm bảo gọi ở đầu để đọc biến môi trường (.env)

const express = require('express');
const mongoose = require('mongoose'); // Thêm mongoose
const app = express();

// Middleware để đọc JSON
app.use(express.json());

// 🧩 Import routes
const userRoutes = require('./routes/user');

// --- KẾT NỐI MONGO ATLAS ---
// Lấy chuỗi kết nối từ file .env
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined. Add MONGO_URI to your .env or set the env var.');
    console.error('Example .env line:\nMONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority');
    process.exit(1);
}

// Thêm tên database 'groupDB' vào chuỗi kết nối một cách an toàn
const DB_URL_WITH_NAME = MONGO_URI.includes('/?')
    ? MONGO_URI.replace('/?', '/groupDB?')
    : (MONGO_URI.includes('?')
        ? MONGO_URI.replace('?', 'groupDB?')
        : (MONGO_URI.endsWith('/') ? `${MONGO_URI}groupDB` : `${MONGO_URI}/groupDB`));

mongoose.connect(DB_URL_WITH_NAME)
    .then(() => {
        console.log('🔗 Connected to MongoDB Atlas!');
        
        // 🛣️ Dùng route /users
        // CHỈ khởi động server khi kết nối DB thành công
        app.use('/users', userRoutes); 

        // Cổng chạy server
        const PORT = process.env.PORT || 3000;

        // Khởi động server
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Connection failed!', error);
    });

