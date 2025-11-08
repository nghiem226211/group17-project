// backend/server.js

// 1. Nhúng thư viện
require('dotenv').config(); // PHẢI GỌI Ở ĐẦU
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 2. Middleware
app.use(express.json());

// 3. Import routes
const userRoutes = require('./routes/user');

// --- KẾT NỐI MONGO ATLAS ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ LỖI: Thiếu MONGO_URI trong file .env!");
    process.exit(1); // Thoát ứng dụng
}

// Thêm tên database 'groupDB'
const DB_URL_WITH_NAME = MONGO_URI.replace('?', 'groupDB?');

console.log('Đang kết nối tới MongoDB Atlas...');

mongoose.connect(DB_URL_WITH_NAME)
    .then(() => {
        // KẾT NỐI THÀNH CÔNG
        console.log('🔗 Connected to MongoDB Atlas!');
        
        // 4. Dùng route
        app.use('/users', userRoutes); 

        // 5. Khởi động server (CHỈ SAU KHI KẾT NỐI DB)
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        // KẾT NỐI THẤT BẠI
        console.error('❌ Connection failed!', error.message);
    });