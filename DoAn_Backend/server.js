const express = require('express');
const cors = require('cors');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// API: Đăng nhập
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('password', sql.VarChar, password);

        const result = await request.query(`
            SELECT UserId, Username, FullName, Role FROM Users WHERE Username = @username AND PasswordHash = @password
        `);

        if (result.recordset.length > 0) {
            res.json({ success: true, user: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API MỚI: Lấy danh sách Môn học
app.get('/api/subjects', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Subjects');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy môn học' });
    }
});

// API: Lấy danh sách toàn bộ đề tài (Đã thêm JOIN với bảng Subjects)
app.get('/api/topics', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT t.TopicId, t.Title, t.RequiredSkills, t.Status, u.FullName AS InstructorName, s.SubjectName
            FROM Topics t
            LEFT JOIN Users u ON t.InstructorId = u.UserId
            LEFT JOIN Subjects s ON t.SubjectId = s.SubjectId
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy danh sách đề tài' });
    }
});

// API: Thêm đề tài mới (Đã cập nhật thêm SubjectId)
app.post('/api/topics', async (req, res) => {
    try {
        const { title, requiredSkills, instructorId, subjectId } = req.body;

        const request = new sql.Request();
        request.input('title', sql.NVarChar, title);
        request.input('requiredSkills', sql.NVarChar, requiredSkills);
        request.input('instructorId', sql.Int, instructorId);
        request.input('subjectId', sql.Int, subjectId);

        await request.query(`
            INSERT INTO Topics (Title, RequiredSkills, Status, InstructorId, SubjectId)
            VALUES (@title, @requiredSkills, N'Mở đăng ký', @instructorId, @subjectId)
        `);

        res.json({ success: true, message: 'Thêm đề tài thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi thêm đề tài' });
    }
});

// API: Đăng ký đề tài
app.post('/api/register', async (req, res) => {
    try {
        const { topicId, studentId } = req.body;
        const request = new sql.Request();
        request.input('topicId', sql.Int, topicId);
        request.input('studentId', sql.Int, studentId);

        await request.query(`UPDATE Topics SET Status = N'Chờ duyệt' WHERE TopicId = @topicId`);
        await request.query(`INSERT INTO Registrations (TopicId, StudentId, Status) VALUES (@topicId, @studentId, N'Chờ duyệt')`);

        res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi đăng ký' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Backend đang chạy tại port ${PORT}`));