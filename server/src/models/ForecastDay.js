const mongoose = require('mongoose');

const forecastDaySchema = new mongoose.Schema({
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  date: { type: Date, required: true },
  do: { type: Number, required: true },
  bod: { type: Number, required: true },
  nitrate: { type: Number, required: true },
  fecal_coliform: { type: Number, required: true }
}, { timestamps: true });

forecastDaySchema.index({ location: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ForecastDay', forecastDaySchema);

