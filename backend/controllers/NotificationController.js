// backend/controllers/NotificationController.js

const Notification = require('../models/Notification');
const User = require('../models/User');
const Patient = require('../models/Patient');
const handleError = (res, err) => res.status(500).json({ error: err.message });

// Create a notification
const createNotification = async (req, res) => {
    const { type, content, recipientId, patientId } = req.body;

    try {
        const recipient = await User.findById(recipientId);
        const patient = await Patient.findById(patientId);

        if (!recipient || !patient) {
            return res.status(404).json({ message: 'Recipient or Patient not found' });
        }

        const newNotification = new Notification({
            type,
            content,
            recipient: recipientId,
            patient: patientId,
        });

        await newNotification.save();

        res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
    } catch (err) {
        handleError(res, err);
    }
};



const getNotifications = async (req, res) => {
    const { recipientId } = req.params;
    const { type } = req.query;  // Optional filter by type

    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

        const query = { recipient: recipientId };
        if (type) {
            query.type = type;
        }

        const notifications = await Notification.find(query).populate('patient');

        res.status(200).json({ notifications });
    } catch (err) {
        handleError(res, err);
    }
};



const markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};
