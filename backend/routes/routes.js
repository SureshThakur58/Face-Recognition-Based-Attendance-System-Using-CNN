const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');
const trainController = require('../controllers/trainController');
const recognitionController = require('../controllers/recognitionController');
const signupController = require('../controllers/signupController');
const forgotPasswordController = require("../controllers/forgotPasswordController");
const attendanceController =require('../controllers/attendanceController')

// Login route
router.post('/login', authController.login);

// Signup route
router.post('/signup', signupController.signup);

// Data collection route
router.post('/collect-data', dataController.collectData);

// Train model route
router.post('/train', trainController.trainModel);

// Face recognition route
router.post('/recognize', recognitionController.recognizeFace);



// for forgot password and reset new one
router.post("/send-otp", forgotPasswordController.sendOtp);
router.post("/verify-otp", forgotPasswordController.verifyOtp);
router.post("/reset-password", forgotPasswordController.resetPassword);

// Attendance route
router.get('/attendance', attendanceController.getAttendance);

module.exports = router;
