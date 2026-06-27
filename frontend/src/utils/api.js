import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Har request se pehle token lagao
API.interceptors.request.use((config) => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {
    console.error('Token parse error:', e);
  }
  return config;
}, (error) => Promise.reject(error));

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Hospitals
export const getHospitals = () => API.get('/hospitals');
export const getHospital = (id) => API.get(`/hospitals/${id}`);
export const getHospitalDoctors = (id) => API.get(`/hospitals/${id}/doctors`);
export const createHospital = (data) => API.post('/hospitals', data);
export const updateHospital = (id, data) => API.put(`/hospitals/${id}`, data);
export const deleteHospital = (id) => API.delete(`/hospitals/${id}`);

// Doctors
export const getDoctors = (params) => API.get('/doctors', { params });
export const getDoctor = (id) => API.get(`/doctors/${id}`);
export const createDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);

// Appointments
export const getAppointments = () => API.get('/appointments');
export const getAppointment = (id) => API.get(`/appointments/${id}`);
export const bookAppointment = (data) => API.post('/appointments', data);
export const updateAppointmentStatus = (id, status) => API.put(`/appointments/${id}/status`, { status });
export const addPrescription = (id, data) => API.put(`/appointments/${id}/prescription`, data);
export const addLabResult = (id, data) => API.put(`/appointments/${id}/lab-results`, data);
export const cancelAppointment = (id) => API.delete(`/appointments/${id}`);
export const getStats = () => API.get('/appointments/stats/overview');

// Payments
export const createPayment = (data) => API.post('/payments', data);
export const getMyPayments = () => API.get('/payments/my');
export const getPaymentStats = () => API.get('/payments/stats');