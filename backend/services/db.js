// backend/services/db.js

const mongoose = require('mongoose');  
const config = require('config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'));
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
