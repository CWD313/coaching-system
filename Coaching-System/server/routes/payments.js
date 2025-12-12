const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // where your auth is

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.rzp_live_oEf5crjvRsSHWO,
  key_secret: process.env.rzp_live_***********************,
});

// Protected route
router.post('/create-subscription', authMiddleware, async (req, res) => {
  try {
    const { planId } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: null,
      notes: {
        adminId: req.admin._id.toString(),
      },
    });

    // TODO: optionally Admin schema me subscriptionId save karna

    res.status(200).json({
      success: true,
      subscription,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
const crypto = require('crypto');

exports.webhookHandler = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const payload = JSON.parse(req.body);  // raw buffer → JSON

  const event = payload.event;
  const data = payload.payload;

  // Handle events
};
