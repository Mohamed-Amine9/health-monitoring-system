// Import required modules
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const connectDB = require('./services/db');
const cors = require('cors');
require('dotenv').config();

// Import route files
const auth = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const callRoutes = require('./routes/callRoutes'); // Import call routes
const notificationRoutes = require('./routes/notificationRoutes');
const healthMonitor = require('./services/healthMonitor');
const healthMonitorRoutes = require('./routes/healthMonitoringRoutes');
const patientRoutes = require('./routes/patientRoutes');
const { scheduleAggregations } = require('./services/scheduler');
// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Connect to MongoDB
connectDB();


app.set('socketio', io); 


// Start health monitoring service
//healthMonitor.start();


// Start health data aggregation scheduler
scheduleAggregations();

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room for direct communication
    socket.on('join', (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined their room`);
    });

    // Handle call initiation
    socket.on('callUser', (data) => {
        console.log(`Calling user ${data.to}`);
        io.to(data.to).emit('incomingCall', {
            signal: data.signalData,
            from: data.from,
            name: data.name
        });
    });

    // Handle call acceptance
    socket.on('acceptCall', (data) => {
        console.log(`Call accepted by ${data.to}`);
        io.to(data.to).emit('callAccepted', data.signal);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/calls', callRoutes); 
app.use('/api', notificationRoutes);
app.use('/api', healthMonitorRoutes);
app.use('/api/auth',auth);
app.use('/api/patients',patientRoutes)

// Placeholder route for root URL
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥🔥`));
