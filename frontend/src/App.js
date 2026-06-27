import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import AppointmentDetail from './pages/AppointmentDetail';
import Payment from './pages/Payment';
import Navbar from './components/Navbar';
import './App.css';
const Landing = () => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'patient') return <Navigate to="/patient" />;
    if (user.role === 'doctor') return <Navigate to="/doctor" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
  }

  const stats = [
    { num: '3+', label: 'Hospitals' },
    { num: '5+', label: 'Doctors' },
    { num: '100%', label: 'Secure' },
    { num: '24/7', label: 'Access' },
  ];

  const features = [
    { icon: '📅', color: 'rgba(192,132,252,.18)', title: 'Smart Appointments', desc: 'Book at any hospital, pick your doctor and preferred time slot in 3 easy steps.' },
    { icon: '💊', color: 'rgba(168,85,247,.18)', title: 'Digital Prescriptions', desc: 'Doctors write digital prescriptions with medicines, dosage and follow-up dates.' },
    { icon: '🧪', color: 'rgba(16,185,129,.18)', title: 'Lab Results', desc: 'All lab test results stored and linked to your appointment history.' },
    { icon: '🏥', color: 'rgba(245,158,11,.18)', title: 'Multi-Hospital', desc: 'One account — access your full medical history across all hospitals.' },
    { icon: '💳', color: 'rgba(239,68,68,.18)', title: 'Easy Payments', desc: 'Pay via Card, JazzCash or Easypaisa — instant payment confirmation.' },
    { icon: '📊', color: 'rgba(124,58,237,.18)', title: 'Admin Analytics', desc: 'Real-time stats using MongoDB aggregation pipelines.' },
  ];

  return (
    <div className="landing">
      <section className="hero">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 40, position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <div className="hero-badge">
              <span>🎓</span> Advanced Database Systems — Semester Project
            </div>
            <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-2px' }}>
              Your Health,<br />
              <span style={{ background: 'linear-gradient(135deg,#c084fc 0%,#a855f7 50%,#7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Managed Smartly
              </span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
              MediConnect brings patients, doctors and hospitals on one secure platform. Book appointments, get prescriptions and track your health — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1rem', padding: '14px 32px' }}>Get Started Free</Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ fontSize: '1rem', padding: '14px 32px' }}>Sign In</Link>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc' }}>{s.num}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0 }} className="hero-visual-card">
            <div style={{ width: 320, background: 'linear-gradient(145deg,#1a0a2e,#2d1254)', border: '1px solid rgba(192,132,252,.25)', borderRadius: 24, padding: 24, boxShadow: '0 40px 80px rgba(124,58,237,.3)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>👨‍⚕️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Dr. Ahmed Khan</div>
                  <div style={{ color: '#c084fc', fontSize: '.75rem' }}>Cardiology</div>
                </div>
                <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,.15)', color: '#34d399', padding: '3px 10px', borderRadius: 20, fontSize: '.7rem', fontWeight: 700 }}>Available</span>
              </div>
              {[
                { label: 'Next Appointment', val: 'Today, 10:00 AM', icon: '📅' },
                { label: 'Patients Today', val: '8 patients', icon: '👥' },
                { label: 'Pending Reviews', val: '3 pending', icon: '⏳' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', background: 'rgba(124,58,237,.1)', borderRadius: 10, marginBottom: 8 }}>
                  <span>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '.82rem' }}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '12px', background: 'linear-gradient(135deg,rgba(124,58,237,.3),rgba(168,85,247,.2))', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.7)', marginBottom: 2 }}>Today Revenue</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>Rs. 12,000</div>
              </div>
              <div style={{ position: 'absolute', top: -14, right: -14, background: '#10b981', borderRadius: 10, padding: '8px 12px', fontSize: '.75rem', fontWeight: 700, color: 'white', boxShadow: '0 8px 20px rgba(16,185,129,.4)', lineHeight: 1.4 }}>
                ✅ Confirmed!
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <div style={{ display: 'inline-block', background: 'rgba(192,132,252,.12)', border: '1px solid rgba(192,132,252,.25)', color: '#c084fc', padding: '6px 18px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600, marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Everything in One Place</h2>
            <p>Built with MongoDB, Node.js, Express and React</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="roles-section">
        <div className="container">
          <div className="section-header">
            <div style={{ display: 'inline-block', background: 'rgba(192,132,252,.12)', border: '1px solid rgba(192,132,252,.25)', color: '#c084fc', padding: '6px 18px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600, marginBottom: 16 }}>Who Uses It</div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Three Roles, One System</h2>
            <p>Each role has its own dashboard and features</p>
          </div>
          <div className="roles-grid">
            {[
             { cls: 'patient', emoji: '🧑‍💼', title: 'Patient', desc: 'Register, book appointments, pay online, view prescriptions and full medical history.', tag: 'patient', features: ['📅 Book Appointments', '💳 Pay Online', '💊 View Prescriptions', '🧪 Lab Results'] },
{ cls: 'doctor', emoji: '👨‍⚕️', title: 'Doctor', desc: 'View today appointments, confirm bookings, write prescriptions and add lab results.', tag: 'doctor', features: ['✅ Confirm Bookings', '💊 Write Prescriptions', '🧪 Add Lab Results', '👥 Patient History'] },
{ cls: 'admin', emoji: '⚙️', title: 'Admin', desc: 'Manage hospitals and doctors, monitor revenue and system stats with live analytics.', tag: 'admin', features: ['🏥 Manage Hospitals', '👨‍⚕️ Manage Doctors', '📊 Revenue Stats', '⚙️ System Overview'] },
            ].map(r => (
             <div key={r.cls} className={`role-card ${r.cls}`}>
  <div className="role-emoji">{r.emoji}</div>
  <h3>{r.title}</h3>
  <p style={{ marginBottom: 16 }}>{r.desc}</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
    {r.features.map(f => (
      <div key={f} style={{ fontSize: '.82rem', color: 'var(--text)', background: 'rgba(124,58,237,.08)', border: '1px solid rgba(192,132,252,.15)', padding: '7px 12px', borderRadius: 8, fontWeight: 500 }}>{f}</div>
    ))}
  </div>
  <span className={`role-tag ${r.tag}`}>{r.demo}</span>
</div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏥</div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 12 }}>Try MediConnect Today</h2>
            <p style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: 12, lineHeight: 1.8 }}>
  A complete Multi-Hospital Patient Record System built with
</p>
<div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
  {['MongoDB', 'Node.js', 'Express', 'React.js', 'JWT Auth'].map(tech => (
    <span key={tech} style={{ background: 'rgba(192,132,252,.12)', border: '1px solid rgba(192,132,252,.25)', color: '#c084fc', padding: '6px 16px', borderRadius: 20, fontSize: '.82rem', fontWeight: 600 }}>{tech}</span>
  ))}
</div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ padding: '14px 36px' }}>🔐 Login Now</Link>
              <Link to="/register" className="btn btn-secondary btn-lg" style={{ padding: '14px 36px' }}>✅ Register Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/patient" element={<PrivateRoute roles={['patient']}><PatientDashboard /></PrivateRoute>} />
      <Route path="/doctor" element={<PrivateRoute roles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/book-appointment" element={<PrivateRoute roles={['patient']}><BookAppointment /></PrivateRoute>} />
      <Route path="/appointment/:id" element={<PrivateRoute><AppointmentDetail /></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute roles={['patient']}><Payment /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;