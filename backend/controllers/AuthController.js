// backend/controllers/AuthController.js

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); // Import your config

const doctorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        if (!user || user.role !== 'Doctor') {
            return res.status(400).json({ message: 'Invalid credentialss' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Find the doctor profile
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) {
            return res.status(400).json({ message: 'Doctor profile not found' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.get('jwtSecret'),
            { expiresIn: config.get('jwtExpiration') }
        );

        res.json({
            token,
            doctor: {
                id: doctor._id,
                name: user.name,
                email: user.email,
                specialization: doctor.specialization,
                patients: doctor.patients,
            },
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { doctorLogin };
