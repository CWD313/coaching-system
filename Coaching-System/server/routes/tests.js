const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TestRecord = require('../models/TestRecord');

// Create test record
router.post('/', auth, async (req, res) => {
  const { student, subject, testDate, totalMarks, obtainedMarks } = req.body;
  if (!student || !subject) return res.status(400).json({ error: 'Missing fields' });
  try {
    const tr = new TestRecord({ admin: req.admin._id, student, subject, testDate, totalMarks, obtainedMarks });
    await tr.save();
    res.json(tr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Student-wise tests
router.get('/student/:id', auth, async (req, res) => {
  try {
    const records = await TestRecord.find({ admin: req.admin._id, student: req.params.id }).sort('-testDate');
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Class-wise results (simple: filter by student class via populate)
router.get('/class/:className', auth, async (req, res) => {
  const cls = req.params.className;
  try {
    const records = await TestRecord.find({ admin: req.admin._id }).populate({ path: 'student', match: { class: cls } }).exec();
    const filtered = records.filter(r => r.student); 
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
