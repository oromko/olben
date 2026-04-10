import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Family Medium Clinic</h1>
        <div className="nav-links">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Role: {role}</p>

        <div className="appointments-section">
          <h3>Appointments</h3>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.patient_name}</td>
                    <td>{apt.doctor_name}</td>
                    <td>{new Date(apt.appointment_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${apt.status}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>{apt.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
