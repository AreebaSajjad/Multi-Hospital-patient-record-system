const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/appointments - Get appointments based on role
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') query.patient = req.user._id;
    if (req.user.role === 'doctor') query.doctor = req.user._id;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name specialty fee')
      .populate('hospital', 'name address city')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/appointments/:id - Get single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup gender dateOfBirth address')
      .populate('doctor', 'name specialty fee experience')
      .populate('hospital', 'name address city phone');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/appointments - Book appointment (patient only)
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { doctor, hospital, date, timeSlot, symptoms } = req.body;
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor, hospital, date, timeSlot, symptoms
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/appointments/:id/status - Update status (doctor/admin)
router.put('/:id/status', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/appointments/:id/prescription - Add prescription (doctor only)
router.put('/:id/prescription', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        prescription: { ...req.body, prescribedAt: new Date() },
        status: 'completed'
      },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/appointments/:id/lab-results - Add lab results (doctor only)
router.put('/:id/lab-results', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $push: { labResults: req.body } },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/appointments/stats/overview - Admin stats using aggregation
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPatients = await require('../models/User').countDocuments({ role: 'patient' });
    const totalDoctors = await require('../models/User').countDocuments({ role: 'doctor' });
    const totalHospitals = await require('../models/Hospital').countDocuments();

    res.json({ stats, totalPatients, totalDoctors, totalHospitals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
