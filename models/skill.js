const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String, // Class name for FontAwesome, e.g., "fa-react"
        required: true
    },
    level: {
        type: Number, // 0-100
        required: true
    },
    category: {
        type: String, // "frontend", "backend", "tools"
        default: "frontend"
    }
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
