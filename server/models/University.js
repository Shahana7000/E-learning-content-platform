const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    logoUrl: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);
