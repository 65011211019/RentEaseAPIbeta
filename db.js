const mysql = require('mysql2');

// Setup MySQL Connection (TiDB Database)
const db = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: 'x38kHt5rR175qKH.root',
    password: 'KEoUaI1n3KSMnVFG',
    database: 'redb',
    port: 4000,
    ssl: {
        rejectUnauthorized: true
    }
});

// Test Database Connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database!');
});

// Export the connection object to be used in other files
module.exports = db;
