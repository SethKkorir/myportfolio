const express = require('express');
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
  origin: 'https://sethkorir.netlify.app', // Allow requests from your frontend
  // origin: '*', // Allow all origins for dev/testing if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
}));

// Set secure HTTP headers
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(bodyParser.json());

// Connect to MongoDB
connectToMongoDB();

// Routes
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});