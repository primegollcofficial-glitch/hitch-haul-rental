import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import {
  getDB,
  saveDB,
  seedFleet,
  nextBookingRef,
  ensureDataDir,
} from './store.js';

import { SEED_FLEET } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT, 'uploads');

const JWT_SECRET = process.env.JWT_SECRET || 'hitch-haul-dev-secret-change-me';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ---- Init DB ----
ensureDataDir();
seedFleet(SEED_FLEET);

// ---- Auto-configure admin from env (optional) ----
// If ADMIN_PASSWORD is provided and no admin password exists yet, set it.
// Useful for first deploy on Render so the /admin login works immediately.
{
  const db = getDB();
  const envPass = process.env.ADMIN_PASSWORD;
  if (!db.settings.adminPasswordHash && envPass && String(envPass).length >= 4) {
    db.settings.adminPasswordHash = bcrypt.hashSync(String(envPass), 10);
    if (process.env.ADMIN_EMAIL) db.settings.adminEmail = process.env.ADMIN_EMAIL;
    saveDB();
    console.log('Admin password auto-configured from ADMIN_PASSWORD env.');
  }
}

// ---- Uploads ----
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

app.use('/uploads', express.static(UPLOAD_DIR));

// ---- Auth helpers ----
function publicSettings() {
  const s = getDB().settings;
  return {
    bookingEnabled: s.bookingEnabled,
    businessName: s.businessName,
  };
}

function isAuthed(req) {
  const token =
    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) ||
    (req.query && req.query.token) ||
    (req.cookiesToken);
  if (!token) return false;
  try {
    const dec = jwt.verify(token, JWT_SECRET);
    if (!dec || dec.role !== 'admin') return false;
    return true;
  } catch (e) {
    return false;
  }
}

function requireAuth(req, res, next) {
  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ---- Auth routes ----
app.get('/api/health', (req, res) => {
  res.json({ ok: true, bookingEnabled: getDB().settings.bookingEnabled });
});

app.get('/api/settings/public', (req, res) => {
  res.json(publicSettings());
});

app.get('/api/settings/configured', (req, res) => {
  const cur = getDB().settings;
  res.json({
    adminConfigured: !!cur.adminPasswordHash,
    emailConfigured: !!(cur.email && cur.email.user && cur.email.pass && cur.email.notifyTo),
  });
});

app.post('/api/auth/setup', async (req, res) => {
  try {
    const { password, email } = req.body || {};
    const cur = getDB().settings;
    if (cur.adminPasswordHash) {
      return res.status(400).json({ error: 'Admin already configured.' });
    }
    if (!password || String(password).length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }
    cur.adminPasswordHash = await bcrypt.hash(String(password), 10);
    if (email) cur.adminEmail = email;
    saveDB();
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body || {};
    const cur = getDB().settings;
    if (!cur.adminPasswordHash) {
      return res.status(400).json({ error: 'Admin is not set up yet. Please run first-time setup.' });
    }
    if (!password) return res.status(400).json({ error: 'Password required.' });
    const ok = await bcrypt.compare(String(password), cur.adminPasswordHash);
    if (!ok) return res.status(401).json({ error: 'Incorrect password.' });
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- Settings ----
app.get('/api/settings', requireAuth, (req, res) => {
  const s = getDB().settings;
  res.json({
    bookingEnabled: s.bookingEnabled,
    businessName: s.businessName,
    adminEmail: s.adminEmail,
    email: s.email || {},
  });
});

app.post('/api/settings', requireAuth, (req, res) => {
  const s = getDB().settings;
  const b = req.body || {};
  if (typeof b.bookingEnabled === 'boolean') s.bookingEnabled = b.bookingEnabled;
  if (typeof b.businessName === 'string' && b.businessName.trim()) s.businessName = b.businessName.trim();
  if (b.adminEmail !== undefined) s.adminEmail = b.adminEmail;
  if (b.email && typeof b.email === 'object') {
    s.email = {
      host: b.email.host || s.email.host || '',
      port: Number(b.email.port) || s.email.port || 587,
      secure: !!b.email.secure,
      user: b.email.user || s.email.user || '',
      pass: b.email.pass || s.email.pass || '',
      notifyTo: b.email.notifyTo || s.email.notifyTo || '',
    };
  }
  if (b.newPassword && String(b.newPassword).length >= 4) {
    bcrypt.hash(String(b.newPassword), 10).then((h) => {
      s.adminPasswordHash = h;
      saveDB();
    });
  } else {
    saveDB();
  }
  res.json({ ok: true });
});

// ---- Fleet CRUD ----
function normalizeFleetItem(item) {
  return {
    id: item.id,
    name: item.name || '',
    category: item.category || 'utility',
    tag: item.tag || '',
    status: item.status || 'available',
    statusLabel: item.statusLabel || 'Available',
    description: item.description || '',
    imageUrl: item.imageUrl || '',
    images: Array.isArray(item.images) ? item.images : [],
    dailyRate: Number(item.dailyRate) || 0,
    rates: item.rates || {},
    specs: item.specs || {},
    features: Array.isArray(item.features) ? item.features : [],
    bookingEnabled: item.bookingEnabled !== false,
    availability: Array.isArray(item.availability) ? item.availability : [],
  };
}

app.get('/api/fleet', (req, res) => {
  const items = getDB().fleet.map((t) => ({
    ...t,
    availability: t.availability || [],
  }));
  res.json(items);
});

app.get('/api/fleet/:id', (req, res) => {
  const item = getDB().fleet.find((t) => t.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/fleet', requireAuth, (req, res) => {
  const cur = getDB();
  const body = normalizeFleetItem(req.body || {});
  if (!body.id) body.id = `item-${Date.now()}`;
  if (cur.fleet.find((t) => t.id === body.id)) {
    return res.status(400).json({ error: 'A trailer with that ID already exists.' });
  }
  body.createdAt = new Date().toISOString();
  cur.fleet.push(body);
  saveDB();
  res.json(body);
});

app.put('/api/fleet/:id', requireAuth, (req, res) => {
  const cur = getDB();
  const idx = cur.fleet.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const merged = normalizeFleetItem({ ...cur.fleet[idx], ...(req.body || {}) });
  merged.id = req.params.id;
  cur.fleet[idx] = merged;
  saveDB();
  res.json(merged);
});

app.delete('/api/fleet/:id', requireAuth, (req, res) => {
  const cur = getDB();
  cur.fleet = cur.fleet.filter((t) => t.id !== req.params.id);
  saveDB();
  res.json({ ok: true });
});

// Bulk seed reset (admin)
app.post('/api/fleet/seed', requireAuth, (req, res) => {
  const cur = getDB();
  cur.fleet = SEED_FLEET.map((t) => ({
    ...t,
    availability: [],
    bookingEnabled: true,
    createdAt: new Date().toISOString(),
  }));
  saveDB();
  res.json({ ok: true, count: cur.fleet.length });
});

// ---- Uploads ----
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, size: req.file.size });
});

// Public upload for booking license docs (image/video)
app.post('/api/booking-upload', upload.array('files', 6), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }
  const urls = req.files.map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  }));
  res.json({ files: urls });
});

