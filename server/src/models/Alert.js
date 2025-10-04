const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  parameter: { type: String, enum: ['do', 'bod', 'nitrate', 'fecal_coliform'], required: true },
  value: { type: Number, required: true },
  threshold: { type: Number, required: true },
  level: { type: String, enum: ['warning', 'critical'], default: 'warning' },
  message: { type: String, required: true },
  at: { type: Date, default: () => new Date() }
}, { timestamps: true });

alertSchema.index({ location: 1, at: -1 });

module.exports = mongoose.model('Alert', alertSchema);

