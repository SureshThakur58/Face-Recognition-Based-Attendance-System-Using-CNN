import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Exportresult({ mystyle, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paperStyle = {
    padding: "30px 20px",
    width: "350px",
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.8)",
    textAlign: "center",
    position: "relative",
    color: "white",
    ...mystyle,
  };

  const avatarStyle = { backgroundColor: "red", margin: "auto" };
  const closeButtonStyle = { position: "absolute", top: 10, right: 10 };

  const handleExportResult = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/attendance");
      const attendanceData = response.data.data;

      console.log("Fetched Attendance Data:", attendanceData); // Debugging log

      if (!attendanceData || attendanceData.length === 0) {
        alert("No attendance data available to export!");
        return;
      }

      // Create PDF
      const doc = new jsPDF();
      doc.text("Attendance Report", 14, 10);

      // Define Table Headers
      const headers = [["ID", "Roll No", "Name", "Date", "Status"]];

      // Map Data for Table
      const data = attendanceData.map((row, index) => [
        index + 1,
        row.roll_number || "N/A", // Ensure roll number is included
        row.name || "N/A",
        row.date || "N/A", // Ensure readable date
        row.status || "N/A",
      ]);

      // Add Table to PDF
      doc.autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: "grid",
        styles: { fontSize: 10 },
        margin: { top: 10 },
        pageBreak: "auto", // Ensures all rows are included
      });

      // Save PDF
      doc.save("Attendance_Report.pdf");
      alert("Attendance report exported successfully!");
    } catch (error) {
      console.error("Error exporting attendance:", error);
      setError("Failed to export attendance report.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box>
      <Paper elevation={19} style={paperStyle}>
        <IconButton onClick={onClose} style={closeButtonStyle}>
          <CloseIcon color="error" />
        </IconButton>
        <Box align="center">
          <Avatar style={avatarStyle}>
            <PictureAsPdfIcon />
          </Avatar>
          <Typography variant="h5" sx={{ color: "white", ...mystyle }}>
            Export Attendance Report
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "red" }}>{error}</Typography>
        ) : (
          <Typography variant="h6" sx={{ color: "white" }}>
            Click below to download the report.
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "15px" }}
          onClick={handleExportResult}
          disabled={loading}
        >
          DOWNLOAD PDF
        </Button>
      </Paper>
    </Box>
  );
}