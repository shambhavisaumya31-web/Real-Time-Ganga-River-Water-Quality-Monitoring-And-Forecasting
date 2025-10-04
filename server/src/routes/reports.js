const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const { authRequired, adminRequired } = require('../utils/auth');

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

router.post('/', authRequired, upload.single('photo'), async (req, res) => {
  try {
    const { locationId, description, severity, lat, lng } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const report = await Report.create({
      user: req.user.sub,
      location: locationId || undefined,
      description,
      severity: severity || 'low',
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      photoUrl
    });
    res.status(201).json(report);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

router.get('/', authRequired, async (req, res) => {
  const { status } = req.query;
  const q = status ? { status } : {};
  if (req.user.role !== 'admin') {
    q.user = req.user.sub;
  }
  const reports = await Report.find(q).sort({ createdAt: -1 }).populate('location').lean();
  res.json(reports);
});

router.patch('/:id', authRequired, adminRequired, async (req, res) => {
  const { status, adminNotes } = req.body;
  const report = await Report.findByIdAndUpdate(req.params.id, { status, adminNotes }, { new: true });
  res.json(report);
});

module.exports = router;

