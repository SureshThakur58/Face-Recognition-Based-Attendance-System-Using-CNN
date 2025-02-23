import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CloseIcon from "@mui/icons-material/Close";

export default function ViewAttendance({ mystyle, onClose }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paperStyle = {
    padding: "30px 20px",
    width: "90%",
    maxWidth: "600px",
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    boxShadow: "0px 4px 10px rgba(0, 128, 255, 0.8)",
    textAlign: "center",
    position: "relative",
    color: "white",
    ...mystyle,
  };

  const avatarStyle = { backgroundColor: "#2196F3", margin: "auto" };
  const closeButtonStyle = { position: "absolute", top: 10, right: 10 };

  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching attendance records...");
      const response = await axios.get("http://localhost:5000/api/attendance");
      console.log("API Response:", response.data);

      if (Array.isArray(response.data.data)) {
        setAttendanceRecords(response.data.data);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setError(error.response?.data?.message || "Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  // Calculate total number of present students
  const presentCount = attendanceRecords.filter(record => record.status === "Present").length;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={19} style={paperStyle}>
        <IconButton onClick={onClose} style={closeButtonStyle}>
          <CloseIcon color="error" />
        </IconButton>
        <Box align="center">
          <Avatar style={avatarStyle}>
            <EventAvailableIcon />
          </Avatar>
          <Typography variant="h5" sx={{ color: "white" }}>
            Attendance Details
          </Typography>
          <Typography variant="h6" sx={{ color: "#4CAF50", marginTop: "10px" }}>
            Total Attendance: {presentCount} Present
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "red", mt: 2 }}>{error}</Typography>
        ) : attendanceRecords.length === 0 ? (
          <Typography sx={{ color: "white", mt: 2 }}>No attendance records found.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: "#1a1a1a" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Roll No</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "white" }}>{record.roll_number}</TableCell>
                    <TableCell sx={{ color: "white" }}>{record.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{record.date}</TableCell>
                    <TableCell sx={{ color: "white" }}>{record.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "15px" }}
          onClick={fetchAttendanceRecords}
        >
          REFRESH
        </Button>
      </Paper>
    </Box>
  );
}