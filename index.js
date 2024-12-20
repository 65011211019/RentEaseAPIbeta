const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/user');
const categoryRoutes = require('./api/category');
const productRoutes = require('./api/Product');  // ใช้เส้นทางที่ถูกต้อง
const productImageRoutes = require('./api/ProductImage');
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
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', productImageRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});