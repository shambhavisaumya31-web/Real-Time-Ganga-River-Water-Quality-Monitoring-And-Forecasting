const router = require('express').Router();
const { authRequired, adminRequired } = require('../utils/auth');
const PushSubscription = require('../models/PushSubscription');

router.get('/public-key', (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY || '';
  res.json({ key });
});

router.post('/subscribe', async (req, res) => {
  try {
    const sub = req.body;
    if (!sub || !sub.endpoint || !sub.keys) return res.status(400).json({ error: 'Invalid subscription' });
    const userId = (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) ? (require('../utils/auth').verifyToken(req.headers.authorization.slice(7)).sub) : undefined;
    const doc = await PushSubscription.findOneAndUpdate({ endpoint: sub.endpoint }, { ...sub, user: userId }, { upsert: true, new: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
    await PushSubscription.deleteOne({ endpoint });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Admin test push
router.post('/test', authRequired, adminRequired, async (req, res) => {
  const webpush = require('web-push');
  const subs = await PushSubscription.find({}).lean();
  let count = 0;
  const payload = JSON.stringify({ title: 'Test Notification', body: 'This is a test push.' });
  for (const s of subs) {
    try { await webpush.sendNotification(s, payload); count++; } catch {}
  }
  res.json({ ok: true, count });
});

module.exports = router;

