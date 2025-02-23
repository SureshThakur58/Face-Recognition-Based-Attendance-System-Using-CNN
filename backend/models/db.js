const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test the connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connected to MySQL database");
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error("❌ Error connecting to MySQL database:", error);
    }
})();

module.exports = db;
