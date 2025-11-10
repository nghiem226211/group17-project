// frontend/src/components/Profile.jsx (With Debug)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false); // ✅ THÊM loading state
    const token = localStorage.getItem('token'); 

    const fetchProfile = useCallback(async () => {
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
            console.error("❌ Fetch Profile Error:", err); // DEBUG
            setError("Lỗi: Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
            setLoading(false);
        }
    }, [token]);

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
            console.error("❌ Update Profile Error:", err); // DEBUG
            alert('Cập nhật thất bại: ' + (err.response?.data?.message || err.message));
        }
    };

    // ✅ FIXED Upload Function với Debug
    const handleFileUpload = async (e) => {
        e.preventDefault();
        
        // Validate file
        if (!selectedFile) {
            alert("Vui lòng chọn ảnh để upload.");
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(selectedFile.type)) {
            alert("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)!");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (selectedFile.size > maxSize) {
            alert("File quá lớn! Tối đa 5MB.");
            return;
        }

        console.log("📤 Uploading file:", {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size
        });

        setUploadLoading(true);
        setUploadMessage('');
        
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            console.log("🔑 Token:", token ? "có" : "không có");
            
            const response = await axios.post(
                'http://localhost:3000/auth/upload-avatar', 
                formData, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("✅ Upload Success:", response.data);
            setUploadMessage(response.data.message || "Upload thành công!");
            
            // Refresh profile để lấy avatar mới
            await fetchProfile();
            
            // Reset form
            setSelectedFile(null);
            // Reset input file
            document.getElementById('avatarInput').value = '';
            
        } catch (error) {
            console.error("❌ Upload Error:", error);
            console.error("Error response:", error.response?.data);
            
            const errorMsg = error.response?.data?.message 
                || error.message 
                || "Không thể upload ảnh.";
            
            setUploadMessage("Lỗi Upload: " + errorMsg);
        } finally {
            setUploadLoading(false);
        }
    };

    // ✅ THÊM hàm xem trước ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            console.log("📁 File selected:", file.name);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) return <div>Đang tải thông tin cá nhân...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>Vui lòng đăng nhập để xem thông tin.</div>;

    return (
        <div style={{ border: '1px solid gray', padding: '20px', marginTop: '20px' }}>
            <h2>3. Profile & Upload Avatar (HĐ 4)</h2>
            <p><strong>Tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            
            <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h3>Upload Avatar</h3>
                
                {/* Hiển thị avatar hiện tại */}
                {user && user.avatar ? (
                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>Avatar hiện tại:</strong></p>
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            style={{ 
                                width: '120px', 
                                height: '120px', 
                                borderRadius: '50%', 
                                objectFit: 'cover',
                                border: '3px solid #4CAF50'
                            }} 
                        />
                    </div>
                ) : (
                    <p style={{ color: '#999' }}>Chưa có avatar</p>
                )}
                
                {/* Form upload */}
                <form onSubmit={handleFileUpload}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Chọn ảnh mới:</label>
                        <input 
                            id="avatarInput"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            disabled={uploadLoading}
                            style={{ display: 'block', margin: '10px 0' }}
                        />
                        {selectedFile && (
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={uploadLoading || !selectedFile}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: uploadLoading ? '#ccc' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: uploadLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {uploadLoading ? '⏳ Đang Upload...' : '📤 Upload Ảnh'}
                    </button>
                    
                    {uploadMessage && (
                        <p style={{ 
                            marginTop: '10px',
                            color: uploadMessage.startsWith('Lỗi') ? 'red' : 'green',
                            fontWeight: 'bold'
                        }}>
                            {uploadMessage}
                        </p>
                    )}
                </form>
            </div>

            <form onSubmit={updateProfile} style={{ marginTop: '20px' }}>
                <h3>Cập nhật Thông tin</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tên:</label><br/>
                    <input 
                        type="text"
                        placeholder="Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br/>
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px' }}>
                    💾 Lưu Thay Đổi
                </button>
            </form>
        </div>
    );
};

export default Profile;