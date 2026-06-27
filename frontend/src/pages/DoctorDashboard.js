import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointments, updateAppointmentStatus } from '../utils/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await getAppointments();
      setAppointments(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    await updateAppointmentStatus(id, status);
    fetchAppointments();
  };

  const today = new Date().toDateString();
  const todayApts = appointments.filter(a => new Date(a.date).toDateString() === today && a.status !== 'cancelled');
  const pending = appointments.filter(a => a.status === 'pending');
  const completed = appointments.filter(a => a.status === 'completed');

  const displayed = activeTab === 'today' ? todayApts : activeTab === 'pending' ? pending : completed;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>{user?.name}'s Dashboard 🩺</h1>
          <p>{user?.specialty} | Manage your patients and appointments</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📅</div>
            <div className="stat-info"><h3>{todayApts.length}</h3><p>Today's Appointments</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">⏳</div>
            <div className="stat-info"><h3>{pending.length}</h3><p>Pending Requests</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info"><h3>{completed.length}</h3><p>Completed</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">👥</div>
            <div className="stat-info"><h3>{appointments.length}</h3><p>Total Patients</p></div>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>Today ({todayApts.length})</button>
            <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending ({pending.length})</button>
            <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Completed ({completed.length})</button>
          </div>

          {loading ? <div className="loading">⏳</div> : displayed.length === 0 ? (
            <div className="empty-state"><div className="icon">📭</div><p>No appointments</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(apt => (
                    <tr key={apt._id}>
                      <td>
                        <div>
                          <strong>{apt.patient?.name}</strong>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{apt.patient?.bloodGroup} | {apt.patient?.phone}</div>
                        </div>
                      </td>
                      <td>
                        <div>{new Date(apt.date).toLocaleDateString('en-PK')}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{apt.timeSlot}</div>
                      </td>
                      <td style={{ maxWidth: 200, fontSize: '0.875rem' }}>{apt.symptoms || '—'}</td>
                      <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => navigate(`/appointment/${apt._id}`)}>View</button>
                          {apt.status === 'pending' && (
                            <button className="btn btn-success" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleStatus(apt._id, 'confirmed')}>Confirm</button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => navigate(`/appointment/${apt._id}`)}>Prescribe</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
