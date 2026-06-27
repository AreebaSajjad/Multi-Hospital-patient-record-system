import React, { useState, useEffect } from 'react';
import { getStats, getHospitals, getDoctors, createHospital, createDoctor } from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({ name: '', address: '', city: '', phone: '', email: '' });
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialty: '', hospital: '', experience: '', fee: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Gynecology', 'General Medicine', 'ENT', 'Ophthalmology', 'Psychiatry'];

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {});
    getHospitals().then(r => setHospitals(r.data));
    getDoctors().then(r => setDoctors(r.data));
  }, []);

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      await createHospital(hospitalForm);
      setSuccess('Hospital added!');
      setShowHospitalForm(false);
      setHospitalForm({ name: '', address: '', city: '', phone: '', email: '' });
      getHospitals().then(r => setHospitals(r.data));
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(doctorForm);
      setSuccess('Doctor added!');
      setShowDoctorForm(false);
      getDoctors().then(r => setDoctors(r.data));
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const statusMap = {};
  stats?.stats?.forEach(s => { statusMap[s._id] = s.count; });

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage hospitals, doctors and monitor the system</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon blue">🏥</div><div className="stat-info"><h3>{stats?.totalHospitals ?? '—'}</h3><p>Hospitals</p></div></div>
          <div className="stat-card"><div className="stat-icon green">👨‍⚕️</div><div className="stat-info"><h3>{stats?.totalDoctors ?? '—'}</h3><p>Doctors</p></div></div>
          <div className="stat-card"><div className="stat-icon yellow">🧑‍🤝‍🧑</div><div className="stat-info"><h3>{stats?.totalPatients ?? '—'}</h3><p>Patients</p></div></div>
          <div className="stat-card"><div className="stat-icon red">✅</div><div className="stat-info"><h3>{statusMap['completed'] ?? 0}</h3><p>Completed Appointments</p></div></div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`} onClick={() => setActiveTab('hospitals')}>Hospitals</button>
          <button className={`tab ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>Doctors</button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid-2">
            <div className="card">
              <h2 className="section-title">Appointment Status</h2>
              {['pending','confirmed','completed','cancelled'].map(s => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className={`badge badge-${s}`}>{s}</span>
                  <strong>{statusMap[s] || 0}</strong>
                </div>
              ))}
            </div>
            <div className="card">
              <h2 className="section-title">Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" onClick={() => { setActiveTab('hospitals'); setShowHospitalForm(true); }}>➕ Add Hospital</button>
                <button className="btn btn-outline" onClick={() => { setActiveTab('doctors'); setShowDoctorForm(true); }}>➕ Add Doctor</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hospitals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button className="btn btn-primary" onClick={() => setShowHospitalForm(!showHospitalForm)}>➕ Add Hospital</button>
            </div>
            {showHospitalForm && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h2 className="section-title">New Hospital</h2>
                <form onSubmit={handleAddHospital}>
                  <div className="form-row">
                    <div className="form-group"><label>Name</label><input value={hospitalForm.name} onChange={e => setHospitalForm({...hospitalForm, name: e.target.value})} required /></div>
                    <div className="form-group"><label>City</label><input value={hospitalForm.city} onChange={e => setHospitalForm({...hospitalForm, city: e.target.value})} required /></div>
                  </div>
                  <div className="form-group"><label>Address</label><input value={hospitalForm.address} onChange={e => setHospitalForm({...hospitalForm, address: e.target.value})} required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Phone</label><input value={hospitalForm.phone} onChange={e => setHospitalForm({...hospitalForm, phone: e.target.value})} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={hospitalForm.email} onChange={e => setHospitalForm({...hospitalForm, email: e.target.value})} required /></div>
                  </div>
                  <button type="submit" className="btn btn-primary">Add Hospital</button>
                </form>
              </div>
            )}
            <div className="table-wrapper card">
              <table>
                <thead><tr><th>Name</th><th>City</th><th>Phone</th><th>Email</th></tr></thead>
                <tbody>
                  {hospitals.map(h => (
                    <tr key={h._id}><td><strong>{h.name}</strong></td><td>{h.city}</td><td>{h.phone}</td><td>{h.email}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button className="btn btn-primary" onClick={() => setShowDoctorForm(!showDoctorForm)}>➕ Add Doctor</button>
            </div>
            {showDoctorForm && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h2 className="section-title">New Doctor</h2>
                <form onSubmit={handleAddDoctor}>
                  <div className="form-row">
                    <div className="form-group"><label>Full Name</label><input value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Password</label><input type="password" value={doctorForm.password} onChange={e => setDoctorForm({...doctorForm, password: e.target.value})} required /></div>
                    <div className="form-group"><label>Specialty</label>
                      <select value={doctorForm.specialty} onChange={e => setDoctorForm({...doctorForm, specialty: e.target.value})}>
                        <option value="">Select</option>
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Hospital</label>
                      <select value={doctorForm.hospital} onChange={e => setDoctorForm({...doctorForm, hospital: e.target.value})}>
                        <option value="">Select Hospital</option>
                        {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label>Experience (years)</label><input type="number" value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label>Consultation Fee (Rs.)</label><input type="number" value={doctorForm.fee} onChange={e => setDoctorForm({...doctorForm, fee: e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary">Add Doctor</button>
                </form>
              </div>
            )}
            <div className="table-wrapper card">
              <table>
                <thead><tr><th>Name</th><th>Specialty</th><th>Hospital</th><th>Fee</th><th>Experience</th></tr></thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d._id}>
                      <td><strong>{d.name}</strong><div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{d.email}</div></td>
                      <td>{d.specialty}</td>
                      <td>{d.hospital?.name || '—'}</td>
                      <td>{d.fee ? `Rs. ${d.fee}` : '—'}</td>
                      <td>{d.experience ? `${d.experience} yrs` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
