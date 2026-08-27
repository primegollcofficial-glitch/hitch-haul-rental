// One-off utility to create/set the admin password (and optional owner email).
// Usage:
//   node server/set-admin-password.js "mypassword" "owner@example.com"
//   ADMIN_PASSWORD="..." ADMIN_EMAIL="..." node server/set-admin-password.js
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_PATH, getDB, saveDB } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = process.argv[2] || process.env.ADMIN_PASSWORD || '';
const email = process.argv[3] || process.env.ADMIN_EMAIL || '';

if (!password || password.length < 4) {
  console.error('Usage: node server/set-admin-password.js "<password>" ["owner@example.com"]');
  console.error('       or set ADMIN_PASSWORD / ADMIN_EMAIL env vars.');
  process.exit(1);
}

const db = getDB();
db.settings.adminPasswordHash = bcrypt.hashSync(password, 10);
if (email) db.settings.adminEmail = email;
saveDB();
console.log(`Admin password set for ${path.basename(DB_PATH)}.` + (email ? ` Owner email: ${email}` : ''));
