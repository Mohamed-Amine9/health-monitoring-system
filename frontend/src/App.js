import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';
import AuthPage from './components/Auth/AuthPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            {/* Add more routes as needed */}
        </Routes>
    );
}

export default App;
