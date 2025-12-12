const { sendEmail } = require("../utils/email");

await sendEmail(
  newUser.email,
  "Welcome to Coaching Management System",
  `<h2>Hello ${newUser.name},</h2> <p>Your account has been created successfully.</p>`
);
