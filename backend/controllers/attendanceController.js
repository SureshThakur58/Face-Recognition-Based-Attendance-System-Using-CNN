const db = require("../models/db"); // Ensure correct path to db.js

const getAttendance = async (req, res) => {
    console.log("🔍 Fetching attendance data...");

    const query = `
        SELECT 
            id, 
            roll_number, 
            name, 
            DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') AS date, 
            status 
        FROM attendance
    `;

    try {
        const [results] = await db.query(query);

        console.log("✅ Attendance data fetched:", results);
        res.json({
            message: "Attendance data retrieved successfully",
            data: results
        });

    } catch (err) {
        console.error("❌ Error fetching attendance:", err);
        res.status(500).json({
            message: "Error retrieving attendance data",
            error: err.message
        });
    }
};

module.exports = { getAttendance };
