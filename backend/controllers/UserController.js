// backend/controllers/UserController.js

const User = require('../models/User');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Create a new user
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({ name, email, password: hashedPassword, role });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        handleError(res, err);
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        handleError(res, err);
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        handleError(res, err);
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        handleError(res, err);
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
};

const createPatientData = async (req, res) => {
    const { userId, name, healthData } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Proceed with creating the patient if the user exists
        const newPatient = new Patient({
            name,  // Include the name
            user: userId,
            healthData
        });

        await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
    } catch (err) {
        console.error('Error creating patient:', err);
        res.status(500).json({ error: err.message });
    }
};

const updatePatientData = async (req, res) => {
    const { patientId } = req.params;
    const { healthData } = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update the health data
        patient.healthData = healthData;

        await patient.save();
        res.status(200).json({ message: 'Patient data updated successfully', patient });
    } catch (err) {
        console.error('Error updating patient data:', err);
        res.status(500).json({ error: err.message });
    }
};


const createMultipleUsers = async (req, res) => {
    const users = req.body; // Expecting an array of user objects [{name, email, password, role}, ...]

    try {
        // Validate that req.body is an array
        if (!Array.isArray(users)) {
            return res.status(400).json({ message: 'Invalid input. Expecting an array of users.' });
        }

        // Process each user in the array
        const createdUsers = await Promise.all(users.map(async (user) => {
            const { name, email, password, role } = user;

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the new user object
            const newUser = new User({ name, email, password: hashedPassword, role });

            // Save each user to the database
            return await newUser.save();
        }));

        res.status(201).json({ message: 'Users created successfully', users: createdUsers });
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createPatientData,
    updatePatientData,
    createMultipleUsers
};
