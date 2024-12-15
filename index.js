const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/user');  // ใช้เส้นทางที่ถูกต้อง
const cors = require('cors');  // เพิ่มการ import cors

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// เพิ่มเส้นทางที่ตอบกลับข้อความ "RentEaseAPI" เมื่อเข้าถึง / 
app.get('/', (req, res) => {
    res.send('RentEaseAPI');
});

// ใช้เส้นทาง API user
app.use('/api', userRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
