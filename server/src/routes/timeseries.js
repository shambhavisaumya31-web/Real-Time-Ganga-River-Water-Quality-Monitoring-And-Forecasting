const router = require('express').Router();
const DailyObservation = require('../models/DailyObservation');
const ForecastDay = require('../models/ForecastDay');
const Alert = require('../models/Alert');
const thresholds = require('../utils/thresholds');

router.get('/', async (req, res) => {
  const { locationId, parameter } = req.query;
  if (!locationId || !parameter) return res.status(400).json({ error: 'locationId and parameter are required' });
  const param = parameter.toLowerCase();
  if (!['do','bod','nitrate','fecal_coliform'].includes(param)) return res.status(400).json({ error: 'Invalid parameter' });

  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 10);
  const last10 = await DailyObservation.find({ location: locationId, date: { $gte: from } })
    .sort({ date: 1 })
    .lean();

  const forecast3 = await ForecastDay.find({ location: locationId, date: { $gt: now } })
    .sort({ date: 1 })
    .limit(3)
    .lean();

  const timeseries = last10.map(o => ({ date: o.date, value: o[param] }));
  const forecast = forecast3.map(f => ({ date: f.date, value: f[param] }));

  const recentAlerts = await Alert.find({ location: locationId }).sort({ at: -1 }).limit(5).lean();

  const rule = thresholds[param];
  const latest = last10[last10.length - 1];
  let latestAlert = null;
  if (latest && rule && rule.comparator(latest[param])) {
    latestAlert = {
      parameter: param,
      value: latest[param],
      threshold: rule.threshold,
      message: `${param.toUpperCase()} ${rule.direction} threshold at ${latest[param]} ${rule.unit}`
    };
  }

  res.json({ last10Days: timeseries, forecast3Days: forecast, alerts: recentAlerts, latestAlert });
});

module.exports = router;

