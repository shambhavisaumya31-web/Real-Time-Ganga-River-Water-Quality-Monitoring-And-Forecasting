const router = require('express').Router();
const Biodiversity = require('../models/Biodiversity');

router.get('/', async (req, res) => {
  const { locationId } = req.query;
  const q = locationId ? { location: locationId } : {};
  const docs = await Biodiversity.find(q).populate('location').lean();
  res.json(docs);
});

module.exports = router;

