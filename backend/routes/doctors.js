const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialty, hospital } = req.query;
    let query = { role: 'doctor', isActive: true };
    if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
    if (hospital) query.hospital = hospital;

    const doctors = await User.find(query)
      .select('-password')
      .populate('hospital', 'name city');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/doctors/:id - Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .select('-password')
      .populate('hospital', 'name address city phone');
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/doctors - Add doctor (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const doctor = await User.create({ ...req.body, role: 'doctor' });
    res.status(201).json({ ...doctor._doc, password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/doctors/:id - Update doctor
router.put('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const doctor = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/doctors/patients/history - Doctor sees all their patients
router.get('/patients/history', protect, authorize('doctor'), async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const patients = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone bloodGroup gender dateOfBirth')
      .distinct('patient');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
