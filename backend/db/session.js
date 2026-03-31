const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    timeSpent: {
        type: Number,
        required: true,
        min: 0
    },
    recentQuestion: {
        type: String,
        default: ''
    },
    preview: {
        type: String,
        default: ''
    }
}, { timestamps: true });

sessionSchema.index({ user: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);
