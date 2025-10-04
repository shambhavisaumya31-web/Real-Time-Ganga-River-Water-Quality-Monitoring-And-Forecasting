require('dotenv').config();
const dayjs = require('dayjs');
const { connectMongo } = require('../db');
const Location = require('../models/Location');
const DailyObservation = require('../models/DailyObservation');
const ForecastDay = require('../models/ForecastDay');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const thresholds = require('../utils/thresholds');
const { forecastNext3Days } = require('../utils/forecast');
const { broadcast } = require('../utils/sse');
const { sendSMS, sendEmail, sendWebPushAll, getAdminRecipients } = require('../utils/notifier');

async function main() {
  await connectMongo();
  const locations = await Location.find({ isActive: true });

  for (const loc of locations) {
    const history = await DailyObservation.find({ location: loc._id }).sort({ date: 1 }).lean();
    if (history.length === 0) continue;
    const fc = forecastNext3Days(history);

    for (const f of fc) {
      const doc = await ForecastDay.findOneAndUpdate(
        { location: loc._id, date: f.date },
        { location: loc._id, ...f },
        { upsert: true, new: true }
      );

      // Generate alerts for forecasted thresholds (critical)
      for (const p of ['do','bod','nitrate','fecal_coliform']) {
        const rule = thresholds[p];
        const val = f[p];
        if (rule && rule.comparator(val)) {
          const alert = await Alert.create({ location: loc._id, parameter: p, value: val, threshold: rule.threshold, level: 'critical', message: `Forecast: ${p.toUpperCase()} ${rule.direction} threshold at ${val} ${rule.unit} on ${dayjs(f.date).format('YYYY-MM-DD')}` });
          broadcast('alert', alert);
          // Notify admins via email/SMS and Web Push
          const { emails, phones } = getAdminRecipients();
          const subject = `Critical ${p.toUpperCase()} alert: ${loc.city}`;
          const text = `${alert.message}`;
          for (const em of emails) { await sendEmail(em, subject, text); }
          for (const ph of phones) { await sendSMS(ph, `${subject} - ${text}`); }
          await sendWebPushAll({ title: subject, body: text, type: 'alert', city: loc.city, parameter: p });
        }
      }

      // Disaster management notifications (simple rule)
      const rainHigh = thresholds.rainfall.comparator(history[history.length - 1].rainfall);
      const flowHigh = thresholds.flow.comparator(history[history.length - 1].flow);
      if (rainHigh && flowHigh) {
        const notification = await Notification.create({
          type: 'flood',
          location: loc._id,
          title: `Potential Flood Risk at ${loc.city}`,
          message: 'High rainfall and flow detected. Authorities should prepare mitigation steps.',
          severity: 'critical',
          channels: ['sse','email','sms'],
          sentAt: new Date()
        });
        broadcast('notification', notification);
        // Notify admins
        const { emails, phones } = getAdminRecipients();
        const subject = notification.title;
        const text = notification.message;
        for (const em of emails) { await sendEmail(em, subject, text); }
        for (const ph of phones) { await sendSMS(ph, `${subject} - ${text}`); }
        await sendWebPushAll({ title: subject, body: text, type: 'notification', city: loc.city });
      }
    }
  }

  console.log('Forecast computed.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

