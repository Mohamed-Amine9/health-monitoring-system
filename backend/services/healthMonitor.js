// backend/services/healthMonitor.js

const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');

const createNotification = async (type, content, patient) => {
    try {
        const lastNotification = await Notification.findOne({ patient: patient._id })
            .sort({ createdAt: -1 })
            .exec();

        if (lastNotification && lastNotification.type === type) {
            return; // Skip if the danger level has not changed
        }

        const doctors = await Doctor.find({ _id: { $in: patient.doctors } });

        doctors.forEach(async (doctor) => {
            const newNotification = new Notification({
                type,
                content,
                recipient: doctor._id,
                patient: patient._id,
            });
            await newNotification.save();
        });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

const postSingleHealthData = async (req, res) => {
    const { patientId } = req.params;
    const healthData = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.healthData.push(healthData);  // Add the single health data entry to the healthData array
        await patient.save();

        await checkHealthData();  // Trigger health data check

        res.status(201).json({ message: 'Health data added successfully', patient });
    } catch (err) {
        console.error('Error posting single health data:', err);
        res.status(500).json({ error: err.message });
    }
};



const updatePatientHealthData = async (req, res) => {
    const { patientId } = req.params;
    const updatedHealthData = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.healthData.push(updatedHealthData);  // Push the new entry into the healthData array
        await patient.save(); // Save the updated patient document

        await checkHealthData(); // Trigger health data check

        res.status(200).json({ message: 'Health data updated successfully', patient });
    } catch (err) {
        console.error('Error updating patient health data:', err);
        res.status(500).json({ error: err.message });
    }
};

const checkHealthData = async () => {
    try {
        const patients = await Patient.find().populate('user');

        patients.forEach(patient => {
            if (patient.healthData.length > 0) {
                const latestHealthData = patient.healthData[patient.healthData.length - 1];
                const { ecg, respiration, pression, temperature } = latestHealthData;

                // Black Alert: Critical condition
                if ((ecg < 40 || ecg > 120) || (respiration < 10 || respiration > 30) || (pression < 90 || pression > 180) || (temperature < 35 || temperature > 40)) {
                    createNotification('Black', 'Critical health condition detected!', patient);
                }
                // Red Alert: Severe condition
                else if ((ecg >= 100 && ecg <= 120) || (respiration >= 10 && respiration < 12) || (pression >= 140 && pression <= 180) || (temperature >= 39 && temperature <= 40)) {
                    createNotification('Red', 'Severe health condition detected!', patient);
                }
                // Orange Alert: Warning signs
                else if ((ecg >= 80 && ecg < 100) || (respiration >= 12 && respiration < 16) || (pression >= 130 && pression < 140) || (temperature >= 37.5 && temperature < 39)) {
                    createNotification('Orange', 'Warning: health condition may be deteriorating.', patient);
                }
                // Normal case: No notification needed
                else {
                    console.log(`Patient ${patient.name} has normal health data.`);
                }
            } else {
                console.warn(`Patient ${patient.name} does not have health data.`);
            }
        });
    } catch (error) {
        console.error('Error checking health data:', error);
    }
};

const start = () => {
    setInterval(checkHealthData, 1000); // Run check every second
};

const postMultipleHealthData = async (req, res) => {
    const { patientId } = req.params;
    const healthDataArray = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        healthDataArray.forEach(data => {
            patient.healthData.push(data);
        });

        await patient.save();

        res.status(201).json({ message: 'Health data added successfully', patient });
    } catch (err) {
        console.error('Error posting multiple health data:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { start, updatePatientHealthData, postMultipleHealthData ,postSingleHealthData};
