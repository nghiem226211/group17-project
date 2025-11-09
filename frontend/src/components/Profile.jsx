// frontend/src/components/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy token từ localStorage (đã có từ API Login)
    const token = localStorage.getItem('token'); 

    // Hàm GET Profile (Xem thông tin)
    const fetchProfile = async () => {
        if (!token) {
            setError("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            // Gửi token lên Backend qua header Authorization
            const response = await axios.get("http://localhost:3000/auth/profile", {
                headers: {
                    'Authorization': `Bearer ${token}` // <--- GỬI TOKEN BẢO MẬT
                }
            });
            setUser(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            setLoading(false);
        } catch (err) {
            setError("Lỗi: Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
            setLoading(false);
        }
    };

    // Hàm PUT Profile (Cập nhật thông tin)
    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:3000/auth/profile", { name, email }, {
                headers: {
                    'Authorization': `Bearer ${token}` // <--- GỬI TOKEN BẢO MẬT
                }
            });
            alert('Cập nhật thành công!');
            fetchProfile(); 
        } catch (err) {
            alert('Cập nhật thất bại.');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div>Đang tải thông tin cá nhân...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>Vui lòng đăng nhập để xem thông tin.</div>;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>Trang Thông tin Cá nhân (HĐ 2)</h2>
            <p><strong>Tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            
            <form onSubmit={updateProfile}>
                <h3>Cập nhật Thông tin</h3>
                <input 
                    type="text"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Lưu Thay Đổi</button>
            </form>
        </div>
    );
};

export default Profile;