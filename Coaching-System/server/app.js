const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cron = require("node-cron");
module.exports = () => {
  console.log("Notify Expiring Running...");
  // आपका logic
};
const notifyExpiring = require("./scripts/notifyexpiring");

const app = express();

//
// ---------------------- SECURITY MIDDLEWARES ----------------------
//

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests, please try again later.",
});

// Apply rate-limit for /api
app.use("/api", apiLimiter);

// Helmet for security
app.use(
  helmet({
    contentSecurityPolicy: false,   // Disable if using inline scripts (optional)
    crossOriginEmbedderPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

//
// ---------------------- CRON JOBS ----------------------
//

// Run daily at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("Running cron: notifying expiring plans...");
  notifyExpiring();
});

// OPTIONAL: run once at server start (only if needed)
// notifyExpiring();

//
// ---------------------- EXPORT / START ----------------------
//

