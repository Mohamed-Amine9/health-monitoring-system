// backend/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true  // Add an index for faster queries
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Doctor', 'Patient'],  // User roles
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Optional call-related fields
    isOnCall: { 
        type: Boolean,
        default: false 
    },
    currentCall: { 
        type: Schema.Types.ObjectId,
        ref: 'CallRequest',
        default: null
     } // Reference to a CallRequest if needed
});

module.exports = mongoose.model('User', UserSchema);
