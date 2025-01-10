// backend/controllers/MessageController.js

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Send a message

const sendMessage = async (req, res) => {
    const { senderId, receiverId, content, attachments = [] } = req.body;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) return res.status(404).json({ message: 'Sender or Receiver not found' });

        const newMessage = new Message({ sender: senderId, receiver: receiverId, content, attachments });
        await newMessage.save();

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: [newMessage._id],
                lastMessage: newMessage._id
            });
        } else {
            conversation.messages.push(newMessage._id);
            conversation.lastMessage = newMessage._id;
            conversation.updatedAt = Date.now();
        }

        await conversation.save();

        // Emit a notification event to the receiver
        const io = req.app.get('socketio');
        io.to(receiverId.toString()).emit('newMessage', { message: newMessage });

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (err) {
        handleError(res, err);
    }
};

// Get messages in a conversation
const getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const conversation = await Conversation.findById(conversationId)
            .populate('messages')
            .populate('participants');

        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        res.status(200).json({ conversation });
    } catch (err) {
        handleError(res, err);
    }
};

// Edit a message
const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.content = newContent;
        await message.save();

        res.status(200).json({ message: 'Message updated successfully', updatedMessage: message });
    } catch (err) {
        handleError(res, err);
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findByIdAndDelete(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        // Optionally, remove the message from the conversation
        await Conversation.updateMany(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    sendMessage,
    getConversationMessages,
    editMessage,
    deleteMessage
};