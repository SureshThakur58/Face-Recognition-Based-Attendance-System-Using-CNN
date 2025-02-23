require("dotenv").config();
const db = require("../models/db"); // MySQL database connection
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Temporary storage for OTPs (for small projects, use Redis for large-scale apps)
const otpStorage = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1️⃣ Send OTP to Email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    otpStorage.set(email, { otp, expiresAt });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// 2️⃣ Verify OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const storedData = otpStorage.get(email);
  if (!storedData) return res.status(400).json({ message: "OTP not found, request a new one" });

  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ message: "OTP expired, request a new one" });
  }

  if (storedData.otp !== parseInt(otp)) return res.status(400).json({ message: "Invalid OTP" });

  res.json({ message: "OTP verified successfully" });
};

// 3️⃣ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

  const storedData = otpStorage.get(email);
  if (!storedData) return res.status(400).json({ message: "OTP not found, request a new one" });

  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ message: "OTP expired, request a new one" });
  }

  if (storedData.otp !== parseInt(otp)) return res.status(400).json({ message: "Invalid OTP" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    otpStorage.delete(email); // Remove OTP after successful reset
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};
