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
        // Đã sửa lại đúng đường dẫn API Lấy danh sách đề tài
        axios.get('https://brave-zebras-feel.loca.lt/api/topics')
            .then(response => setTopics(response.data))
            .catch(error => console.error("Lỗi:", error));

        // Đã sửa lại đúng đường dẫn API Lấy danh sách môn học
        axios.get('https://brave-zebras-feel.loca.lt/api/subjects')
            .then(response => {
                setSubjects(response.data);
                if(response.data.length > 0) {
                    setNewTopic(prev => ({...prev, subjectId: response.data[0].SubjectId}));
                }
            })
            .catch(error => console.error("Lỗi:", error));
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate, currentUser]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (newTopic.title === '' || newTopic.requiredSkills === '') {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }
        try {
            // Đã sửa lại đúng đường dẫn API Thêm đề tài
            const response = await axios.post('https://brave-zebras-feel.loca.lt/api/topics', {
                title: newTopic.title,
                requiredSkills: newTopic.requiredSkills,
                subjectId: newTopic.subjectId,
                instructorId: currentUser.UserId
            });
            if (response.data.success) {
                alert("Thêm đề tài thành công!");
                setNewTopic({ ...newTopic, title: '', requiredSkills: '' });
                fetchData();
            }
        } catch (error) {
            alert("Lỗi khi thêm đề tài!");
        }
    };

    const handleRegister = async (topicId) => {
        try {
            // Đã sửa lại đúng đường dẫn API Đăng ký đề tài
            const response = await axios.post('https://brave-zebras-feel.loca.lt/api/register', {
                topicId: topicId,
                studentId: currentUser.UserId
            });
            if (response.data.success) {
                alert("Đăng ký thành công! Đề tài đang được chờ duyệt.");
                fetchData();
            }
        } catch (error) {
            alert("Lỗi khi đăng ký đề tài!");
        }
    };

    if (!currentUser) return null;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ color: '#2c3e50', margin: 0 }}>Danh sách Đề tài Đồ án</h2>
                    <p style={{ color: '#7f8c8d', marginTop: '5px' }}>Xin chào, <strong>{currentUser.FullName}</strong> ({currentUser.Role})</p>
                </div>
                <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</button>
            </div>

            {currentUser.Role === 'GiangVien' && (
                <div style={{ backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#34495e' }}>Đăng ký đề tài mới</h3>
                    <form onSubmit={handleAddTopic} style={{ display: 'flex', gap: '10px' }}>
                        <select
                            value={newTopic.subjectId}
                            onChange={e => setNewTopic({...newTopic, subjectId: e.target.value})}
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {subjects.map(sub => (
                                <option key={sub.SubjectId} value={sub.SubjectId}>{sub.SubjectName}</option>
                            ))}
                        </select>
                        <input
                            type="text" placeholder="Tên đề tài..." value={newTopic.title}
                            onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                            style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="text" placeholder="Kỹ năng yêu cầu..." value={newTopic.requiredSkills}
                            onChange={e => setNewTopic({...newTopic, requiredSkills: e.target.value})}
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm</button>
                    </form>
                </div>
            )}

            <table border="1" cellPadding="12" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left', backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
                <tr>
                    <th>Mã</th>
                    <th>Môn Học</th>
                    <th>Tên Đề Tài</th>
                    <th>Kỹ Năng Yêu Cầu</th>
                    <th>Trạng Thái</th>
                    <th>Giảng Viên</th>
                    {currentUser.Role === 'SinhVien' && <th>Thao Tác</th>}
                </tr>
                </thead>
                <tbody>
                {topics.map(topic => (
                    <tr key={topic.TopicId} style={{ borderBottom: '1px solid #ddd' }}>
                        <td>{topic.TopicId}</td>
                        <td style={{ color: '#2980b9', fontWeight: 'bold' }}>{topic.SubjectName}</td>
                        <td style={{ fontWeight: 'bold' }}>{topic.Title}</td>
                        <td>{topic.RequiredSkills}</td>
                        <td><span style={{ backgroundColor: topic.Status === 'Mở đăng ký' ? '#2ecc71' : '#f39c12', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>{topic.Status}</span></td>
                        <td>{topic.InstructorName}</td>
                        {currentUser.Role === 'SinhVien' && (
                            <td>
                                {topic.Status === 'Mở đăng ký' ? (
                                    <button onClick={() => handleRegister(topic.TopicId)} style={{ padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Đăng ký</button>
                                ) : (
                                    <span style={{ color: '#95a5a6', fontStyle: 'italic', fontSize: '14px' }}>Đã có người ĐK</span>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;