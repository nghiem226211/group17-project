// frontend/src/components/UserList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser.jsx'; // Import component Sửa

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null); // State cho HĐ 7 (Sửa)

    // --- LOGIC GET DATA (HĐ 6) ---
    const fetchUsers = async () => {
        try {
            // Đảm bảo URL là localhost:3000
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- LOGIC DELETE (HĐ 7) ---
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers(); // Tải lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
        }
    };

    // --- LOGIC EDIT (HĐ 7) ---
    const handleEdit = (user) => {
        setEditingUser(user); // Mở form sửa
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* HIỂN THỊ FORM SỬA KHI NÚT SỬA ĐƯỢC NHẤN */}
            {editingUser && (
                <EditUser 
                    user={editingUser} 
                    onUpdate={fetchUsers} // Tải lại list sau khi update
                    onCancel={() => setEditingUser(null)} // Đóng form
                />
            )}
            
            <h2>Danh sách người dùng (HĐ 6)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Thao tác (HĐ 7)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Sửa</button>
                                <button 
                                    onClick={() => handleDelete(user._id)} 
                                    style={{ marginLeft: '10px', color: 'red' }}>
                                        Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;