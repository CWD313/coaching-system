const Admin = require('../models/Admin');
const client = require('../utils/twilio');

module.exports = async function notifyExpiringAdmins() {
  const now = new Date();

  // Get admins whose plan expires in next 3 days
  const admins = await Admin.find({
    "plan.expiryDate": {
      $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
      $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // next 3 days
    }
  });

  for (let admin of admins) {
    const daysLeft = Math.ceil(
      (admin.plan.expiryDate - now) / (1000 * 60 * 60 * 24)
    );
    
    const message = `Your coaching software plan expires in ${daysLeft} day(s). Please renew to avoid service interruption.`;

    // SMS or WhatsApp
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM,
      to: admin.phone // admin mobile number field
    });

    console.log("Notification sent to:", admin.phone);
  }
};
