require('dotenv').config(); // Add this to load .env variables

const nodemailer = require('nodemailer');

// Log to check if environment variables are loaded
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email provider like Gmail, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address (use environment variables for security)
        pass: process.env.EMAIL_PASS // Your email password
    }
});

const sendAccountCreationEmail = async (recipientEmail, patientName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Welcome to Our Health Monitoring System',
        text: `Hi ${patientName},\n\nYour account has been created. Please log in to our platform using the credentials you provided.\n\nBest Regards,\nHealth Monitoring Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendAccountCreationEmail };
