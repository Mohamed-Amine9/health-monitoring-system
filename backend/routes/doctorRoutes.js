// backend/routes/doctorRoutes.js

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/DoctorController');
const auth = require('../middlewares/authMiddleware');


router.get('/:doctorId/patients', auth, doctorController.getDoctorPatients);

// Monitor patient health
router.get('/:doctorId/patients/:patientId', doctorController.monitorPatientHealth);

// Receive health notifications
router.get('/:doctorId/notifications', doctorController.receiveHealthNotifications);

// Accept a call request
router.put('/:doctorId/call-requests/:requestId/accept', doctorController.acceptCallRequest);

// Decline a call request
router.put('/:doctorId/call-requests/:requestId/decline', doctorController.declineCallRequest);

// Propose a new date for a call
router.put('/:doctorId/call-requests/:requestId/reschedule', doctorController.proposeNewDate);

// Send a message
router.post('/:doctorId/messages', doctorController.sendMessage);

// Receive messages
router.get('/:doctorId/messages', doctorController.receiveMessages);

// Assign a patient to a doctor
router.post('/assignMultiple/:doctorId', doctorController.assignMultiplePatients);


// Remove a patient from a doctor
router.delete('/:doctorId/patients/:patientId', doctorController.removePatient);




module.exports = router;
