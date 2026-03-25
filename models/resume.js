const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    name: { type: String, default: "Seth Kipchumba Korir" },
    title: { type: String, default: "" },
    summary: { type: String, default: "" },
    contact: {
        email: String,
        phone: String,
        location: String,
        github: String,
        linkedin: String
    },
    experience: [{
        role: String,
        org: String,
        time: String,
        points: [String]
    }],
    education: [{
        degree: String,
        school: String,
        time: String
    }],
    skills: {
        frontend: [String],
        backend: [String],
        tools: [String]
    },
    projects: [{
        name: String,
        tech: String,
        desc: String,
        link: String
    }],
    referees: [{
        name: String,
        role: String,
        org: String,
        contact: String
    }]
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
