const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Joi = require('joi');

const studentSchema = Joi.object({ name: Joi.string().required(), class: Joi.string().allow('', null), parentName: Joi.string().allow('', null), parentMobile: Joi.string().allow('', null), address: Joi.string().allow('', null), admissionDate: Joi.date().allow(null) });

// Create student (limit 100)
router.post('/', auth, async (req, res) => {
  const { error } = studentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    const count = await Student.countDocuments({ admin: req.admin._id });
    if (count >= 100) return res.status(400).json({ error: 'Student limit (100) reached' });
    const s = new Student({ admin: req.admin._id, ...req.body });
    await s.save();
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ admin: req.admin._id }).sort('name');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate({ _id: req.params.id, admin: req.admin._id }, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, admin: req.admin._id });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
