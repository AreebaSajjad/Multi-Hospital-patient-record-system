import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointment, addPrescription, addLabResult } from '../utils/api';

const AppointmentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [prescription, setPrescription] = useState({ diagnosis: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }], advice: '', followUpDate: '' });
  const [labResult, setLabResult] = useState({ testName: '', result: '', unit: '', normalRange: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAppointment(id).then(r => { setAppointment(r.data); setLoading(false); });
  }, [id]);

  const handleAddMedicine = () => {
    setPrescription({ ...prescription, medicines: [...prescription.medicines, { name: '', dosage: '', duration: '', instructions: '' }] });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescription.medicines];
    updated[index][field] = value;
    setPrescription({ ...prescription, medicines: updated });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    await addPrescription(id, prescription);
    setSuccess('Prescription added!');
    getAppointment(id).then(r => setAppointment(r.data));
  };

  const handleLabSubmit = async (e) => {
    e.preventDefault();
    await addLabResult(id, labResult);
    setSuccess('Lab result added!');
    setLabResult({ testName: '', result: '', unit: '', normalRange: '' });
    getAppointment(id).then(r => setAppointment(r.data));
  };

  if (loading) return <div className="loading">⏳</div>;
  if (!appointment) return <div className="container"><p>Appointment not found</p></div>;

  const { patient, doctor, hospital, date, timeSlot, status, symptoms, prescription: rx, labResults } = appointment;

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
          <h1>Appointment Details</h1>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Appointment Header */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className={`badge badge-${status}`} style={{ marginBottom: 8, display: 'inline-block' }}>{status}</span>
              <h2>{doctor?.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{doctor?.specialty} | {hospital?.name}</p>
              <p style={{ marginTop: 6 }}>📅 {new Date(date).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {timeSlot}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Patient</p>
              <h3>{patient?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{patient?.bloodGroup} | {patient?.phone}</p>
            </div>
          </div>
          {symptoms && (
            <div style={{ marginTop: 16, padding: 14, background: 'var(--darker)', borderRadius: 8 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Symptoms</p>
              <p>{symptoms}</p>
            </div>
          )}
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Patient Info</button>
          <button className={`tab ${activeTab === 'prescription' ? 'active' : ''}`} onClick={() => setActiveTab('prescription')}>Prescription</button>
          <button className={`tab ${activeTab === 'lab' ? 'active' : ''}`} onClick={() => setActiveTab('lab')}>Lab Results</button>
        </div>

        {activeTab === 'details' && (
          <div className="card">
            <h2 className="section-title">Patient Information</h2>
            <div className="grid-2">
              {[['Name', patient?.name], ['Email', patient?.email], ['Phone', patient?.phone], ['Blood Group', patient?.bloodGroup], ['Gender', patient?.gender], ['Address', patient?.address]].map(([label, val]) => (
                <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</p>
                  <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{val || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prescription' && (
          <div>
            {rx?.diagnosis ? (
              <div className="prescription-box">
                <h2 style={{ marginBottom: 16 }}>📋 Prescription</h2>
                <div style={{ marginBottom: 12 }}><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Diagnosis</p><p style={{ fontWeight: 600 }}>{rx.diagnosis}</p></div>
                <h3 style={{ marginBottom: 12 }}>Medicines</h3>
                {rx.medicines?.map((m, i) => (
                  <div key={i} className="medicine-item">
                    <div>
                      <strong>{m.name}</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.dosage} | {m.duration}</p>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.instructions}</div>
                  </div>
                ))}
                {rx.advice && <div style={{ marginTop: 12 }}><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Doctor's Advice</p><p>{rx.advice}</p></div>}
                {rx.followUpDate && <div style={{ marginTop: 12 }}><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Follow-up Date</p><p>{new Date(rx.followUpDate).toLocaleDateString('en-PK')}</p></div>}
              </div>
            ) : user?.role === 'doctor' ? (
              <div className="card">
                <h2 className="section-title">Write Prescription</h2>
                <form onSubmit={handlePrescriptionSubmit}>
                  <div className="form-group"><label>Diagnosis</label><textarea value={prescription.diagnosis} onChange={e => setPrescription({...prescription, diagnosis: e.target.value})} required /></div>
                  <h3 style={{ marginBottom: 12 }}>Medicines</h3>
                  {prescription.medicines.map((m, i) => (
                    <div key={i} style={{ padding: 14, background: 'var(--darker)', borderRadius: 10, marginBottom: 12 }}>
                      <div className="form-row">
                        <div className="form-group"><label>Medicine Name</label><input value={m.name} onChange={e => handleMedicineChange(i, 'name', e.target.value)} /></div>
                        <div className="form-group"><label>Dosage</label><input value={m.dosage} onChange={e => handleMedicineChange(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label>Duration</label><input value={m.duration} onChange={e => handleMedicineChange(i, 'duration', e.target.value)} placeholder="e.g. 7 days" /></div>
                        <div className="form-group"><label>Instructions</label><input value={m.instructions} onChange={e => handleMedicineChange(i, 'instructions', e.target.value)} placeholder="e.g. After meals" /></div>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ marginBottom: 16 }} onClick={handleAddMedicine}>➕ Add Medicine</button>
                  <div className="form-group"><label>Doctor's Advice</label><textarea value={prescription.advice} onChange={e => setPrescription({...prescription, advice: e.target.value})} /></div>
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={prescription.followUpDate} onChange={e => setPrescription({...prescription, followUpDate: e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary">💊 Save Prescription</button>
                </form>
              </div>
            ) : (
              <div className="empty-state"><div className="icon">💊</div><p>No prescription yet</p></div>
            )}
          </div>
        )}

        {activeTab === 'lab' && (
          <div>
            {labResults?.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h2 className="section-title">Lab Results</h2>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Test</th><th>Result</th><th>Unit</th><th>Normal Range</th><th>Date</th></tr></thead>
                    <tbody>
                      {labResults.map((r, i) => (
                        <tr key={i}><td><strong>{r.testName}</strong></td><td>{r.result}</td><td>{r.unit || '—'}</td><td>{r.normalRange || '—'}</td><td>{new Date(r.date).toLocaleDateString('en-PK')}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {user?.role === 'doctor' && (
              <div className="card">
                <h2 className="section-title">Add Lab Result</h2>
                <form onSubmit={handleLabSubmit}>
                  <div className="form-row">
                    <div className="form-group"><label>Test Name</label><input value={labResult.testName} onChange={e => setLabResult({...labResult, testName: e.target.value})} required /></div>
                    <div className="form-group"><label>Result</label><input value={labResult.result} onChange={e => setLabResult({...labResult, result: e.target.value})} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Unit</label><input value={labResult.unit} onChange={e => setLabResult({...labResult, unit: e.target.value})} placeholder="mg/dL" /></div>
                    <div className="form-group"><label>Normal Range</label><input value={labResult.normalRange} onChange={e => setLabResult({...labResult, normalRange: e.target.value})} placeholder="70-110" /></div>
                  </div>
                  <button type="submit" className="btn btn-primary">🧪 Add Result</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
