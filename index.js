const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/user');  // ใช้เส้นทางที่ถูกต้อง
const cors = require('cors');  // เพิ่มการ import cors


app.use(cors());

// Import the database connection
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use('/api', userRoutes);


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
