const router = require('express').Router();
const Notification = require('../models/Notification');

router.get('/', async (req, res) => {
  const docs = await Notification.find({}).sort({ sentAt: -1 }).limit(50).lean();
  res.json(docs);
});

module.exports = router;

