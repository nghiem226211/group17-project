// frontend/src/App.js (CODE HOÀN CHỈNH - SỬA LỖI LẶP)

import React, { useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import Profile from './components/Profile.jsx';
import AdminUserList from './components/AdminUserList.jsx'; 
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';

function App() {
    // State quản lý việc đã đăng nhập hay chưa
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    // State lưu thông tin user (để biết ai là Admin)
    const [currentUser, setCurrentUser] = useState(null); 
    
    // Hàm này được gọi khi Login thành công
    const handleLoginSuccess = (user) => {
        setIsAuthenticated(true);
        setCurrentUser(user); // Lưu thông tin user (bao gồm cả role)
    };

    // Hàm xử lý Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
        alert('Đã đăng xuất!');
    };

    return (
        <div className="App" style={{ padding: "20px" }}>
            <h1>Ứng dụng Quản lý User (Buổi 5)</h1>
            
            {/* KIỂM TRA ĐĂNG NHẬP */}
            {isAuthenticated ? (
                // --- NẾU ĐÃ ĐĂNG NHẬP ---
                <>
                    <button onClick={handleLogout} style={{ float: 'right' }}>Đăng xuất</button>
                    
                    {/* Hiển thị Profile (HĐ 2 & 4) */}
                    <Profile /> 
                    
                    {/* Hiển thị Trang Admin (HĐ 3) - CHỈ KHI LÀ ADMIN */}
                    {currentUser && currentUser.role.toLowerCase() === 'admin' && (
                        <AdminUserList />
                    )}
                </>
            ) : (
                // --- NẾU CHƯA ĐĂNG NHẬP (KHỐI CODE HIỂN THỊ CÁC FORM) ---
                <>
                    {/* Hiển thị Form Login/Signup (HĐ 1) */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                        <SignupForm onSignupSuccess={() => alert('Vui lòng đăng ký thành công! Vui lòng đăng nhập.')} />
                    </div>
                    
                    {/* ========================================
                        PHẦN QUÊN MẬT KHẨU (HĐ 4)
                        Đảm bảo chỉ có 1 ForgotPassword và 1 ResetPassword ở đây
                        ======================================== */}
                    
                    {/* 1. Form nhập email, nhận token */}
                    <ForgotPassword />
                    
                    {/* 2. Form nhập token, đổi mật khẩu */}
                    <ResetPassword /> 
                </>
            )}
        </div>
    );
}

export default App;