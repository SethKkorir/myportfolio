const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB using Mongoose');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = { connectToMongoDB };