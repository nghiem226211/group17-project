const express = require('express');
const app = express();

// Middleware để đọc JSON
app.use(express.json());

// 🧩 Import route users
const userRoutes = require('./routes/user');

// 🛣️ Dùng route /users
app.use('/users', require('./routes/user'));

// Cổng chạy server
const PORT = process.env.PORT || 3000;

// Khởi động server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
