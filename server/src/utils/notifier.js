let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch {}

let mailer = null;
try {
  if (process.env.SMTP_HOST) {
    const nodemailer = require('nodemailer');
    mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    });
  }
} catch {}

// Web Push
const webpush = (() => {
  try {
    return require('web-push');
  } catch {
    return null;
  }
})();
let webPushReady = false;
if (webpush && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  try {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    webPushReady = true;
  } catch {}
}
const PushSubscription = (() => { try { return require('../models/PushSubscription'); } catch { return null; } })();

function getAdminRecipients() {
  const emails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  const phones = (process.env.ADMIN_PHONES || '').split(',').map(s => s.trim()).filter(Boolean);
  return { emails, phones };
}

async function sendSMS(to, body) {
  if (!twilioClient || !process.env.TWILIO_FROM) return false;
  try {
    await twilioClient.messages.create({ to, from: process.env.TWILIO_FROM, body });
    return true;
  } catch (e) {
    return false;
  }
}

async function sendEmail(to, subject, text) {
  if (!mailer) return false;
  try {
    await mailer.sendMail({ from: process.env.SMTP_FROM || 'noreply@ganga.local', to, subject, text });
    return true;
  } catch (e) {
    return false;
  }
}

async function sendWebPushAll(payload) {
  if (!webPushReady || !PushSubscription) return { ok: false, count: 0 };
  const subs = await PushSubscription.find({}).lean();
  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      sent++;
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        // remove expired
        try { await PushSubscription.deleteOne({ endpoint: sub.endpoint }); } catch {}
      }
    }
  }
  return { ok: true, count: sent };
}

module.exports = { sendSMS, sendEmail, sendWebPushAll, getAdminRecipients };

