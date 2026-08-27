import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'db.json')
  : path.join(DATA_DIR, 'db.json');

const DEFAULT_DB = () => ({
  settings: {
    bookingEnabled: true,
    adminPasswordHash: null,
    adminEmail: null,
    businessName: 'Hitch & Haul Trailer Rental LLC',
    email: {
      host: '',
      port: 587,
      secure: false,
      user: '',
      pass: '',
      notifyTo: '',
    },
  },
  fleet: [],
  bookings: [],
  counters: {
    booking: 1000,
  },
});

let db = null;

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function load() {
  if (db) return db;
  ensureDataDir();
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse db.json, starting fresh.', e.message);
      db = null;
    }
  }
  if (!db) {
    db = DEFAULT_DB();
    persist();
  }
  return db;
}

function persist() {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export function getDB() {
  return load();
}

export function saveDB() {
  persist();
}

export function seedFleet(items) {
  const cur = load();
  if (!cur.fleet || cur.fleet.length === 0) {
    cur.fleet = items.map((t) => ({
      ...t,
      availability: [],
      bookingEnabled: true,
      createdAt: new Date().toISOString(),
    }));
    persist();
  }
}

export function nextBookingRef() {
  const cur = load();
  cur.counters.booking += 1;
  const n = cur.counters.booking;
  persist();
  return `HH-${n}`;
}

export { DB_PATH };
