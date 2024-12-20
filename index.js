const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/user');  // ใช้เส้นทางที่ถูกต้อง
const categoryRoutes = require('./api/category');
const productRoutes = require('./api/Product');
const productImageRouter = require('./api/ProductImage');
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

// ใช้เส้นทาง API ที่มี Prefix ต่างกันสำหรับแต่ละส่วน
app.use('/api/user', userRoutes); // ใช้เส้นทางสำหรับ user
app.use('/api/category', categoryRoutes); // ใช้เส้นทางสำหรับ category
app.use('/api/product', productRoutes); // ใช้เส้นทางสำหรับ product
app.use('/api/product-image', productImageRouter); // ใช้เส้นทางสำหรับ product-image

// เพิ่มการจัดการข้อผิดพลาด
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
