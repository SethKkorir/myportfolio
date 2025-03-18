const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongoDB } = require('./models/db');
const contactRoutes = require('./routes/contactRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://sethkorir.netlify.app', 'http:192.168.28.245:5000'], // Allow requests from your frontend and local network
  methods: ['GET', 'POST'],
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

// Use the contactRoutes
app.use('/api', contactRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});