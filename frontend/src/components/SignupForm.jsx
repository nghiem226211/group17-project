// frontend/src/components/SignupForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ onSignupSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validation cơ bản
        if (!name || !email || !password) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            // Gọi API Đăng ký [cite: 43]
            const response = await axios.post("http://localhost:3000/auth/signup", { name, email, password });
            
            // Thông báo kết quả [cite: 47]
            alert(response.data.message || "Đăng ký thành công!");
            
            onSignupSuccess(); // Chuyển hướng hoặc thông báo
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px' }}>
            <h2>Đăng ký (Sign Up)</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <input type="text" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Đăng ký</button>
        </form>
    );
};

export default SignupForm;