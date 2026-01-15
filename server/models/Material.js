const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['question_paper', 'notes', 'video', 'important_questions', 'learning_link'],
        required: true
    },
    link: {
        type: String,
        required: true
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    course: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: false // Optional for flexibility
    },
    subject: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
