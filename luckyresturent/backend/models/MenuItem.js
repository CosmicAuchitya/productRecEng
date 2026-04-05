const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  priceHalf: { type: Number, default: null },
  priceFull: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  isVeg: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String }],
  discountType: { type: String, enum: ['none', 'percentage', 'flat'], default: 'none' },
  discountValue: { type: Number, default: 0 }
}, { timestamps: true });

menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
