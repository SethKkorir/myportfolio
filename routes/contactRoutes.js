const express = require('express');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Contact form submission
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await client.connect();
        const db = client.db('portfolio');
        const collection = db.collection('contacts');

        // Save submission to MongoDB
        await collection.insertOne({
            name,
            email,
            message,
            createdAt: new Date(),
        });

        // Send email
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    } finally {
        await client.close();
    }
});

module.exports = router;