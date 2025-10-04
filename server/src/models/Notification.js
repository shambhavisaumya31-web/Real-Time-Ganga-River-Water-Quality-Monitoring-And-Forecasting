const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['pollution', 'flood', 'drought', 'other'], default: 'pollution' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'warning' },
  channels: [{ type: String, enum: ['sse', 'email', 'sms'] }],
  sentAt: { type: Date, default: () => new Date() },
  meta: { type: Object }
}, { timestamps: true });

notificationSchema.index({ sentAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

