const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Test = require('../models/Test');
const Admin = require('../models/Admin');
