// backend/models/Notification.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    type: {
        type: String,
        enum: ['Orange', 'Red', 'Black'],  // Danger levels
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model (e.g., Doctor)
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',  // Reference to the Patient model
        required: true
    },
    doctors: [{
        type: Schema.Types.ObjectId,
        ref: 'Doctor',  // Array of references to Doctor model
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false  // Indicates if the notification has been read
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