// Public receiving/delivery video upload — customer looks up booking by
// reference and uploads their trailer receiving video and/or delivery video.
// Attaches to the booking for admin review. type = 'receiving' | 'delivery'
app.post('/api/bookings/:reference/videos', upload.array('files', 6), (req, res) => {
  try {
    const cur = getDB();
    const ref = (req.params.reference || '').toString().trim().toUpperCase();
    const idx = cur.bookings.findIndex((x) => x.reference === ref);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found. Check your reference.' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const type = req.body.type === 'delivery' ? 'delivery' : 'receiving';
    const uploaded = req.files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype,
    }));
    const booking = cur.bookings[idx];
    const field = type === 'delivery' ? 'deliveryVideoFiles' : 'trailerVideoFiles';
    booking[field] = Array.isArray(booking[field]) ? booking[field].concat(uploaded) : uploaded;
    saveDB();
    res.json({ ok: true, type, files: booking[field] });
  } catch (e) {
    console.error('Video upload failed:', e.message);
    res.status(500).json({ error: 'Video upload failed.' });
  }
});

// ---- Bookings ----
function normalizeBooking(b) {
  return {
    id: b.id || `bk-${Date.now()}`,
    reference: b.reference || nextBookingRef(),
    trailerId: b.trailerId || '',
    trailerName: b.trailerName || '',
    pickupDate: b.pickupDate || '',
    pickupTime: b.pickupTime || '',
    returnDate: b.returnDate || '',
    returnTime: b.returnTime || '',
    days: Number(b.days) || 1,
    fulfillment: b.fulfillment || 'pickup',
    deliveryAddress: b.deliveryAddress || '',
    addons: Array.isArray(b.addons) ? b.addons : [],
    fullName: b.fullName || '',
    phone: b.phone || '',
    email: b.email || '',
    notes: b.notes || '',
    licenseFiles: Array.isArray(b.licenseFiles) ? b.licenseFiles : [],
    insuranceFiles: Array.isArray(b.insuranceFiles) ? b.insuranceFiles : [],
    trailerVideoFiles: Array.isArray(b.trailerVideoFiles) ? b.trailerVideoFiles : [],
    deliveryVideoFiles: Array.isArray(b.deliveryVideoFiles) ? b.deliveryVideoFiles : [],
    estimatedTotal: Number(b.estimatedTotal) || 0,
    status: b.status || 'pending',
    checkedInAt: b.checkedInAt || '',
    checkedOutAt: b.checkedOutAt || '',
    returnFiles: Array.isArray(b.returnFiles) ? b.returnFiles : [],
    returnVideoAt: b.returnVideoAt || '',
    createdAt: b.createdAt || new Date().toISOString(),
  };
}

