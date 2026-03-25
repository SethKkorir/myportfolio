const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
    content: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);
module.exports = CoverLetter;
