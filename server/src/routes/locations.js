const router = require('express').Router();
const Location = require('../models/Location');

router.get('/', async (req, res) => {
  const locations = await Location.find({ isActive: true }).sort({ city: 1 });
  res.json(locations);
});

module.exports = router;