app.get('/api/bookings', requireAuth, (req, res) => {
  const list = getDB().bookings.slice().sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)));
  res.json(list);
});

app.get('/api/bookings/:id', requireAuth, (req, res) => {
  const b = getDB().bookings.find((x) => x.id === req.params.id || x.reference === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(b);
});

app.post('/api/bookings', async (req, res) => {
  const cur = getDB();
  if (!cur.settings.bookingEnabled) {
    return res.status(400).json({ error: 'Online booking is currently disabled.' });
  }
  const body = req.body || {};
  if (!body.trailerId || !body.pickupDate || !body.fullName || !body.phone) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }
  const trailer = cur.fleet.find((t) => t.id === body.trailerId);
  if (!trailer) return res.status(400).json({ error: 'Trailer not found.' });
  if (trailer.bookingEnabled === false) {
    return res.status(400).json({ error: 'Booking for this trailer is currently disabled.' });
  }
  const conflict = checkAvailability(cur, body.trailerId, body.pickupDate, body.returnDate, body.id);
  if (conflict) {
    return res.status(409).json({ error: conflict });
  }

  const booking = normalizeBooking({ ...body, trailerName: trailer.name });
  if (body.estimatedTotal !== undefined) booking.estimatedTotal = Number(body.estimatedTotal);
  cur.bookings.push(booking);
  saveDB();

  // Send email notification (non-blocking)
  try {
    await sendBookingNotification(booking, publicSettings());
  } catch (e) {
    console.error('Email notification failed:', e.message);
  }

  res.status(201).json(booking);
});

app.put('/api/bookings/:id', requireAuth, (req, res) => {
  const cur = getDB();
  const idx = cur.bookings.findIndex((x) => x.id === req.params.id || x.reference === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  const allowed = ['status', 'notes', 'fullName', 'phone', 'email', 'pickupDate', 'pickupTime', 'returnDate', 'returnTime', 'checkedInAt', 'checkedOutAt', 'returnFiles', 'returnVideoAt', 'trailerVideoFiles', 'deliveryVideoFiles'];
  allowed.forEach((k) => {
    if (body[k] !== undefined) cur.bookings[idx][k] = body[k];
  });
  saveDB();
  res.json(cur.bookings[idx]);
});

app.delete('/api/bookings/:id', requireAuth, (req, res) => {
  const cur = getDB();
  cur.bookings = cur.bookings.filter((x) => x.id !== req.params.id && x.reference !== req.params.id);
  saveDB();
  res.json({ ok: true });
});

// ---- Availability ----
// Returns dates that are unavailable for a trailer, used to disable dates in the UI.
function unavailableDates(trailerId) {
  const cur = getDB();
  const trailer = cur.fleet.find((t) => t.id === trailerId);
  const blocked = new Set();
  if (trailer && Array.isArray(trailer.availability)) {
    trailer.availability.forEach((r) => {
      const start = new Date(r.start);
      const end = new Date(r.end);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        blocked.add(d.toISOString().split('T')[0]);
      }
    });
  }
  // Bookings that overlap each candidate date also block.
  cur.bookings.forEach((b) => {
    if (b.trailerId !== trailerId) return;
    if (b.status === 'cancelled') return;
    const start = new Date(b.pickupDate);
    const end = new Date(b.returnDate || b.pickupDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      blocked.add(d.toISOString().split('T')[0]);
    }
  });
  return blocked;
}

function checkAvailability(cur, trailerId, pickup, ret, ignoreId) {
  const blocked = unavailableDates(trailerId);
  // Temporarily exclude the booking being edited (ignoreId) if present.
  if (ignoreId) {
    cur.bookings.forEach((b) => {
      if ((b.id === ignoreId || b.reference === ignoreId) && b.trailerId === trailerId) {
        const start = new Date(b.pickupDate);
        const end = new Date(b.returnDate || b.pickupDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          blocked.delete(d.toISOString().split('T')[0]);
        }
      }
    });
  }
  const start = new Date(pickup);
  const end = new Date(ret || pickup);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (blocked.has(d.toISOString().split('T')[0])) {
      return `This trailer is already booked or unavailable on ${d.toISOString().split('T')[0]}.`;
    }
  }
  return null;
}

