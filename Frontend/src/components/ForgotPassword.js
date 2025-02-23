import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Verify OTP, 3: Reset Password

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email });
      alert("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      alert("OTP verified.");
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
        await axios.post("http://localhost:5000/api/reset-password", { email, otp, newPassword });
      alert("Password reset successfully.");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <Box>
      <Paper elevation={10} style={{ padding: 20, width: 350, margin: "20px auto", textAlign: "center" }}>
        <Typography variant="h5">Forgot Password</Typography>

        {step === 1 && (
          <>
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={sendOtp}>
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField label="Enter OTP" fullWidth margin="normal" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={verifyOtp}>
              Verify OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button variant="contained" color="success" fullWidth onClick={resetPassword}>
              Reset Password
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
