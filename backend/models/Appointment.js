const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  symptoms: { type: String },
  notes: { type: String },

  // Embedded prescription (added after appointment)
  prescription: {
    diagnosis: { type: String },
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    advice: { type: String },
    followUpDate: { type: Date },
    prescribedAt: { type: Date }
  },

  // Lab results
  labResults: [{
    testName: String,
    result: String,
    unit: String,
    normalRange: String,
    date: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
