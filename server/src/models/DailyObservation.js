const mongoose = require('mongoose');

const dailyObservationSchema = new mongoose.Schema({
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  date: { type: Date, required: true },
  do: { type: Number, required: true }, // mg/L
  bod: { type: Number, required: true }, // mg/L
  nitrate: { type: Number, required: true }, // mg/L
  fecal_coliform: { type: Number, required: true }, // CFU/100mL
  rainfall: { type: Number, required: true }, // mm
  flow: { type: Number, required: true } // m3/s (arbitrary units for demo)
}, { timestamps: true });

dailyObservationSchema.index({ location: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyObservation', dailyObservationSchema);

