import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointments, cancelAppointment, getMyPayments } from '../utils/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [aptRes, payRes] = await Promise.all([getAppointments(), getMyPayments()]);
      setAppointments(aptRes.data);
      setPayments(payRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      await cancelAppointment(id);
      fetchData();
    }
  };

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const history = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));
  const displayed = activeTab === 'upcoming' ? upcoming : activeTab === 'history' ? history : payments;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your appointments and medical records</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📅</div>
            <div className="stat-info"><h3>{appointments.length}</h3><p>Total Appointments</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">⏳</div>
            <div className="stat-info"><h3>{upcoming.length}</h3><p>Upcoming</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info"><h3>{appointments.filter(a => a.status === 'completed').length}</h3><p>Completed</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon indigo">💳</div>
            <div className="stat-info"><h3>Rs. {totalPaid.toLocaleString()}</h3><p>Total Paid</p></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <Link to="/book-appointment" className="btn btn-primary">+ Book New Appointment</Link>
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Upcoming ({upcoming.length})</button>
            <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History ({history.length})</button>
            <button className={`tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments ({payments.length})</button>
          </div>

          {loading ? <div className="loading">⏳</div> :

          activeTab === 'payments' ? (
            payments.length === 0 ? (
              <div className="empty-state"><div className="icon">💳</div><p>No payments yet</p></div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr>
                    <th>Doctor</th><th>Hospital</th><th>Amount</th><th>Method</th><th>Transaction ID</th><th>Date</th>
                  </tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.doctor?.name}</strong><div style={{color:'var(--muted)',fontSize:'.8rem'}}>{p.doctor?.specialty}</div></td>
                        <td>{p.hospital?.name}</td>
                        <td><strong style={{color:'#34d399'}}>Rs. {p.amount?.toLocaleString()}</strong></td>
                        <td><span style={{textTransform:'capitalize',background:'rgba(192,132,252,.15)',color:'#c084fc',padding:'3px 10px',borderRadius:20,fontSize:'.76rem',fontWeight:700}}>{p.method}</span></td>
                        <td style={{fontSize:'.8rem',color:'var(--muted)'}}>{p.transactionId}</td>
                        <td>{new Date(p.paidAt).toLocaleDateString('en-PK')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div><p>No appointments found</p>
              {activeTab === 'upcoming' && <Link to="/book-appointment" className="btn btn-primary" style={{marginTop:16}}>Book Your First Appointment</Link>}
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Doctor</th><th>Hospital</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {displayed.map(apt => (
                    <tr key={apt._id}>
                      <td><strong>{apt.doctor?.name}</strong><div style={{color:'var(--muted)',fontSize:'.8rem'}}>{apt.doctor?.specialty}</div></td>
                      <td>{apt.hospital?.name}</td>
                      <td><div style={{fontWeight:600}}>{new Date(apt.date).toLocaleDateString('en-PK')}</div><div style={{color:'var(--muted)',fontSize:'.8rem'}}>{apt.timeSlot}</div></td>
                      <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn btn-outline" style={{padding:'6px 12px',fontSize:'.8rem'}} onClick={() => navigate(`/appointment/${apt._id}`)}>View</button>
                          {['pending','confirmed'].includes(apt.status) && <button className="btn btn-danger" style={{padding:'6px 12px',fontSize:'.8rem'}} onClick={() => handleCancel(apt._id)}>Cancel</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card" style={{marginTop:20}}>
          <h2 className="section-title">My Profile</h2>
          <div className="grid-2">
            {[['Name',user?.name],['Email',user?.email],['Blood Group',user?.bloodGroup||'—'],['Gender',user?.gender||'—'],['Phone',user?.phone||'—'],['Address',user?.address||'—']].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{color:'var(--muted)',fontSize:'.85rem'}}>{l}</span>
                <span style={{fontWeight:600,textTransform:'capitalize'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;