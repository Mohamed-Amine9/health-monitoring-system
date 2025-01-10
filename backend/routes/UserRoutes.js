// backend/routes/UserRouter.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Create a new user
router.post('/', userController.createUser);

router.post('/multiple', userController.createMultipleUsers);
// Get all users
router.get('/', userController.getAllUsers);

// Get a user by ID
router.get('/:userId', userController.getUserById);

// Update a user
router.put('/:userId', userController.updateUser);

// Delete a user
router.delete('/:userId', userController.deleteUser);

//create patient data 
router.post('/data', userController.createPatientData);
router.put('/data/:patientId', userController.updatePatientData);
module.exports = router;
