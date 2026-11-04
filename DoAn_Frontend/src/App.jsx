import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';

function Dashboard() {
    const [topics, setTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [newTopic, setNewTopic] = useState({ title: '', requiredSkills: '', subjectId: '' });

    const fetchData = () => {
        // Đã sửa lại đường dẫn API lấy danh sách đề tài sang link tunnel mới
        axios.get('https://hoangdemo.onrender.com')
            .then(response => setTopics(response.data))
            .catch(error => console.error('Lỗi:', error));

        // Đã sửa lại đường dẫn API lấy danh sách môn học sang link tunnel mới
        axios.get('https://hoangdemo.onrender.com')
            .then(response => {
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setNewTopic(prev => ({ ...prev, subjectId: response.data[0].SubjectId }));
                }
            })
            .catch(error => console.error('Lỗi:', error));
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [currentUser, navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Hệ Thống Quản Lý Đồ Án</h2>
            <p>Chào mừng, <strong>{currentUser?.FullName}</strong> ({currentUser?.Role === 'teacher' ? 'Giảng viên' : 'Sinh viên'})</p>
            {/* Các thành phần giao diện khác của Dashboard giữ nguyên bên dưới */}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