app.get('/api/availability/:trailerId', (req, res) => {
  const blocked = [...unavailableDates(req.params.trailerId)];
  res.json({ blockedDates: blocked });
});

// ---- Email ----
async function sendBookingNotification(booking, publics) {
  const cur = getDB();
  const emailCfg = cur.settings.email || {};
  if (!emailCfg.user || !emailCfg.pass || !emailCfg.notifyTo) {
    console.warn('Email not configured; skipping notification.');
    return;
  }
  const transporter = nodemailer.createTransport({
    host: emailCfg.host,
    port: Number(emailCfg.port) || 587,
    secure: !!emailCfg.secure,
    auth: { user: emailCfg.user, pass: emailCfg.pass },
  });

  const addons = (booking.addons || []).map((a) => a.name || a).join(', ') || 'None';
  const files = (booking.licenseFiles || []).map((f) => f.url || f).join(', ') || 'None';
  const insuranceFiles = (booking.insuranceFiles || []).map((f) => f.url || f).join(', ') || 'None';
  const trailerVideoFiles = (booking.trailerVideoFiles || []).map((f) => f.url || f).join(', ') || 'None';

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
    <div style="background:#ff6b00;color:#000;padding:16px 24px">
      <h2 style="margin:0">New Booking Request</h2>
      <div style="opacity:.8">${publics.businessName}</div>
    </div>
    <div style="padding:24px">
      <h3 style="margin-top:0">Reference: ${booking.reference}</h3>
      <table cellpadding="6" style="width:100%;border-collapse:collapse">
        <tr><td><b>Customer</b></td><td>${booking.fullName}</td></tr>
        <tr><td><b>Phone</b></td><td>${booking.phone}</td></tr>
        <tr><td><b>Email</b></td><td>${booking.email}</td></tr>
        <tr><td><b>Trailer</b></td><td>${booking.trailerName}</td></tr>
        <tr><td><b>Pickup</b></td><td>${booking.pickupDate} ${booking.pickupTime || ''}</td></tr>
        <tr><td><b>Return</b></td><td>${booking.returnDate} ${booking.returnTime || ''}</td></tr>
        <tr><td><b>Days</b></td><td>${booking.days}</td></tr>
        <tr><td><b>Fulfillment</b></td><td>${booking.fulfillment === 'delivery' ? 'Delivery: ' + booking.deliveryAddress : 'Yard Pickup'}</td></tr>
        <tr><td><b>Add-ons</b></td><td>${addons}</td></tr>
        <tr><td><b>Notes</b></td><td>${booking.notes || '—'}</td></tr>
        <tr><td><b>License Files</b></td><td>${files}</td></tr>
        <tr><td><b>Insurance Files</b></td><td>${insuranceFiles}</td></tr>
        <tr><td><b>Trailer Video</b></td><td>${trailerVideoFiles}</td></tr>
        <tr><td><b>Est. Total</b></td><td>$${booking.estimatedTotal}</td></tr>
      </table>
      <p style="font-size:12px;color:#888;margin-top:20px">Sent automatically from the Hitch &amp; Haul booking system.</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: emailCfg.user,
    to: emailCfg.notifyTo,
    subject: `New Booking ${booking.reference} - ${booking.trailerName} (${booking.fullName})`,
    html,
  });
}

// ---- Send test email ----
app.post('/api/email/test', requireAuth, async (req, res) => {
  try {
    const cur = getDB();
    const emailCfg = cur.settings.email || {};
    if (!emailCfg.user || !emailCfg.pass || !emailCfg.notifyTo) {
      return res.status(400).json({ error: 'Email not configured.' });
    }
    const transporter = nodemailer.createTransport({
      host: emailCfg.host,
      port: Number(emailCfg.port) || 587,
      secure: !!emailCfg.secure,
      auth: { user: emailCfg.user, pass: emailCfg.pass },
    });
    await transporter.sendMail({
      from: emailCfg.user,
      to: emailCfg.notifyTo,
      subject: 'Hitch & Haul - Test Notification',
      text: 'Your email settings work! New booking alerts will be delivered to this address.',
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- Serve built frontend ----
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  console.log('Serving built frontend from /dist');
} else {
  console.log('dist/ not found. Run `npm run build` to serve the frontend.');
}

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Hitch & Haul backend running on http://localhost:${PORT}`);
});
