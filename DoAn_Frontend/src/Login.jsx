import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (username === '' || password === '') {
            alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            return;
        }

        try {
            // Đã sửa lại đúng đường dẫn API Đăng nhập
            const response = await axios.post('https://hoangdemo.onrender.com/api/login', {
                username: username,
                password: password
            });

            if (response.data.success) {
                alert(`Chào mừng ${response.data.user.FullName} (${response.data.user.Role})`);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Sai tên đăng nhập hoặc mật khẩu!');
            } else {
                alert('Lỗi kết nối đến máy chủ!');
                console.error(error);
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>Hệ thống Quản lý Đồ án</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập..."
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' }}
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;