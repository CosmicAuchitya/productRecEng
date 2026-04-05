const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  globalDiscountType: { type: String, enum: ['none', 'percentage', 'flat'], default: 'none' },
  globalDiscountValue: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
