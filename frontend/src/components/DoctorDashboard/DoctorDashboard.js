// src/components/DoctorDashboard/DoctorDashboard.js

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails'; 

const DoctorDashboard = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [view, setView] = useState('patients');

    const renderMainContent = () => {
        switch (view) {
            case 'patients':
                return selectedPatient ? (
                    <PatientDetails patient={selectedPatient} />
                ) : (
                    <PatientList onSelectPatient={setSelectedPatient} />
                );
            default:
                return <PatientList onSelectPatient={setSelectedPatient} />;
        }
    };

    return (
        <div className="doctor-dashboard">
            <Sidebar onMenuSelect={setView} />
            <div className="main-content">
                {renderMainContent()}
            </div>
        </div>
    );
};

export default DoctorDashboard;
