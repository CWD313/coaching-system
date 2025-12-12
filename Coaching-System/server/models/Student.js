const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  photoUrl: String,
  class: String,
  parentName: String,
  parentMobile: String,
  address: String,
  admissionDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
