// frontend/src/components/ResetPassword.jsx

import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);

        // ⭐ Validate mật khẩu khớp
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        // ⭐ Validate độ dài mật khẩu
        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        try {
            // ⭐ Trim token để loại bỏ khoảng trắng
            const resetToken = token.trim();
            
            // Gọi API POST /auth/reset-password/:token
            const response = await axios.post(
                `http://localhost:3000/auth/reset-password/${resetToken}`,
                { newPassword }
            );
            
            setMessage(response.data.message);
            
            // ⭐ Reset form sau khi thành công
            setToken('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error("Lỗi reset password:", err);
            
            if (err.response && err.response.data) {
                setError(err.response.data.message);
                
                // ⭐ Hiển thị debug info nếu có
                if (err.response.data.debug) {
                    console.log("Debug info:", err.response.data.debug);
                }
            } else {
                setError("Đã xảy ra lỗi khi đổi mật khẩu.");
            }
        }
    };

    return (
        <div style={{ border: '1px solid blue', padding: '15px', marginTop: '20px' }}>
            <h2>2. Đặt Lại Mật Khẩu (HĐ 4)</h2>
            <form onSubmit={handleSubmit}>
                <p>Nhập mã token và mật khẩu mới của bạn.</p>
                
                {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Token Reset (từ email hoặc copy ở trên):</label><br/>
                    <input 
                        type="text" 
                        placeholder="Dán token từ phần 'Quên Mật Khẩu' ở trên" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                    <small style={{ color: '#666' }}>
                        Token có dạng: 8be1c3fbd618ed77dbd9fa9d1177dfb4af0e4fd3
                    </small>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Mật khẩu mới:</label><br/>
                    <input 
                        type="password" 
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Xác nhận mật khẩu:</label><br/>
                    <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu mới" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Đổi Mật Khẩu
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;