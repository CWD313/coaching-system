const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coaching: {
    name: String,
    logoUrl: String,
    address: String,
    contactNumber: String
  },
  plan: {
    status: { type: String, enum: ['inactive','active','past_due'], default: 'inactive' },
    nextBillingDate: Date,
    expiryDate: Date
  },

  createdAt: { type: Date, default: Date.now }
});
AdminSchema.add({
  razorpaySubscriptionId: { type: String, default: null }
});
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
