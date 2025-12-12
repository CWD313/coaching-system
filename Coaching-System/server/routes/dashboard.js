// server/routes/dashboard.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 

// अपने Mongoose मॉडल्स को इम्पोर्ट करें (पाथ एडजस्ट करें)
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Test = require('../models/Test');
const User = require('../models/User'); // Admin/User Model