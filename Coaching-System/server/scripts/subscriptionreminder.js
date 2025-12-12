const cron = require("node-cron");
const User = require("../models/user");
const { sendEmail } = require("../utils/email");

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Cron: Checking expiring subscriptions...");

    const today = new Date();
    const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Only users with a valid expiry date
    const users = await User.find({
      planExpiry: { $exists: true, $ne: null, $lte: twoDaysLater }
    });

    for (const user of users) {
      await sendEmail(
        user.email,
        "Subscription Expiry Reminder",
        `<p>Your plan will expire soon. Please renew to continue uninterrupted service.</p>`
      );

      console.log(`Reminder sent to: ${user.email}`);
    }

    console.log("Cron: Finished processing.");
  } catch (err) {
    console.error("Cron Error:", err);
  }
});
