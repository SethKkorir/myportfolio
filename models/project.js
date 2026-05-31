const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: [String],
    category: {
        type: String,
        default: 'Fullstack'
    },
    image: String,
    demoLink: String,
    githubLink: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
