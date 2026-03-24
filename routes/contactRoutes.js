const express = require('express');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const Contact = require('../models/contact');
const router = express.Router();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Contact form submission
router.post('/contact', [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('message', 'Message is required').not().isEmpty().trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
        // Save submission to MongoDB using Mongoose model
        const contact = new Contact({
            name,
            email,
            message,
            createdAt: new Date(),
        });

        await contact.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Recommended to use your own email for "from" to avoid spoofing filters
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `New Portfolio Contact: ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error in /contact:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;