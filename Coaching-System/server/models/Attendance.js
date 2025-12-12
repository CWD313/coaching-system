const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present','absent','holiday','sunday'], required: true },
  createdAt: { type: Date, default: Date.now }
});

AttendanceSchema.index({ admin: 1, student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
