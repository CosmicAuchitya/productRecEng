const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true, lowercase: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Review', reviewSchema);
