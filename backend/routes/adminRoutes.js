// backend/routes/admin.js

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middlewares/authMiddleware');

// Doctor routes
router.post('/doctors', AdminController.createDoctor);
router.get('/doctors', auth,AdminController.getAllDoctors);
router.get('/doctors/:doctorId', AdminController.getDoctorById);
router.put('/doctors/:doctorId', AdminController.updateDoctor);
router.delete('/doctors/:doctorId', AdminController.deleteDoctor);

// Patient routes
router.post('/patients', AdminController.createPatient);
router.post('/patients/multiple', AdminController.createMultiplePatients);
router.get('/patients',auth, AdminController.getAllPatients);
router.get('/patients/:patientId', AdminController.getPatientById);
router.put('/patients/:patientId', AdminController.updatePatient);
router.delete('/patients/:patientId', AdminController.deletePatient);

module.exports = router;
