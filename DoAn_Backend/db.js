const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost',
    port: 1433, // Đi thẳng vào cổng TCP 1433 vừa mở
    database: process.env.DB_NAME,
    options: {
        // Đã xóa dòng instanceName
        encrypt: false,
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('✅ Đã kết nối thành công tới SQL Server!');
    } catch (err) {
        console.error('❌ Lỗi kết nối cơ sở dữ liệu:', err);
    }
};

module.exports = { sql, connectDB };