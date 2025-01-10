import React from 'react';

const PatientDetails = ({ patient }) => {
    return (
        <div>
            {/* Detailed information about a patient */}
            <p>Patient Details for {patient.name}</p>
        </div>
    );
};

export default PatientDetails;
