import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHospitals, getDoctors, bookAppointment } from '../utils/api';

const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Gynecology', 'General Medicine', 'ENT', 'Ophthalmology', 'Psychiatry'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ hospital: '', doctor: '', date: '', timeSlot: '', symptoms: '' });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [specialty, setSpecialty] = useState('');

  useEffect(() => { getHospitals().then(r => setHospitals(r.data)); }, []);

  const handleHospitalSelect = async (hospital) => {
    setSelectedHospital(hospital);
    setForm({ ...form, hospital: hospital._id, doctor: '', timeSlot: '' });
    setSelectedDoctor(null);
    const params = { hospital: hospital._id };
    if (specialty) params.specialty = specialty;
    const { data } = await getDoctors(params);
    setDoctors(data);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setForm({ ...form, doctor: doctor._id });
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await bookAppointment(form);
      // Redirect to payment page with appointment details
      navigate('/payment', {
        state: {
          appointmentId: data._id,
          doctorName: selectedDoctor?.name,
          hospitalName: selectedHospital?.name,
          fee: selectedDoctor?.fee || 1000,
          date: form.date,
          timeSlot: form.timeSlot
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>📅 Book Appointment</h1>
          <p>Find the right doctor and book your appointment</p>
        </div>

        {/* Steps */}
        <div className="step-bar">
          {['Select Hospital', 'Choose Doctor', 'Date & Time', 'Payment'].map((s, i) => (
            <div key={i} className={`step-item ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : 'inactive'}`}>
              {step > i + 1 ? '✓' : i + 1}. {s}
            </div>
          ))}
        </div>

        {/* Step 1: Hospital */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <label>Filter by Specialty (Optional)</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ width: 300 }}>
                <option value="">All Specialties</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <h2 className="section-title">🏥 Select Hospital</h2>
            <div className="grid-3">
              {hospitals.map(h => (
                <div key={h._id} className="doctor-card" onClick={() => handleHospitalSelect(h)} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>🏥</div>
                  <h3>{h.name}</h3>
                  <p>📍 {h.address}, {h.city}</p>
                  <p>📞 {h.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doctor */}
        {step === 2 && (
          <div>
            <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => setStep(1)}>← Back</button>
            <h2 className="section-title">👨‍⚕️ Choose Doctor at {selectedHospital?.name}</h2>
            {doctors.length === 0 ? (
              <div className="empty-state"><div className="icon">👨‍⚕️</div><p>No doctors available</p></div>
            ) : (
              <div className="grid-3">
                {doctors.map(d => (
                  <div key={d._id} className="doctor-card" onClick={() => handleDoctorSelect(d)} style={{ cursor: 'pointer' }}>
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <h3>{d.name}</h3>
                    <p>🩺 {d.specialty}</p>
                    <p>⏳ {d.experience || '—'} years exp.</p>
                    <p className="doctor-fee">💰 Rs. {d.fee?.toLocaleString() || '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => setStep(2)}>← Back</button>
            <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 10, marginBottom: 20, border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Appointment with</p>
                <h3 style={{ marginTop: 4 }}>{selectedDoctor?.name} — {selectedDoctor?.specialty}</h3>
                <p style={{ color: 'var(--muted)' }}>at {selectedHospital?.name}</p>
                <p style={{ color: '#34d399', fontWeight: 700, marginTop: 6 }}>Fee: Rs. {selectedDoctor?.fee?.toLocaleString() || '—'}</p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Appointment Date</label>
                  <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <div className="time-slots">
                    {TIME_SLOTS.map(slot => (
                      <div key={slot} className={`time-slot ${form.timeSlot === slot ? 'selected' : ''}`} onClick={() => setForm({ ...form, timeSlot: slot })}>
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Symptoms / Reason for Visit</label>
                  <textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} placeholder="Describe your symptoms..." />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading || !form.date || !form.timeSlot}>
                  {loading ? '⏳ Processing...' : '💳 Proceed to Payment →'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;