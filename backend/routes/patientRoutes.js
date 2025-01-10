// backend/routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middlewares/authMiddleware');

router.post('/create', auth, patientController.createPatientWithUser);

module.exports = router;
