const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // ✅ unique email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    securityQuestions: {
        type: [
            {
                question: {
                    type: String,
                    required: true,
                    trim: true
                },
                answer: {
                    type: String,
                    required: true
                }
            }
        ],
        validate: {
            validator(value) {
                return Array.isArray(value) && value.length === 2;
            },
            message: 'Exactly two security questions are required.'
        }
    },
    weeklyGoalHours: {
        type: Number,
        default: 17,
        min: 1,
        max: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
