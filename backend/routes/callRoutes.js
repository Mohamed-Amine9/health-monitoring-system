// backend/routes/callRoutes.js

const express = require('express');
const router = express.Router();
const callController = require('../controllers/CallController');

// Route to initiate a call
router.post('/initiate', callController.initiateCall);

// Patient requests a call
router.post('/request', callController.requestCall);

// Doctor views pending requests
router.get('/pending/:doctorId', callController.viewPendingRequests);

// Doctor accepts or declines a call
router.post('/response', callController.handleCallResponse);

// Start a call
router.put('/start/:requestId', callController.startCall);

// End a call
router.put('/end/:requestId', callController.endCall);

module.exports = router;
