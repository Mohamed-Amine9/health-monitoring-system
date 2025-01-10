// backend/controllers/patientController.js

const User = require('../models/User');
const Patient = require('../models/Patient');
const { sendAccountCreationEmail } = require('../services/emailService'); // Import the email service

// Create a new patient with linked user
const createPatientWithUser = async (req, res) => {
    const { name, email, password, doctorId } = req.body;

    try {
        // First, create the user with role 'Patient'
        const newUser = new User({
            name,
            email,
            password,
            role: 'Patient',
        });

        await newUser.save();

        // Then, create the patient referencing the new user
        const newPatient = new Patient({
            name: newUser.name,
            user: newUser._id,
            doctors: [doctorId] // Assign the doctor to this patient
        });

        await newPatient.save();

        // Send account creation email after patient and user are created successfully
        await sendAccountCreationEmail(email, name);

        res.status(201).json({ message: 'Patient and user created successfully', patient: newPatient });
    } catch (err) {
        console.error('Error creating patient:', err);
        res.status(500).json({ message: 'Failed to create patient' });
    }
};

module.exports = { createPatientWithUser };
