await sendEmail(
  user.email,
  "Payment Successful",
  `<p>Your subscription is now active till ${expiryDate}.</p>`
);
