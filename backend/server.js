// backend/server.js

// backend/server.js - PHẦN CODE ĐÃ GIẢI QUYẾT

// 1. Nhúng thư viện
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- Giữ lại CORS từ main nếu có
const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors()); // <--- Giữ lại CORS từ main nếu có

// 3. Import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth'); // <--- QUAN TRỌNG: Giữ lại route Auth

// --- KẾT NỐI MONGO ATLAS ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ LỖI: Thiếu MONGO_URI trong file .env!");
    process.exit(1);
}

// **GIỮ LOGIC XỬ LÝ URL AN TOÀN TỪ NHÁNH DATABASE**
const DB_URL_WITH_NAME = MONGO_URI.includes('/?')
    ? MONGO_URI.replace('/?', '/groupDB?')
    : (MONGO_URI.includes('?')
        ? MONGO_URI.replace('?', 'groupDB?')
        : (MONGO_URI.endsWith('/') ? `${MONGO_URI}groupDB` : `${MONGO_URI}/groupDB`));


console.log('Đang kết nối tới MongoDB Atlas...');

mongoose.connect(DB_URL_WITH_NAME)
    .then(() => {
        // KẾT NỐI THÀNH CÔNG
        console.log('🔗 Connected to MongoDB Atlas!');
        
        // 4. Dùng route
        app.use('/users', userRoutes);
        app.use('/auth', authRoutes); // <--- QUAN TRỌNG: Giữ lại route Auth

        // 5. Khởi động server (CHỈ SAU KHI KẾT NỐI DB)
        const PORT = process.env.PORT || 3000;
        // Giữ nguyên logic listen cho mạng ngoài ('0.0.0.0')
        app.listen(PORT,'0.0.0.0', () => { 
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        // KẾT NỐI THẤT BẠI
        console.error('❌ Connection failed!', error.message);
    });

