const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "redactor", "moderator", "admin"]
    }
})

const userModel = mongoose.model('users', UserSchema);

module.exports = userModel