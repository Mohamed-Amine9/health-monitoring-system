// backend/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');

// Send a message
router.post('/send', messageController.sendMessage);

// Get messages in a conversation
router.get('/conversation/:conversationId', messageController.getConversationMessages);
// Edit a message
router.put('/edit/:messageId', messageController.editMessage);

// Delete a message
router.delete('/delete/:messageId', messageController.deleteMessage);

module.exports = router;
