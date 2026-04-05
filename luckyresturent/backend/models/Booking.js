const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true, lowercase: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  arrivalWindowEnd: { type: String, default: '' },
  guests: { type: Number, required: true, min: 1, max: 20 },
  specialRequests: { type: String, default: '' },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_id: { type: String, default: '' },
  order_id: { type: String, default: '' },
  razorpay_signature: { type: String, default: '' },
  amount_paid: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  cancellationReason: { type: String, default: '' },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'processed', 'denied'],
    default: 'none'
  }
}, { timestamps: true });

bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ payment_status: 1 });
bookingSchema.index({ status: 1 });

// Calculate arrival window end (booking time + 30 minutes)
bookingSchema.pre('save', function(next) {
  if (this.time && !this.arrivalWindowEnd) {
    const [hours, minutes] = this.time.split(':').map(Number);
    let endMinutes = minutes + 30;
    let endHours = hours;
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }
    if (endHours >= 24) endHours = 0;
    this.arrivalWindowEnd = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
