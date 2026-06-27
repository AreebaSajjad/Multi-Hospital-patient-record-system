import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment } from '../utils/api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId, doctorName, hospitalName, fee, date, timeSlot } = location.state || {};

  const [method, setMethod] = useState('');
  const [step, setStep] = useState(1); // 1=select method, 2=fill details, 3=success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [mobileNumber, setMobileNumber] = useState('');

  const formatCard = (val) => {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };
  const formatExpiry = (val) => {
    return val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const handlePayment = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await createPayment({ appointmentId, method, amount: fee });
      setTransactionId(data.transactionId);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard' },
    { id: 'jazzcash', label: 'JazzCash', icon: '📱', desc: 'Mobile Wallet' },
    { id: 'easypaisa', label: 'Easypaisa', icon: '💚', desc: 'Mobile Wallet' },
  ];

  if (!appointmentId) return (
    <div className="dashboard"><div className="container">
      <div className="empty-state"><div className="icon">❌</div><p>Invalid payment session</p>
        <button className="btn btn-primary" style={{marginTop:16}} onClick={() => navigate('/patient')}>Go Back</button>
      </div>
    </div></div>
  );

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>💳 Complete Payment</h1>
          <p>Secure payment for your appointment</p>
        </div>

        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          {/* Appointment summary */}
          <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,rgba(124,58,237,.15),rgba(168,85,247,.08))', border: '1px solid rgba(192,132,252,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginBottom: 4 }}>Appointment with</p>
                <h3 style={{ fontSize: '1.1rem' }}>{doctorName}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{hospitalName}</p>
                <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 4 }}>📅 {date} at {timeSlot}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--muted)', fontSize: '.8rem' }}>Consultation Fee</p>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>Rs. {fee?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Step 1 — Select Method */}
          {step === 1 && (
            <div className="card">
              <div className="section-title">Select Payment Method</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {methods.map(m => (
                  <div key={m.id} onClick={() => setMethod(m.id)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`, background: method === m.id ? 'rgba(124,58,237,.12)' : 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .2s' }}>
                    <span style={{ fontSize: '1.8rem' }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{m.label}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{m.desc}</div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`, background: method === m.id ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {method === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-full" disabled={!method} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Payment Details */}
          {step === 2 && (
            <div className="card">
              <button className="btn btn-outline" style={{ marginBottom: 20, padding: '7px 14px', fontSize: '.85rem' }} onClick={() => setStep(1)}>← Back</button>

              {method === 'card' && (
                <div>
                  <div className="section-title">💳 Card Details</div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 14, marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
                    <div style={{ position: 'absolute', bottom: -30, right: 20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
                    <div style={{ fontSize: '1.2rem', letterSpacing: 3, fontWeight: 700, marginBottom: 16, color: 'white' }}>
                      {cardDetails.number || '•••• •••• •••• ••••'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,.85)', fontSize: '.85rem' }}>
                      <span>{cardDetails.name || 'CARD HOLDER'}</span>
                      <span>{cardDetails.expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: formatCard(e.target.value) })} maxLength={19} />
                  </div>
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input placeholder="Ali Hassan" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })} maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input placeholder="•••" type="password" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g,'').slice(0,3) })} maxLength={3} />
                    </div>
                  </div>
                </div>
              )}

              {(method === 'jazzcash' || method === 'easypaisa') && (
                <div>
                  <div className="section-title">{method === 'jazzcash' ? '📱 JazzCash' : '💚 Easypaisa'} Payment</div>
                  <div style={{ padding: '20px', background: method === 'jazzcash' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: 14, marginBottom: 22, textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{method === 'jazzcash' ? '📱' : '💚'}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{method === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Mobile Wallet</div>
                    <div style={{ opacity: .85, fontSize: '.875rem', marginTop: 4 }}>Enter your registered mobile number</div>
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input placeholder="03XX-XXXXXXX" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
                  </div>
                  <div style={{ padding: '14px 16px', background: 'rgba(124,58,237,.1)', border: '1px solid rgba(192,132,252,.2)', borderRadius: 10, fontSize: '.82rem', color: 'var(--muted)', marginBottom: 8 }}>
                    💡 A payment request will be sent to your {method === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} app. Approve it to complete payment.
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-full" onClick={handlePayment} disabled={loading ||
                (method === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) ||
                ((method === 'jazzcash' || method === 'easypaisa') && !mobileNumber)
              }>
                {loading ? '⏳ Processing...' : `💳 Pay Rs. ${fee?.toLocaleString()}`}
              </button>
              <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--muted)', fontSize: '.78rem' }}>🔒 Your payment is 256-bit SSL encrypted</p>
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' }}>✅</div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Payment Successful!</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your appointment has been confirmed</p>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                {[['Transaction ID', transactionId], ['Amount Paid', `Rs. ${fee?.toLocaleString()}`], ['Doctor', doctorName], ['Hospital', hospitalName], ['Date', date], ['Time', timeSlot]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.875rem' }}>
                    <span style={{ color: 'var(--muted)' }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-full" onClick={() => navigate('/patient')}>
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;