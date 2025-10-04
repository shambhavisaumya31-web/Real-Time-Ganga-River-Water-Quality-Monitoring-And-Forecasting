require('dotenv').config();
const dayjs = require('dayjs');
const { connectMongo } = require('../db');
const User = require('../models/User');
const Location = require('../models/Location');
const Biodiversity = require('../models/Biodiversity');
const DailyObservation = require('../models/DailyObservation');
const Alert = require('../models/Alert');
const thresholds = require('../utils/thresholds');
const { hashPassword } = require('../utils/auth');

const LOCATIONS = [
  { name: 'Haridwar Ghat', city: 'Haridwar', code: 'HARIDWAR', coordinates: [78.1642, 29.9457] },
  { name: 'Kanpur Barrage', city: 'Kanpur', code: 'KANPUR', coordinates: [80.3319, 26.4499] },
  { name: 'Varanasi Dashashwamedh', city: 'Varanasi', code: 'VARANASI', coordinates: [82.9739, 25.2820] },
  { name: 'Patna Ghat', city: 'Patna', code: 'PATNA', coordinates: [85.1376, 25.5941] },
  { name: 'Kolkata Babughat', city: 'Kolkata', code: 'KOLKATA', coordinates: [88.3426, 22.5726] },
];

const BIODIVERSITY = {
  HARIDWAR: [
    { commonName: 'Mahseer', scientificName: 'Tor putitora', status: 'Endangered', category: 'Fish' },
    { commonName: 'Gharial', scientificName: 'Gavialis gangeticus', status: 'Critically Endangered', category: 'Reptile' }
  ],
  KANPUR: [
    { commonName: 'Indian Skimmer', scientificName: 'Rynchops albicollis', status: 'Vulnerable', category: 'Bird' }
  ],
  VARANASI: [
    { commonName: 'Ganges River Dolphin', scientificName: 'Platanista gangetica', status: 'Endangered', category: 'Mammal' }
  ],
  PATNA: [
    { commonName: 'Rohu', scientificName: 'Labeo rohita', status: 'Least Concern', category: 'Fish' }
  ],
  KOLKATA: [
    { commonName: 'Hilsa', scientificName: 'Tenualosa ilisha', status: 'Near Threatened', category: 'Fish' }
  ]
};

function randn(mean, sd) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + sd * num;
}

async function main() {
  await connectMongo();

  // Clean
  await Promise.all([
    User.deleteMany({}),
    Location.deleteMany({}),
    Biodiversity.deleteMany({}),
    DailyObservation.deleteMany({}),
    Alert.deleteMany({})
  ]);

  // Admin + sample citizen
  const admin = await User.create({ name: 'Admin', email: 'admin@ganga.local', passwordHash: await hashPassword('Admin@123'), role: 'admin' });
  const citizen = await User.create({ name: 'Citizen', email: 'citizen@ganga.local', passwordHash: await hashPassword('Citizen@123'), role: 'citizen' });

  // Locations
  const locDocs = await Location.insertMany(LOCATIONS.map(l => ({ ...l, coordinates: { type: 'Point', coordinates: l.coordinates } })));

  // Biodiversity
  for (const loc of locDocs) {
    const code = loc.code;
    const species = BIODIVERSITY[code] || [];
    await Biodiversity.create({ location: loc._id, species });
  }

  // Observations for last 10 days
  const today = dayjs().startOf('day');
  for (const loc of locDocs) {
    for (let i = 10; i >= 1; i--) {
      const date = today.subtract(i, 'day').toDate();
      // Base values vary by location
      const baseDo = 7 - Math.random();
      const baseBod = 2 + Math.random();
      const baseNitrate = 5 + Math.random() * 5;
      const baseFc = 800 + Math.random() * 2000;
      const rainfall = Math.max(0, randn(30, 15));
      const flow = Math.max(200, randn(600, 150));

      const doVal = Math.max(0, randn(baseDo, 0.4));
      const bodVal = Math.max(0, randn(baseBod, 0.3));
      const nitrateVal = Math.max(0, randn(baseNitrate, 0.6));
      const fcVal = Math.max(200, Math.round(randn(baseFc, 400)));

      const obs = await DailyObservation.create({
        location: loc._id, date, do: +doVal.toFixed(2), bod: +bodVal.toFixed(2), nitrate: +nitrateVal.toFixed(2), fecal_coliform: fcVal, rainfall: Math.round(rainfall), flow: Math.round(flow)
      });

      // Generate alert if threshold crossed
      for (const p of ['do','bod','nitrate','fecal_coliform']) {
        const rule = thresholds[p];
        const val = obs[p];
        if (rule && rule.comparator(val)) {
          await Alert.create({ location: loc._id, parameter: p, value: val, threshold: rule.threshold, level: 'warning', message: `${p.toUpperCase()} ${rule.direction} threshold at ${val} ${rule.unit}` });
        }
      }
    }
  }

  console.log('Seed complete. Admin: admin@ganga.local / Admin@123, Citizen: citizen@ganga.local / Citizen@123');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

