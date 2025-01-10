// backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Setup storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicates
    }
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/upload', upload.array('attachments', 10), (req, res) => {
    const files = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ files });
});

// Handle file download
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).json({ message: 'File not found' });
        }
    });
});

module.exports = router;
