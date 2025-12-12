const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance for a date. Body: [{ studentId, status }] with date
router.post('/', auth, async (req, res) => {
  const { date, entries } = req.body;
  if (!date || !Array.isArray(entries)) return res.status(400).json({ error: 'Invalid payload' });
  const d = new Date(date);
  try {
    const bulkOps = entries.map(e => ({
      updateOne: {
        filter: { admin: req.admin._id, student: e.studentId, date: d },
        update: { $set: { status: e.status } },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(bulkOps);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get monthly report for a student
router.get('/student/:id/month/:year/:month', auth, async (req, res) => {
  const { id, year, month } = req.params;
  try {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const records = await Attendance.find({ admin: req.admin._id, student: id, date: { $gte: start, $lt: end } }).sort('date');
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
