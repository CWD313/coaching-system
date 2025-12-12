const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('../utils/s3');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});
