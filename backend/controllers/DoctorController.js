// backend/controllers/DoctorController.js

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Notification = require('../models/Notification');
const CallRequest = require('../models/CallRequest');
const Message = require('../models/Message');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Monitor patient health
const monitorPatientHealth = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await Patient.findById(patientId).populate('user');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json({ patient });
    } catch (err) {
        handleError(res, err);
    }
};

// Receive health notifications
const receiveHealthNotifications = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const notifications = await Notification.find({ recipient: doctorId }).populate('patient');
        res.status(200).json({ notifications });
    } catch (err) {
        handleError(res, err);
    }
};

// Accept a call request
const acceptCallRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const callRequest = await CallRequest.findByIdAndUpdate(requestId, { status: 'Accepted' }, { new: true });
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });
        res.status(200).json({ message: 'Call request accepted', callRequest });
    } catch (err) {
        handleError(res, err);
    }
};

// Decline a call request
const declineCallRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const callRequest = await CallRequest.findByIdAndUpdate(requestId, { status: 'Declined' }, { new: true });
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });
        res.status(200).json({ message: 'Call request declined', callRequest });
    } catch (err) {
        handleError(res, err);
    }
};

// Propose a new date for a call
const proposeNewDate = async (req, res) => {
    const { requestId } = req.params;
    const { newDate } = req.body;

    try {
        const callRequest = await CallRequest.findByIdAndUpdate(requestId, { status: 'Rescheduled', requestDate: newDate }, { new: true });
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });
        res.status(200).json({ message: 'Call request rescheduled', callRequest });
    } catch (err) {
        handleError(res, err);
    }
};

// Send a message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
        const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', message: newMessage });
    } catch (err) {
        handleError(res, err);
    }
};

// Receive messages
const receiveMessages = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const messages = await Message.find({ receiver: doctorId }).populate('sender');
        res.status(200).json({ messages });
    } catch (err) {
        handleError(res, err);
    }
};

// Assign a patient to a doctor
const assignPatient = async (req, res) => {
    const { doctorId, patientId } = req.params;

    try {

        const doctor = await Doctor.findById(doctorId);
        const patient = await Patient.findById(patientId);

        if (!doctor || !patient) {
            console.log('Doctor or Patient not found');
            return res.status(404).json({ message: 'Doctor or Patient not found' });
        }

        console.log('Doctor and Patient found');

        // Check if the patient is already assigned to the doctor
        if (doctor.patients.includes(patient._id)) {
            console.log('Patient is already assigned to this doctor');
            return res.status(400).json({ message: 'Patient is already assigned to this doctor' });
        }

        // Assign the patient to the doctor
        doctor.patients.push(patient._id);
        patient.doctors.push(doctor._id);

        await doctor.save();
        await patient.save();

        console.log('Patient assigned to doctor successfully');
        res.status(200).json({ message: 'Patient assigned to doctor successfully' });
    } catch (err) {
        console.error('Error assigning patient:', err);
        handleError(res, err);
    }
};

const assignMultiplePatients = async (req, res) => {
    const { doctorId } = req.params; // The doctor ID
    const { patientIds } = req.body; // Expecting an array of patient IDs

    try {
        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Iterate over the array of patient IDs and assign each one
        for (const patientId of patientIds) {
            const patient = await Patient.findById(patientId);

            if (!patient) {
                console.log(`Patient with ID ${patientId} not found`);
                continue; // Skip this patient if not found
            }

            // Check if the patient is already assigned to the doctor
            if (!doctor.patients.includes(patient._id)) {
                // Assign the patient to the doctor
                doctor.patients.push(patient._id);
                patient.doctors.push(doctor._id);

                // Save the patient and doctor
                await doctor.save();
                await patient.save();
            } else {
                console.log(`Patient ${patientId} is already assigned to this doctor`);
            }
        }

        res.status(200).json({ message: 'Patients assigned to doctor successfully' });
    } catch (err) {
        console.error('Error assigning patients:', err);
        res.status(500).json({ message: 'Error assigning patients', error: err.message });
    }
};

// Remove a patient from a doctor's list
const removePatient = async (req, res) => {
    const { doctorId, patientId } = req.params;

    try {
        const doctor = await Doctor.findOne({ user: doctorId });
        const patient = await Patient.findOne({ user: patientId });

        if (!doctor || !patient) return res.status(404).json({ message: 'Doctor or Patient not found' });

        doctor.patients = doctor.patients.filter(pid => pid.toString() !== patientId);
        patient.doctors = patient.doctors.filter(did => did.toString() !== doctorId);

        await doctor.save();
        await patient.save();

        res.status(200).json({ message: 'Patient removed from doctor successfully' });
    } catch (err) {
        handleError(res, err);
    }
};

// Get all patients of the logged-in doctor
const getDoctorPatients = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId).populate('patients');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const patientsWithDangerLevels = await Promise.all(
            doctor.patients.map(async (patient) => {
                const latestHealthData = patient.healthData[patient.healthData.length - 1];
                let dangerLevel = 'Normal';

                if (latestHealthData) {
                    const { ecg, respiration, pression, temperature } = latestHealthData;

                    if ((ecg < 40 || ecg > 120) || (respiration < 10 || respiration > 30) || (pression < 90 || pression > 180) || (temperature < 35 || temperature > 40)) {
                        dangerLevel = 'Black';
                    } else if ((ecg >= 100 && ecg <= 120) || (respiration >= 10 && respiration < 12) || (pression >= 140 && pression <= 180) || (temperature >= 39 && temperature <= 40)) {
                        dangerLevel = 'Red';
                    } else if ((ecg >= 80 && ecg < 100) || (respiration >= 12 && respiration < 16) || (pression >= 130 && pression < 140) || (temperature >= 37.5 && temperature < 39)) {
                        dangerLevel = 'Orange';
                    }
                }

                return { ...patient.toObject(), dangerLevel }; // Add danger level to the patient object
            })
        );

        res.status(200).json({ patients: patientsWithDangerLevels });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patients', error: err.message });
    }
};


module.exports = {
    monitorPatientHealth,
    receiveHealthNotifications,
    acceptCallRequest,
    declineCallRequest,
    proposeNewDate,
    sendMessage,
    receiveMessages,
    assignPatient,
    removePatient,
    getDoctorPatients,
    assignMultiplePatients
};
