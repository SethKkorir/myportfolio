const mongoose = require('mongoose');

const portfolioContentSchema = new mongoose.Schema({
    hero: {
        greeting: { type: String, default: "Hello, I'm" },
        name: { type: String, default: "Seth Kipchumba Korir" },
        tagline: { type: String, default: "Building high-performance, scalable web systems with precision and purpose." }
    },
    about: {
        text: { type: String, default: "Motivated and detail-oriented computer science student with hands-on experience in full-stack web development using the MERN stack." },
        cards: [{
            title: String,
            desc: String,
            icon: String,
            color: String,
            span: { type: Boolean, default: false }
        }]
    },

    testimonials: [{
        name: String,
        role: String,
        text: String
    }],
    contact: {
        phone: { type: String, default: "+254 748 497 623" },
        email: { type: String, default: "zsethkipchumba179@gmail.com" },
        location: { type: String, default: "Bomet, Kenya 20400" }
    },
    socials: [{
        platform: String,
        href: String,
        icon: String
    }]
}, { timestamps: true });

const PortfolioContent = mongoose.model('PortfolioContent', portfolioContentSchema);
module.exports = PortfolioContent;
