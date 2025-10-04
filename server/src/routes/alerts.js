const router = require('express').Router();
const Alert = require('../models/Alert');
const { register } = require('../utils/sse');

router.get('/', async (req, res) => {
  const { locationId } = req.query;
  const q = locationId ? { location: locationId } : {};
  const alerts = await Alert.find(q).sort({ at: -1 }).limit(50).lean();
  res.json(alerts);
});

router.get('/stream', (req, res) => {
  register(req, res);
});

module.exports = router;

