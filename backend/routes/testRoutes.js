// backend/routes/testRoutes.js

const express = require('express');
const router = express.Router();
const testController = require('../controllers/TestController');

// Route to create a test call request
router.post('/test-call-request', testController.createTestCallRequest);

module.exports = router;
