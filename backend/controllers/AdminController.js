// backend/controllers/AdminController.js

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Create a new doctor
const createDoctor = async (req, res) => {
    const { userId, specialization } = req.body;

    try {
        console.log('User ID:', userId); // Log the userId for debugging
        const user = await User.findById(userId);
        console.log('User:', user); // Log the user to see if it's found

        if (!user) return res.status(404).json({ message: 'User not found' });

        const doctor = new Doctor({ user: userId, specialization });
        await doctor.save();

        res.status(201).json({ message: 'Doctor created successfully', doctor });
    } catch (err) {
        handleError(res, err);
    }
};


// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user');
        res.status(200).json({ doctors });
    } catch (err) {
        handleError(res, err);
    }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId).populate('user');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        res.status(200).json({ doctor });
    } catch (err) {
        handleError(res, err);
    }
};

// Update a doctor
const updateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const { specialization } = req.body;

    try {
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { specialization }, { new: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        res.status(200).json({ message: 'Doctor updated successfully', doctor });
    } catch (err) {
        handleError(res, err);
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findByIdAndDelete(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
};

// Create a new patient
const createPatient = async (req, res) => {
    const { userId, name } = req.body;
    console.log(userId)
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const patient = new Patient({ user: userId, name });
        await patient.save();

        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (err) {
        handleError(res, err);
    }
};

const createMultiplePatients = async (req, res) => {
    const patients = req.body; // Expecting an array of patient objects [{userId, name}, ...]

    try {
        // Validate that req.body is an array
        if (!Array.isArray(patients)) {
            return res.status(400).json({ message: 'Invalid input. Expecting an array of patients.' });
        }

        // Process each patient in the array
        const createdPatients = await Promise.all(patients.map(async (patient) => {
            const { userId, name } = patient;

            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            // Create the new patient object
            const newPatient = new Patient({ user: userId, name });

            // Save each patient to the database
            return await newPatient.save();
        }));

        res.status(201).json({ message: 'Patients created successfully', patients: createdPatients });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all patients
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('user');
        res.status(200).json({ patients });
    } catch (err) {
        handleError(res, err);
    }
};

// Get a single patient by ID
const getPatientById = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await Patient.findById(patientId).populate('user');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ patient });
    } catch (err) {
        handleError(res, err);
    }
};

// Update a patient
const updatePatient = async (req, res) => {
    const { patientId } = req.params;
    const { name } = req.body;

    try {
        const patient = await Patient.findByIdAndUpdate(patientId, { name }, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ message: 'Patient updated successfully', patient });
    } catch (err) {
        handleError(res, err);
    }
};

// Delete a patient
const deletePatient = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await Patient.findByIdAndDelete(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    createMultiplePatients
};
