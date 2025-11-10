// frontend/src/components/LoginForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Gọi API Đăng nhập [cite: 43]
            const response = await axios.post("http://localhost:3000/auth/login", { email, password });
            
            // LƯU TOKEN: Lưu JWT token vào localStorage 
            const token = response.data.token;
            localStorage.setItem('token', token); 
            
            alert('Đăng nhập thành công!');
            onLoginSuccess(response.data.user); // Trả về thông tin user
        } catch (err) {
            setError(err.response?.data?.msg || "Đăng nhập thất bại. Kiểm tra Email/Pass.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid blue', padding: '15px' }}>
            <h2>Đăng nhập (Login)</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Đăng nhập</button>
        </form>
    );
};

export default LoginForm;