app.use('/api/uploads', require('./routes/uploads'));
// server.js (या app.js)

// ... other imports ...

const dashboardRoutes = require('./routes/dashboard'); 

// राउटर को /api/dashboard पाथ पर उपयोग करें
app.use('/api/dashboard', dashboardRoutes); 

// ... app.listen ...
app.use('/api/exports', require('./routes/exports'));
require('./cron');
const helmet = require('helmet');
app.use(helmet());
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,                 // 200 requests per IP
  message: "Too many requests, please try again later.",
});

app.use('/api/', limiter);
// ... other code ...
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
const cors = require('cors');

app.use(cors({
  origin: ['https://yourfrontend.com'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
const xss = require('xss-clean');
app.use(xss());