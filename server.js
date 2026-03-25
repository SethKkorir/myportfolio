const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { connectToMongoDB } = require('./models/db');
const contactRoutes = require('./routes/contactRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://sethkorir.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000',
    /\.vercel\.app$/ // Allow Vercel preview/production domains
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Set secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Useful for some Vite/CDN setups to avoid CSP issues during testing
}));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register requests per hour
  message: 'Too many auth attempts from this IP, please try again after an hour'
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 5 contact messages per hour
  message: 'Too many messages sent. Please try again later.'
});

app.use(limiter);
app.use('/api/auth', authLimiter);
app.use('/api/contact', contactLimiter);

app.use(bodyParser.json());

// Connect to MongoDB
connectToMongoDB();

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from 'frontend/dist' folder
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Routes
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route to serve the React application or fallback to manual HTML
app.get('*', (req, res) => {
  // Try serving React frontend if built
  const frontendPath = path.join(__dirname, 'frontend/dist', 'index.html');
  const publicPath = path.join(__dirname, 'public', 'index.html');
  
  res.sendFile(frontendPath, (err) => {
    if (err) {
      // Fallback to manual public/index.html
      res.sendFile(publicPath, (err2) => {
        if (err2) {
          res.status(404).send('Frontend not found. Please build the project.');
        }
      });
    }
  });
});

// Export the app for Vercel
module.exports = app;

// Only start the server if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}