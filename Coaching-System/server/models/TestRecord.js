const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  testDate: Date,
  totalMarks: Number,
  obtainedMarks: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestRecord', TestSchema);
