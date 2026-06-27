# 🏥 MediConnect - Multi-Hospital Patient Record System

**Advanced Database Systems | Semester Project**

A full-stack web application for managing patient records across multiple hospitals with role-based access for Patients, Doctors, and Admins.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + React Router |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | Custom CSS (Dark Theme) |

---

## 📁 Project Structure

```
hospital-system/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js            # Patient, Doctor, Admin
│   │   ├── Hospital.js        # Hospital schema
│   │   └── Appointment.js     # Appointments + embedded prescriptions
│   ├── routes/
│   │   ├── auth.js            # Login, Register
│   │   ├── hospitals.js       # Hospital CRUD
│   │   ├── doctors.js         # Doctor management
│   │   └── appointments.js    # Appointment CRUD + aggregation
│   ├── middleware/auth.js     # JWT protect + role authorize
│   ├── seed.js                # Demo data seeder
│   ├── server.js              # Main Express server
│   └── .env                   # Environment variables
└── frontend/
    └── src/
        ├── context/AuthContext.js   # Global auth state
        ├── utils/api.js             # All API calls
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── PatientDashboard.js
        │   ├── DoctorDashboard.js
        │   ├── AdminDashboard.js
        │   ├── BookAppointment.js
        │   └── AppointmentDetail.js
        └── components/Navbar.js
```

---

## 🗄️ MongoDB Schema Design

### Collections:
- **users** — patients, doctors, admins (role-based)
- **hospitals** — hospital info
- **appointments** — with **embedded** prescription & lab results

### Key MongoDB Concepts Used:
- ✅ **Embedded Documents** — prescriptions inside appointments
- ✅ **References (populate)** — doctor → hospital, appointment → patient
- ✅ **Indexes** — on patient, doctor, date, status fields
- ✅ **Aggregation Pipeline** — stats overview ($group, $sum)
- ✅ **Query operators** — $push, $regex, $options

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

### Step 1: Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospital_system
JWT_SECRET=your_secret_key_here
```

### Step 2: Seed Demo Data

```bash
node seed.js
```

### Step 3: Start Backend

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 4: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | 123456 |
| Doctor | doctor@demo.com | 123456 |
| Admin | admin@demo.com | 123456 |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register patient |
| POST | /api/auth/login | Login |
| GET | /api/hospitals | All hospitals |
| GET | /api/hospitals/:id/doctors | Doctors of hospital |
| GET | /api/doctors?specialty=X | Filter doctors |
| POST | /api/appointments | Book appointment |
| GET | /api/appointments | My appointments |
| PUT | /api/appointments/:id/prescription | Add prescription |
| PUT | /api/appointments/:id/lab-results | Add lab result |
| GET | /api/appointments/stats/overview | Admin stats |

---

## 👥 Roles & Features

### Patient
- Register / Login
- Book appointment (Hospital → Doctor → Date/Time)
- View appointment history
- View prescriptions & lab results

### Doctor
- View today's appointments
- Confirm/complete appointments
- Write prescriptions with medicines
- Add lab results

### Admin
- Dashboard with system stats
- Add / manage hospitals
- Add / manage doctors
- View aggregated appointment data
