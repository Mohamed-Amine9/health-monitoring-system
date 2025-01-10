// backend/services/healthDataAggregator.js

const Patient = require('../models/Patient');
const HealthDataHistory = require('../models/HealthDataHistory');

const aggregateHealthData = async (interval, startDate, endDate) => {
    try {
        const patients = await Patient.find();

        for (const patient of patients) {
            console.log(`Processing patient: ${patient.name}`);

            const healthDataEntries = await Patient.aggregate([
                { $match: { _id: patient._id } },
                { $unwind: '$healthData' },
                {
                    $match: {
                        'healthData.timestamp': { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageEcg: { $avg: '$healthData.ecg' },
                        averageRespiration: { $avg: '$healthData.respiration' },
                        averagePression: { $avg: '$healthData.pression' },
                        averageTemperature: { $avg: '$healthData.temperature' },
                        averageMouvements: { $avg: '$healthData.mouvements' },
                        averageMicro: { $avg: '$healthData.micro' }
                    }
                }
            ]);

            console.log(`Found ${healthDataEntries.length} data entries for patient: ${patient.name}`);

            if (healthDataEntries.length > 0) {
                const healthData = healthDataEntries[0];
                console.log(`Aggregated data for patient: ${patient.name}`, healthData);

                const newHistoryEntry = new HealthDataHistory({
                    patient: patient._id,
                    interval,
                    averageEcg: healthData.averageEcg,
                    averageRespiration: healthData.averageRespiration,
                    averagePression: healthData.averagePression,
                    averageTemperature: healthData.averageTemperature,
                    averageMouvements: healthData.averageMouvements,
                    averageMicro: healthData.averageMicro,
                    startDate,
                    endDate
                });

                await newHistoryEntry.save();
                console.log(`Health data history saved for patient: ${patient.name}`);
            } else {
                console.log(`No health data found for patient: ${patient.name} in the given time range.`);
            }
        }
    } catch (error) {
        console.error('Error aggregating health data:', error);
    }
};


module.exports = { aggregateHealthData };
