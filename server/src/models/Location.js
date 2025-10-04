const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  coordinates: { type: { type: String, default: 'Point' }, coordinates: { type: [Number], required: true } }, // [lng, lat]
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);

