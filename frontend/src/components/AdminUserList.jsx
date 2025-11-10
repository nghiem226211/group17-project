// frontend/src/components/AdminUserList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    // Lấy Token (của Admin) từ localStorage
    const token = localStorage.getItem('token'); 

    // --- HÀM KẾT NỐI API GET (CHỈ ADMIN) ---
    const fetchUsers = async () => {
        if (!token) {
            setError("Bạn chưa đăng nhập bằng tài khoản Admin.");
            return;
        }

        try {
            // Gọi API GET /users với Bearer Token
            const response = await axios.get("http://localhost:3000/users", {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            setUsers(response.data);
            setError(null);
        } catch (err) {
            // Lỗi 403 Forbidden (nếu token không phải Admin) hoặc 401 (token sai)
            setError("Lỗi: Không có quyền truy cập Admin (403 Forbidden). Vui lòng đăng nhập lại bằng tài khoản Admin."); 
            console.error(err);
        }
    };
    
    // Tự động gọi API khi component được tải
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- XỬ LÝ XÓA (DELETE USER) ---
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                // Gửi DELETE request với Token Admin
                await axios.delete(`http://localhost:3000/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }); 
                fetchUsers(); // Tải lại danh sách sau khi xóa
            } catch (error) {
                setError("Lỗi: Không thể xóa user. (Chỉ Admin mới có quyền này).");
            }
        }
    };

    if (error) return <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', border: '1px solid red', marginTop: '20px' }}>
            <h2>Trang Admin: Danh sách người dùng (HĐ 3)</h2>

            {users.length === 0 && <div>(Đang tải hoặc không có người dùng nào)</div>}
            
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò (Role)</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user._id)} style={{ color: 'red' }}>
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

export default AdminUserList;