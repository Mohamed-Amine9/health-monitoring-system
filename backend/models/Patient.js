// backend/models/Patient.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HealthDataSchema = new Schema({
    ecg: {
        type: Number,
        required: true
    },
    respiration: {
        type: Number,
        required: true
    },
    pression: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    mouvements: {
        type: Number,
        required: true
    },
    micro: {
        type: Number,
        required: true
    },
    localisation: {
        type: String,
        required: true
    }
});

const PatientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    healthData: [HealthDataSchema],  // Embedded health data schema
    doctors: [{
        type: Schema.Types.ObjectId,
        ref: 'Doctor'  // Array of references to Doctor model
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
