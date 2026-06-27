const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/payments - Create payment after booking
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { appointmentId, method, amount } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'fee')
      .populate('hospital');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Generate fake transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      appointment: appointmentId,
      patient: req.user._id,
      doctor: appointment.doctor._id,
      hospital: appointment.hospital._id,
      amount: amount || appointment.doctor.fee || 1000,
      method,
      status: 'paid',
      transactionId,
      paidAt: new Date()
    });

    // Update appointment status to confirmed after payment
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'confirmed' });

    res.status(201).json({ payment, transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/payments/my - Patient's payment history
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user._id })
      .populate('appointment', 'date timeSlot')
      .populate('doctor', 'name specialty')
      .populate('hospital', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/payments/stats - Admin revenue stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const byMethod = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: '$method', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const recentPayments = await Payment.find({ status: 'paid' })
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ paidAt: -1 })
      .limit(10);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCount: totalRevenue[0]?.count || 0,
      byMethod,
      recentPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;