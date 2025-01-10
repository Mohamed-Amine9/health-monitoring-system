// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Doctor login route
router.post('/login', AuthController.doctorLogin);

module.exports = router;
