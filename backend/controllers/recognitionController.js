const axios = require("axios");
const db = require("../models/db");

exports.recognizeFace = async (req, res) => {
    try {
        console.log("📸 Calling FastAPI for face recognition...");

        // Call FastAPI for face recognition
        const response = await axios.post("http://localhost:8000/recognize-face");
        let recognizedPerson = response.data.name;

        if (!recognizedPerson || typeof recognizedPerson !== "string") {
            console.error("❌ Invalid response from face recognition API:", response.data);
            return res.status(500).json({ message: "Invalid response from face recognition API." });
        }

        recognizedPerson = recognizedPerson.split("\n").pop().trim();
        recognizedPerson = recognizedPerson.replace(/^recognized:\s*/i, "").trim();

        console.log("🟢 Extracted Name:", recognizedPerson);

        if (!recognizedPerson || recognizedPerson.toLowerCase() === "unknown") {
            console.warn("⚠️ Face not recognized.");
            return res.status(400).json({ message: "Face not recognized. Try again." });
        }

        console.log("🔍 Searching for student in the database...");

        try {
            // Fetch `name` and `roll_number` from the database
            const [rows] = await db.query(
                "SELECT name, roll_number FROM students WHERE LOWER(name) = LOWER(?)",
                [recognizedPerson]
            );

            if (!Array.isArray(rows) || rows.length === 0) {
                console.warn(`⚠️ Student '${recognizedPerson}' not found in the database.`);
                return res.status(404).json({ message: `Student '${recognizedPerson}' not found in the database.` });
            }

            const { name: studentName, roll_number: rollNumber } = rows[0];
            console.log("✅ Student Found:", studentName, "| Roll Number:", rollNumber);

            try {
                // Insert or update attendance record without manually setting the `date` field
                await db.query(
                    `INSERT INTO attendance (roll_number, name, status) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE status = "Present"`,
                    [rollNumber, studentName, "Present"]
                );

                console.log("✅ Attendance updated successfully for:", studentName, "| Roll Number:", rollNumber);
                res.json({
                    message: "Attendance updated successfully",
                    recognizedPerson: studentName,
                    rollNumber: rollNumber
                });

            } catch (attendanceError) {
                console.error("❌ Attendance Update Error:", attendanceError);
                res.status(500).json({ message: "Failed to update attendance", error: attendanceError.message });
            }

        } catch (dbError) {
            console.error("❌ Database Execution Error:", dbError);
            return res.status(500).json({ message: "Database execution failed", error: dbError.message });
        }

    } catch (error) {
        console.error("❌ Error recognizing face:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
