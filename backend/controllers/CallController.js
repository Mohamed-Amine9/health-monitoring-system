// backend/controllers/CallController.js

const CallRequest = require('../models/CallRequest');
const User = require('../models/User');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Initiate a call request
const initiateCall = async (req, res) => {
    const { from, to } = req.body;

    try {
        const caller = await User.findById(from);
        const receiver = await User.findById(to);

        if (!caller || !receiver) return res.status(404).json({ message: 'Caller or Receiver not found' });

        // Ensure correct roles
        if (caller.role !== 'Doctor' || receiver.role !== 'Patient') return res.status(400).json({ message: 'Invalid roles for call initiation' });

        const newCallRequest = new CallRequest({ doctor: from, patient: to, status: 'Pending' });
        await newCallRequest.save();

        // Emit event to notify patient of the call request
        const io = req.app.get('socketio'); // Access Socket.IO instance
        io.to(to).emit('call_request', { message: 'New call request from doctor', callRequest: newCallRequest });

        res.status(201).json({ message: 'Call request sent successfully', callRequest: newCallRequest });
    } catch (err) {
        console.error('Error initiating call:', err);
        handleError(res, err);
    }
};

// Patient requests a call
const requestCall = async (req, res) => {
    const { patientId, doctorId, callType } = req.body;  // Include callType in the request

    try {
        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);

        if (!patient || !doctor) return res.status(404).json({ message: 'Doctor or Patient not found' });
        if (patient.role !== 'Patient' || doctor.role !== 'Doctor') {
            return res.status(400).json({ message: 'Invalid roles' });
        }

        // Validate callType
        if (!['Voice', 'Video'].includes(callType)) {
            return res.status(400).json({ message: 'Invalid call type' });
        }

        // Check for existing pending requests from the patient to this doctor
        const existingRequest = await CallRequest.findOne({ patient: patientId, doctor: doctorId, status: 'Pending' });
        if (existingRequest) return res.status(400).json({ message: 'You already have a pending request' });

        const newCallRequest = new CallRequest({ doctor: doctorId, patient: patientId, status: 'Pending', callType });
        await newCallRequest.save();

        res.status(201).json({ message: 'Call request sent to doctor', callRequest: newCallRequest });
    } catch (err) {
        console.error('Error requesting call:', err);
        handleError(res, err);
    }
};

// Doctor views pending requests
const viewPendingRequests = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(404).json({ message: 'Doctor not found or invalid role' });
        }

        const pendingRequests = await CallRequest.find({ doctor: doctorId, status: 'Pending' }).populate('patient');
        res.status(200).json({ pendingRequests });
    } catch (err) {
        console.error('Error viewing pending requests:', err);
        handleError(res, err);
    }
};

// Doctor accepts or declines a call request
// Handle call response (Accept/Decline)
const handleCallResponse = async (req, res) => {
    const { requestId, status } = req.body; // Status can be "Accepted" or "Declined"

    try {
        const callRequest = await CallRequest.findByIdAndUpdate(requestId, { status }, { new: true });
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });

        // Emit event to notify patient of the response
        const io = req.app.get('socketio'); // Access Socket.IO instance
        io.to(callRequest.patient).emit('call_response', { message: `Call request ${status}`, callRequest });

        res.status(200).json({ message: `Call request ${status}`, callRequest });
    } catch (err) {
        console.error('Error handling call response:', err);
        handleError(res, err);
    }
};
// Start a call
const startCall = async (req, res) => {
    const { requestId } = req.params;

    try {
        const callRequest = await CallRequest.findById(requestId);
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });

        // Update the call start time and status
        callRequest.startTime = Date.now();
        callRequest.status = 'Accepted';
        await callRequest.save();

        res.status(200).json({ message: 'Call started', callRequest });
    } catch (err) {
        console.error('Error starting call:', err);
        handleError(res, err);
    }
};

// End a call
const endCall = async (req, res) => {
    const { requestId } = req.params;

    try {
        const callRequest = await CallRequest.findById(requestId);
        if (!callRequest) return res.status(404).json({ message: 'Call request not found' });

        // Update the call end time and calculate duration
        callRequest.endTime = Date.now();
        callRequest.status = 'Completed';

        // Calculate call duration in seconds
        const duration = (callRequest.endTime - callRequest.startTime) / 1000;
        callRequest.callDuration = duration;

        await callRequest.save();

        res.status(200).json({ message: 'Call ended', callRequest });
    } catch (err) {
        console.error('Error ending call:', err);
        handleError(res, err);
    }
};

// Existing functions...

module.exports = {
    initiateCall,
    requestCall,
    viewPendingRequests,
    handleCallResponse,
    startCall,
    endCall
};
