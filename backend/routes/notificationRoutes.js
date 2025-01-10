// backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');

// Create a notification
router.post('/notifications', notificationController.createNotification);

// Get notifications for a recipient (doctor)
router.get('/notifications/:recipientId', notificationController.getNotifications);

// Mark a notification as read
router.put('/notifications/:notificationId/read', notificationController.markAsRead);

module.exports = router;
