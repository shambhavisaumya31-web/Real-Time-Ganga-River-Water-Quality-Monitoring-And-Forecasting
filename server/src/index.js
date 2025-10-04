require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectMongo } = require('./db');

const authRoute = require('./routes/auth');
const locationsRoute = require('./routes/locations');
const timeseriesRoute = require('./routes/timeseries');
const alertsRoute = require('./routes/alerts');
const biodiversityRoute = require('./routes/biodiversity');
const reportsRoute = require('./routes/reports');
const notificationsRoute = require('./routes/notifications');
const chatbotRoute = require('./routes/chatbot');
const pushRoute = require('./routes/push');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: [CLIENT_URL, 'http://localhost:5173'], credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/auth', authRoute);
app.use('/api/locations', locationsRoute);
app.use('/api/timeseries', timeseriesRoute);
app.use('/api/alerts', alertsRoute);
app.use('/api/biodiversity', biodiversityRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/chatbot', chatbotRoute);
app.use('/api/push', pushRoute);

connectMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });

