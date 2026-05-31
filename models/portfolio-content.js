const mongoose = require('mongoose');

const portfolioContentSchema = new mongoose.Schema({
    hero: {
        greeting: { type: String, default: "Hello, I'm" },
        name: { type: String, default: "Seth Kipchumba Korir" },
        title: { type: String, default: "Full Stack Developer" },
        tagline: { type: String, default: "Building high-performance, scalable web systems with precision and purpose." },
        profilePhoto: { type: String, default: "" }
    },
    about: {
        text: { type: String, default: "Motivated and detail-oriented computer science student with hands-on experience in full-stack web development using the MERN stack." },
        subText: { type: String, default: "My technical journey is driven by solving complex problems with clean and modular code. Working with modern architectures allows me to bridge the gap between robust backend operations and highly interactive user experiences." },
        cards: [{
            title: String,
            desc: String,
            icon: String,
            color: String,
            span: { type: Boolean, default: false }
        }]
    },
    blogPosts: [{
        title: String,
        excerpt: String,
        date: String,
        readTime: String,
        category: String,
        href: String,
        image: String
    }],
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
