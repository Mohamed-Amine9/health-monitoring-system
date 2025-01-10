// backend/models/CallRequest.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CallRequestSchema = new Schema({
    requestDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined', 'Rescheduled', 'Completed'],
        default: 'Pending'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Assuming Doctor is a User
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',  // Link to the Patient model
        required: true
    },
    callType: {
        type: String,
        enum: ['Audio', 'Video'],
        default: 'Audio'
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    callDuration: {
        type: Number, // Duration in seconds
        default: 0
    }
});

module.exports = mongoose.model('CallRequest', CallRequestSchema);
