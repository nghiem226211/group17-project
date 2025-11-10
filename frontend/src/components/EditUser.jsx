// frontend/src/components/EditUser.jsx (Form SỬA - PUT)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = ({ user, onUpdate, onCancel }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState(null);

    // Đồng bộ state khi user thay đổi
    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (Bỏ qua validation ở đây nếu cần, hoặc copy logic từ AddUser) ...
        try {
            // Gửi PUT request đến backend
            await axios.put(`http://localhost:3000/users/${user._id}`, { name, email });
            onUpdate();
            onCancel();
        } catch (err) {
            setError("Lỗi: Không thể cập nhật.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid orange', padding: '15px', marginBottom: '20px' }}>
            <h3>Sửa thông tin: {user.name}</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input type="text" placeholder="Tên mới" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Email mới" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Hủy</button>
        </form>
    );
};

export default EditUser;