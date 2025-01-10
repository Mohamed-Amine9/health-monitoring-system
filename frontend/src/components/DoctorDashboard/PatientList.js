import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Notification CSS

const PatientList = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortType, setSortType] = useState('name');
    const [newPatient, setNewPatient] = useState({ name: '', email: '', password: '' });
    const [showModal, setShowModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // For loading state during adding

    useEffect(() => {
        fetchPatients();

        const intervalId = setInterval(() => {
            fetchPatients();
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const doctorId = localStorage.getItem('doctorId');

            if (!doctorId) {
                setError('Doctor ID is missing from localStorage.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/doctors/${doctorId}/patients`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setPatients(response.data.patients);
            setLoading(false);
        } catch (err) {
            setError('Failed to load patients');
            setLoading(false);
        }
    };

    const getDangerColor = (dangerLevel = 'normal') => {
        switch (dangerLevel.toLowerCase()) {
            case 'red':
                return 'danger-red';
            case 'orange':
                return 'danger-orange';
            case 'black':
                return 'danger-black';
            case 'normal':
            default:
                return 'danger-normal';
        }
    };

    const getDangerLabel = (dangerLevel = 'normal') => {
        switch (dangerLevel.toLowerCase()) {
            case 'red':
                return 'Critical';
            case 'orange':
                return 'At Risk';
            case 'black':
                return 'Life-threatening';
            case 'normal':
            default:
                return 'Stable';
        }
    };

    const sortPatients = (patients) => {
        if (sortType === 'name') {
            return [...patients].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'dangerLevel') {
            const dangerOrder = { 'black': 3, 'red': 2, 'orange': 1, 'normal': 0 };
            return [...patients].sort((a, b) => {
                const dangerLevelA = a.dangerLevel ? a.dangerLevel.toLowerCase() : 'normal';
                const dangerLevelB = b.dangerLevel ? b.dangerLevel.toLowerCase() : 'normal';
                return dangerOrder[dangerLevelB] - dangerOrder[dangerLevelA];
            });
        }
        return patients;
    };

    const handleSortChange = (type) => {
        setSortType(type);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAddPatient = async () => {
        setIsAdding(true); // Start loading

        try {
            const token = localStorage.getItem('token');
            const doctorId = localStorage.getItem('doctorId');

            const response = await axios.post(
                'http://localhost:5000/api/patients/create',
                {
                    name: newPatient.name,
                    email: newPatient.email,
                    password: newPatient.password,
                    doctorId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Add the new patient to the list
            setPatients([...patients, response.data.patient]);
            setNewPatient({ name: '', email: '', password: '' }); // Clear the form
            toggleModal(); // Close the modal

            // Show success notification
            toast.success('Patient added successfully!');
        } catch (error) {
            console.error('Error adding new patient:', error);
            toast.error('Error adding patient.');
        } finally {
            setIsAdding(false); // End loading
        }
    };

    if (loading) return <p>Loading patients...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container-fluid patient-list-container">
            <ToastContainer /> {/* Toast notification container */}

            <h2 className="text-center mb-4">Patients</h2>

            <div className="d-flex justify-content-between mb-4">
                <div>
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <FontAwesomeIcon icon={faSort} className="me-2" />
                        Sort by
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => handleSortChange('name')}>Name</button></li>
                        <li><button className="dropdown-item" onClick={() => handleSortChange('dangerLevel')}>Danger Level</button></li>
                    </ul>
                </div>

                <div>
                    <button className="btn btn-success" onClick={toggleModal}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add Patient
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <table className="table table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortPatients(patients).map((patient, index) => (
                                <tr
                                    key={patient._id}
                                    className={getDangerColor(patient.dangerLevel)}
                                    onClick={() => onSelectPatient(patient)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <th scope="row">{index + 1}</th>
                                    <td>{patient.name}</td>
                                    <td>{getDangerLabel(patient.dangerLevel)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for adding a new patient */}
            {showModal && (
                <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Patient</h5>
                                <button type="button" className="close" onClick={toggleModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Patient Name"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    placeholder="Patient Email"
                                    value={newPatient.email}
                                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                />
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={newPatient.password}
                                    onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddPatient} disabled={isAdding}>
                                    {isAdding ? 'Adding...' : 'Add Patient'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientList;
