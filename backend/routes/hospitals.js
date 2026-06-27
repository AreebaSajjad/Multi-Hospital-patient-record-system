const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/hospitals - Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/hospitals/:id - Get single hospital
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/hospitals/:id/doctors - Get doctors of a hospital
router.get('/:id/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ hospital: req.params.id, role: 'doctor', isActive: true })
      .select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/hospitals - Create hospital (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/hospitals/:id - Update hospital (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DELETE /api/hospitals/:id - Delete hospital (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hospital deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
