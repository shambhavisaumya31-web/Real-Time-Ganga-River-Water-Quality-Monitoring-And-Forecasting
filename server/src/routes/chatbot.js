const router = require('express').Router();
const thresholds = require('../utils/thresholds');

const FAQ = [
  { q: /what\s+is\s+do|dissolved\s+oxygen/i, a: 'DO (Dissolved Oxygen) indicates oxygen available in water. Safe is typically >= 5 mg/L.' },
  { q: /what\s+is\s+bod|biochemical\s+oxygen\s+demand/i, a: 'BOD reflects organic pollution. Lower is better; > 3 mg/L can be concerning.' },
  { q: /nitrate/i, a: 'Nitrates above 10 mg/L may indicate agricultural runoff risks.' },
  { q: /fecal|coliform/i, a: 'Fecal coliform indicates sewage contamination. > 2500 CFU/100mL is high risk.' },
  { q: /how\s+to\s+report|report\s+issue/i, a: 'Use the Report page to submit an issue with a photo and location. You need to be logged in.' },
  { q: /login|register/i, a: 'Citizens can register and login. Admins are seeded. Use email and password on the Login page.' },
  { q: /forecast/i, a: 'The app provides a simple 3-day forecast based on recent trends and rainfall/flow effects.' },
];

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'Please type a message.' });
  for (const item of FAQ) {
    if (item.q.test(message)) return res.json({ reply: item.a });
  }
  const params = Object.keys(thresholds).filter(k => ['do','bod','nitrate','fecal_coliform'].includes(k)).map(k => `${k.toUpperCase()}: ${thresholds[k].direction} ${thresholds[k].threshold} ${thresholds[k].unit}`).join(' | ');
  return res.json({ reply: `I can help with water quality basics. Thresholds -> ${params}. Ask about DO, BOD, nitrate, or fecal coliform, or how to report.` });
});

module.exports = router;

