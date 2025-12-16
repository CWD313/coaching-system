const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const cron = require("node-cron");
const notifyExpiring = require("./scripts/notifyexpiring");

// ---------------------- 1. API Routers को आयात करें ----------------------
// सुनिश्चित करें कि ये फ़ाइल पाथ आपके Backend फोल्डर स्ट्रक्चर में सही हों
const userRouter = require("./routes/userRoutes");
const studentRouter = require("./routes/studentRoutes");

const app = express();

// ---------------------- CORS Configuration ----------------------
// Frontend URL को अनुमति दें
app.use(cors({
    origin:'https://coaching-system-pi2m.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
}));

//
// ---------------------- SECURITY MIDDLEWARES ----------------------
// ... बाकी मिडिलवेयर
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
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

// Prevent XSS attacks
app.use(xss());


// ---------------------- 2. JSON Parser जोड़ें ----------------------
// API से आने वाले JSON डेटा को पढ़ने के लिए आवश्यक है
app.use(express.json());


// ---------------------- 3. API ROUTES जोड़ें ----------------------
// /api/users और /api/students जैसे बेस पाथ्स को सेट करता है
app.use("/api/users", userRouter); 
app.use("/api/students", studentRouter);


//
// ---------------------- CRON JOBS ----------------------
//

// Run daily at 8 AM
cron.schedule("0 8 * * *", () => {
    console.log("Running cron: notifying expiring plans...");
    // ensure notifyExpiring is exported correctly if placed in module.exports
    notifyExpiring(); 
});

// OPTIONAL: run once at server start (only if needed)
// notifyExpiring();

//
// ---------------------- EXPORT / START ----------------------
//

module.exports = app; // मान लीजिए कि आप app को export करके किसी दूसरी फ़ाइल में सर्वर स्टार्ट करते हैं


