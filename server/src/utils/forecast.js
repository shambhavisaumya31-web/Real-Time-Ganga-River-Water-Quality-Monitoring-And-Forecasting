const dayjs = require('dayjs');

function movingAverage(values, window = 3) {
  if (values.length === 0) return 0;
  const take = values.slice(-window);
  return take.reduce((a, b) => a + b, 0) / take.length;
}

// Simple rules:
// - Rainfall increases BOD (+0.1 per 10mm), increases fecal_coliform (+5% per 10mm), decreases DO (-0.1 per 10mm)
// - Flow high reduces nitrate slightly (-0.1 if flow > 700)
function forecastNext3Days(history) {
  // history: array of {date, do, bod, nitrate, fecal_coliform, rainfall, flow} sorted ascending
  const lastDo = movingAverage(history.map(h => h.do));
  const lastBod = movingAverage(history.map(h => h.bod));
  const lastNitrate = movingAverage(history.map(h => h.nitrate));
  const lastFc = movingAverage(history.map(h => h.fecal_coliform));
  const lastRain = movingAverage(history.map(h => h.rainfall));
  const lastFlow = movingAverage(history.map(h => h.flow));

  const rainFactor = lastRain / 10; // e.g., 50mm -> 5
  const flowHigh = lastFlow > 700 ? 1 : 0;

  const base = { do: lastDo, bod: lastBod, nitrate: lastNitrate, fecal_coliform: lastFc };

  const out = [];
  for (let i = 1; i <= 3; i++) {
    const date = dayjs(history[history.length - 1].date).add(i, 'day').toDate();
    const doVal = Math.max(0, base.do - 0.1 * rainFactor);
    const bodVal = Math.max(0, base.bod + 0.1 * rainFactor);
    const nitrateVal = Math.max(0, base.nitrate - 0.1 * flowHigh + 0.05 * rainFactor);
    const fcVal = Math.max(0, base.fecal_coliform * (1 + 0.05 * rainFactor));
    out.push({ date, do: +doVal.toFixed(2), bod: +bodVal.toFixed(2), nitrate: +nitrateVal.toFixed(2), fecal_coliform: Math.round(fcVal) });
  }
  return out;
}

module.exports = { forecastNext3Days };

