// frontend/src/components/AddUser.jsx

import React, { useState } from 'react';
import axios from 'axios';

// Đổi tên component cho rõ nghĩa hơn (tùy chọn)
const AddUser = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // --- THÊM STATE CHO PASSWORD ---
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- VALIDATION (HĐ 8) ---
        if (!name.trim()) {
            setError("Tên không được để trống!");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email không hợp lệ!");
            return;
        }
        // --- THÊM VALIDATION CHO PASSWORD ---
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        // -------------------------

        try {
            // --- SỬA LẠI API ENDPOINT VÀ DATA ---
            // Đổi từ /users (Buổi 4) sang /auth/signup (Buổi 5)
            await axios.post("http://localhost:3000/auth/signup", { name, email, password }); 
            
            setName('');
            setEmail('');
            setPassword(''); // Xóa trường password
            onAdd(); 

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Lỗi từ Server: ${err.response.data.message}`);
            } else {
                setError("Lỗi: Không thể kết nối. Vui lòng kiểm tra Server Backend.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
            <h2>Thêm người dùng mới (HĐ 8)</h2>
            {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
            
            <input 
                type="text"
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {/* --- THÊM Ô INPUT PASSWORD --- */}
            <input 
                type="password"
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Thêm</button>
        </form>
    );
};

export default AddUser;