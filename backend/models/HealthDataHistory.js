// backend/models/HealthDataHistory.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HealthDataHistorySchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    interval: {
        type: String,
        enum: ['hourly', 'halfDay', 'daily', 'weekly', 'monthly'],
        required: true
    },
    averageEcg: {
        type: Number,
        required: true
    },
    averageRespiration: {
        type: Number,
        required: true
    },
    averagePression: {
        type: Number,
        required: true
    },
    averageTemperature: {
        type: Number,
        required: true
    },
    averageMouvements: {
        type: Number,
        required: true
    },
    averageMicro: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HealthDataHistory', HealthDataHistorySchema);
