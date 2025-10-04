const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  lat: Number,
  lng: Number,
  description: { type: String, required: true },
  photoUrl: String,
  status: { type: String, enum: ['open', 'in_review', 'resolved'], default: 'open' },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
}, { timestamps: true });

reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);

