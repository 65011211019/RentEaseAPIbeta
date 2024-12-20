const mysql = require('mysql2');

// Setup MySQL Connection Pool
const pool = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: 'x38kHt5rR175qKH.root',
    password: 'KEoUaI1n3KSMnVFG',
    database: 'redb',
    port: 4000,
    ssl: {
        rejectUnauthorized: true // Ensure that the server certificate is verified
    },
    waitForConnections: true,
    connectionLimit: 10, // Maximum number of connections
    queueLimit: 0 // Unlimited query queue
});

// Export promise-based pool for async/await
module.exports = pool.promise();

// Test Database Connection
const testConnection = async () => {
    try {
        const [rows, fields] = await pool.promise().query('SELECT 1');
        console.log('Database connection successful');
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Call the test connection function
testConnection();
