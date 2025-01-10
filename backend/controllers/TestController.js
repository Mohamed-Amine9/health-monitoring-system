// backend/controllers/TestController.js

const CallRequest = require('../models/CallRequest');
const User = require('../models/User');
const Patient = require('../models/Patient');

exports.createTestCallRequest = async (req, res) => {
    try {
        const doctor = await User.findOne({ role: 'Doctor' });
        const guardian = await User.findOne({ role: 'Guardian' });
        const patient = await Patient.findOne();

        if (!doctor || !guardian || !patient) {
            return res.status(400).json({ message: 'Doctor, Guardian, or Patient not found' });
        }

        const newCallRequest = new CallRequest({
            doctor: doctor._id,
            guardian: guardian._id,
            patient: patient._id
        });

        await newCallRequest.save();
        res.status(201).json({ message: 'Call request created successfully', callRequest: newCallRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
