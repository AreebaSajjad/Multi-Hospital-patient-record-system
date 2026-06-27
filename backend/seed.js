const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Hospital = require('./models/Hospital');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  // Clear existing data
  await Hospital.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data...');

  // Create hospitals
  const hospitals = await Hospital.insertMany([
    { name: 'City General Hospital', address: 'I-8/3, Islamabad', city: 'Islamabad', phone: '051-111-222', email: 'info@citygeneral.pk', departments: ['Cardiology', 'Neurology', 'Orthopedics'] },
    { name: 'PIMS Hospital', address: 'G-8, Islamabad', city: 'Islamabad', phone: '051-333-444', email: 'info@pims.pk', departments: ['General Medicine', 'Pediatrics', 'Gynecology'] },
    { name: 'Shaukat Khanum Lahore', address: 'Johar Town, Lahore', city: 'Lahore', phone: '042-111-555', email: 'info@skmch.pk', departments: ['Oncology', 'Cardiology', 'Dermatology'] }
  ]);
  console.log('✅ Hospitals created');

  // Create admin
  await User.create({ name: 'Admin User', email: 'admin@demo.com', password: '123456', role: 'admin' });

  // Create doctors
  await User.create([
    { name: 'Dr. Ahmed Khan', email: 'doctor@demo.com', password: '123456', role: 'doctor', specialty: 'Cardiology', hospital: hospitals[0]._id, experience: 10, fee: 1500, phone: '0301-111-0001' },
    { name: 'Dr. Sara Ali', email: 'sara@demo.com', password: '123456', role: 'doctor', specialty: 'Neurology', hospital: hospitals[0]._id, experience: 8, fee: 2000, phone: '0301-111-0002' },
    { name: 'Dr. Hassan Raza', email: 'hassan@demo.com', password: '123456', role: 'doctor', specialty: 'Pediatrics', hospital: hospitals[1]._id, experience: 6, fee: 1200, phone: '0301-111-0003' },
    { name: 'Dr. Ayesha Siddiqui', email: 'ayesha@demo.com', password: '123456', role: 'doctor', specialty: 'Gynecology', hospital: hospitals[1]._id, experience: 12, fee: 1800, phone: '0301-111-0004' },
    { name: 'Dr. Bilal Mirza', email: 'bilal@demo.com', password: '123456', role: 'doctor', specialty: 'Dermatology', hospital: hospitals[2]._id, experience: 5, fee: 1000, phone: '0301-111-0005' }
  ]);
  console.log('✅ Doctors created');

  // Create patient
  await User.create({ name: 'Ali Hassan', email: 'patient@demo.com', password: '123456', role: 'patient', phone: '0333-1234567', gender: 'male', bloodGroup: 'B+', address: 'F-7, Islamabad' });
  console.log('✅ Patient created');

  console.log('\n🎉 Seed complete! Demo accounts:');
  console.log('Patient: patient@demo.com / 123456');
  console.log('Doctor:  doctor@demo.com / 123456');
  console.log('Admin:   admin@demo.com / 123456');

  mongoose.disconnect();
};

seed().catch(console.error);
