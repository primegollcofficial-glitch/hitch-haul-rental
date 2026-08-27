import React, { useEffect, useState } from 'react';
import {
  Lock,
  LogOut,
  Truck,
  CalendarDays,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  Package,
  ListOrdered,
} from 'lucide-react';
import { TrailerItem, Booking } from '../types';
import * as api from '../api';

type AdminTab = 'fleet' | 'bookings' | 'settings';

const STATUSES: TrailerItem['status'][] = ['available', 'in-use', 'maintenance'];
const CATEGORIES = ['dump', 'flatbed', 'enclosed', 'utility'];

export const AdminView: React.FC = () => {
  const [tokenOk, setTokenOk] = useState<boolean>(api.hasToken());
  const [setup, setSetup] = useState<{ adminConfigured: boolean; emailConfigured: boolean } | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (tokenOk) return;
    api.fetchConfigState().then(setSetup).catch(() => setSetup({ adminConfigured: false, emailConfigured: false }));
  }, [tokenOk]);

  if (!tokenOk) {
    return showSetup ? (
      <AdminSetup onDone={() => setTokenOk(true)} onBack={() => setShowSetup(false)} />
    ) : (
      <AdminLogin
        needsSetup={setup ? !setup.adminConfigured : false}
        onLogin={() => setTokenOk(true)}
        onSetup={() => setShowSetup(true)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6b00]">
            <Lock className="w-4 h-4" /> TRAILER MANAGEMENT DASHBOARD
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Admin <span className="text-[#ff6b00]">Control</span>
          </h1>
        </div>
        <button
          onClick={() => { api.setToken(null); setTokenOk(false); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm font-bold text-white hover:bg-white/10 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
      <AdminTabs />
    </div>
  );
};

function AdminTabs() {
  const [tab, setTab] = useState<AdminTab>('fleet');
  const [refreshKey, setRefreshKey] = useState(0);
  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'fleet', label: 'Fleet / Products', icon: Truck },
    { id: 'bookings', label: 'Bookings', icon: ListOrdered },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer border ${
                tab === t.id
                  ? 'bg-[#ff6b00] text-black border-[#ff6b00]'
                  : 'bg-[#1a1c1c] text-white border-white/15 hover:border-white/30'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'fleet' && <FleetManager refreshKey={refreshKey} onChanged={() => setRefreshKey((k) => k + 1)} />}
      {tab === 'bookings' && <BookingsManager onChanged={() => setRefreshKey((k) => k + 1)} />}
      {tab === 'settings' && <SettingsPanel />}
    </div>
  );
}

/* ---------------- Auth ---------------- */

function AdminSetup({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr('');
    if (password.length < 4) return setErr('Password must be at least 4 characters.');
    if (password !== confirm) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      const { token } = await api.setupAdmin(password, email || undefined);
      api.setToken(token);
      onDone();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-6 sm:p-8 rounded-xl bg-[#1a1c1c] border-2 border-[#ff6b00]/60 space-y-5 shadow-2xl">
        <div className="space-y-1 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-[#ff6b00]/20 border-2 border-[#ff6b00] flex items-center justify-center text-[#ff6b00]">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl text-white uppercase">First-Time Setup</h2>
          <p className="text-xs text-[#bab8b7]">Set the admin password used to access this dashboard.</p>
        </div>
        <div className="space-y-3">
          <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" />
          <input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" />
          <input type="email" placeholder="Owner email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" />
        </div>
        {err && <div className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{err}</div>}
        <button onClick={submit} disabled={busy} className="w-full btn-primary py-3 font-bold uppercase cursor-pointer">
          {busy ? 'Setting up...' : 'Create Admin'
          }
        </button>
        <button onClick={onBack} className="w-full text-xs text-[#8e8d8c] hover:text-white cursor-pointer">Back to login</button>
      </div>
    </div>
  );
}

function AdminLogin({ needsSetup, onLogin, onSetup }: { needsSetup: boolean; onLogin: () => void; onSetup: () => void }) {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      const { token } = await api.login(password);
      api.setToken(token);
      onLogin();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-6 sm:p-8 rounded-xl bg-[#1a1c1c] border-2 border-white/15 space-y-5 shadow-2xl">
        <div className="space-y-1 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-[#ff6b00]/20 border-2 border-[#ff6b00] flex items-center justify-center text-[#ff6b00]">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl text-white uppercase">Admin Access</h2>
          <p className="text-xs text-[#bab8b7]">Enter your password to manage the fleet, bookings and availability.</p>
        </div>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 pr-10 text-sm focus:border-[#ff6b00] focus:outline-none"
          />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8d8c] hover:text-white cursor-pointer">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {err && <div className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{err}</div>}
        <button onClick={submit} disabled={busy} className="w-full btn-primary py-3 font-bold uppercase cursor-pointer">
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
        {needsSetup && (
          <button onClick={onSetup} className="w-full text-xs text-[#ff6b00] hover:underline cursor-pointer">
            First time? Set up your admin password →
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Fleet Manager ---------------- */

const emptyItem = (): TrailerItem => ({
  id: '',
  name: '',
  category: 'dump',
  tag: '',
  status: 'available',
  statusLabel: 'Available',
  description: '',
  imageUrl: '',
  images: [],
  dailyRate: 0,
  rates: {},
  specs: { capacity: '' },
  features: [],
  bookingEnabled: true,
  availability: [],
});

function FleetManager({ refreshKey, onChanged }: { refreshKey: number; onChanged: () => void }) {
  const [items, setItems] = useState<TrailerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TrailerItem | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.fetchFleet());
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const remove = async (t: TrailerItem) => {
    if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteFleet(t.id);
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const toggleBooking = async (t: TrailerItem) => {
    try {
      await api.updateFleet(t.id, { bookingEnabled: !(t.bookingEnabled !== false) });
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-white uppercase flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#ff6b00]" /> Fleet Products
        </h2>
        <div className="flex gap-2">
          <button onClick={() => { if (confirm('Reset fleet to the default seed list? This will replace all products.')) api.resetFleet().then(() => { onChanged(); setEditing(null); }); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 text-xs font-bold text-white hover:bg-white/10 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button onClick={() => setEditing(emptyItem())} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ff6b00] text-black text-xs font-bold uppercase cursor-pointer">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {editing && (
        <FleetEditor
          item={editing}
          isNew={!items.some((i) => i.id === editing.id)}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChanged(); }}
        />
      )}

      {loading ? (
        <div className="text-sm text-[#8e8d8c] py-8">Loading fleet...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="rounded-xl bg-[#181a1a] border border-white/10 overflow-hidden">
              <div className="h-36 w-full bg-black">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8e8d8c] text-xs">No image</div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="font-display text-lg text-white uppercase">{t.name}</div>
                  <div className="text-xs text-[#ff6b00]">${t.dailyRate}/day · {t.category} · {t.specs.capacity}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase">
                  <span className={`px-2 py-0.5 rounded ${t.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'in-use' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{t.statusLabel}</span>
                  <span className={`px-2 py-0.5 rounded ${t.bookingEnabled !== false ? 'bg-[#ff6b00]/20 text-[#ff6b00]' : 'bg-white/10 text-[#8e8d8c]'}`}>{t.bookingEnabled !== false ? 'Booking ON' : 'Booking OFF'}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditing({ ...t, availability: t.availability || [] })} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e2020] hover:bg-[#282a2b] border border-white/15 text-xs font-bold text-white cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => toggleBooking(t)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e2020] hover:bg-[#282a2b] border border-white/15 text-xs font-bold text-white cursor-pointer">{t.bookingEnabled !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {t.bookingEnabled !== false ? 'Disable' : 'Enable'}</button>
                  <button onClick={() => remove(t)} className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FleetEditor({ item, isNew, onClose, onSaved }: { item: TrailerItem; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<TrailerItem>({ ...item, rates: { ...item.rates }, specs: { ...item.specs }, features: [...(item.features || [])], images: [...(item.images || [])], availability: [...(item.availability || [])] });
  const [featuresText, setFeaturesText] = useState((item.features || []).join('\n'));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const set = (patch: Partial<TrailerItem>) => setForm((f) => ({ ...f, ...patch }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setErr('');
    try {
      const urls: string[] = [];
      for (const f of Array.from(files) as File[]) {
        const r = await api.uploadFile(f);
        urls.push(r.url);
      }
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
        imageUrl: prev.imageUrl || urls[0],
      }));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setErr('');
    if (!form.name) return setErr('Name is required.');
    if (!form.id) setForm((f) => ({ ...f, id: `item-${Date.now()}` }));
    setBusy(true);
    try {
      const payload = {
        ...form,
        id: form.id || `item-${Date.now()}`,
        featuresText: undefined,
        features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
        availability: form.availability || [],
      };
      if (isNew) await api.createFleet(payload);
      else await api.updateFleet(form.id, payload);
      onSaved();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#181a1a] border-2 border-[#ff6b00]/50 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-white uppercase">{isNew ? 'Add New Product' : `Edit: ${form.name}`}</h3>
        <button onClick={onClose} className="text-[#8e8d8c] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Product ID (must be unique)">
          <input value={form.id} onChange={(e) => set({ id: e.target.value })} placeholder="e.g. dump-20" className="inp" disabled={!isNew} />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. 20' Hydraulic Dump Trailer" className="inp" />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => set({ category: e.target.value as any })} className="inp">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Tag / Badge">
          <input value={form.tag} onChange={(e) => set({ tag: e.target.value })} placeholder="Dump Trailer" className="inp" />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => {
            const st = e.target.value as TrailerItem['status'];
            set({ status: st, statusLabel: st === 'available' ? 'Available' : st === 'in-use' ? 'In-Use' : 'Maintenance' });
          }} className="inp">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Daily Rate ($)">
          <input type="number" value={form.dailyRate} onChange={(e) => set({ dailyRate: Number(e.target.value) })} className="inp" />
        </Field>
        <Field label="Payload / Capacity">
          <input value={form.specs.capacity} onChange={(e) => set({ specs: { ...form.specs, capacity: e.target.value } })} placeholder="e.g. 10,000 lbs Payload" className="inp" />
        </Field>
        <Field label="Other Spec (e.g. brakes)">
          <input value={form.specs.brakes || ''} onChange={(e) => set({ specs: { ...form.specs, brakes: e.target.value } })} placeholder="Dual Axle Electric" className="inp" />
        </Field>
      </div>

      <Field label="Description">
        <textarea value={form.description} onChange={(e) => set({ description: e.target.value })} rows={2} className="inp" />
      </Field>

      <Field label="Features (one per line)">
        <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={3} className="inp" />
      </Field>

      <Field label="Photos">
        <div className="flex flex-wrap gap-3">
          {(form.images || []).filter(Boolean).map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/15">
              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button onClick={() => setForm((f) => ({ ...f, images: (f.images || []).filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white cursor-pointer"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-[#8e8d8c] text-[10px] cursor-pointer hover:border-[#ff6b00]">
            <Upload className="w-5 h-5 mb-1" />
            {uploading ? 'Uploading...' : 'Add Photo'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        {form.imageUrl && (
          <input value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="Or paste image URL (main photo)" className="inp mt-2" />
        )}
      </Field>

      <AvailabilityEditor availability={form.availability || []} onChange={(availability) => set({ availability })} />

      <div className="flex items-center gap-2 pt-1">
        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
          <input type="checkbox" checked={form.bookingEnabled !== false} onChange={(e) => set({ bookingEnabled: e.target.checked })} className="h-4 w-4 accent-[#ff6b00]" />
          Enable online booking for this trailer
        </label>
      </div>

      {err && <div className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{err}</div>}

      <div className="flex gap-2">
        <button onClick={save} disabled={busy} className="btn-primary py-2.5 flex items-center gap-2 font-bold uppercase cursor-pointer"><Save className="w-4 h-4" /> {busy ? 'Saving...' : 'Save Product'}</button>
        <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-white/15 text-white font-bold uppercase text-sm hover:bg-white/10 cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}

function AvailabilityEditor({ availability, onChange }: { availability: { start: string; end: string; note?: string }[]; onChange: (v: { start: string; end: string; note?: string }[]) => void }) {
  const add = () => onChange([...(availability || []), { start: '', end: '', note: '' }]);
  const update = (i: number, patch: any) => onChange((availability || []).map((a, idx) => idx === i ? { ...a, ...patch } : a));
  const remove = (i: number) => onChange((availability || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8e8d8c]">Manual Unavailable Date Ranges (e.g. booked elsewhere)</span>
        <button onClick={add} className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6b00] cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Range</button>
      </div>
      {(availability || []).length === 0 && <p className="text-xs text-[#8e8d8c]">No manual blocks. This trailer is available unless booked.</p>}
      {(availability || []).map((a, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 bg-[#121414] border border-white/10 rounded-lg p-2">
          <input type="date" value={a.start} onChange={(e) => update(i, { start: e.target.value })} className="inp !p-2 !w-auto" />
          <span className="text-[#8e8d8c] text-xs">to</span>
          <input type="date" value={a.end} onChange={(e) => update(i, { end: e.target.value })} className="inp !p-2 !w-auto" />
          <input value={a.note || ''} onChange={(e) => update(i, { note: e.target.value })} placeholder="Note (optional)" className="inp !p-2 flex-1 min-w-[120px]" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Bookings Manager ---------------- */

function BookingsManager({ onChanged }: { onChanged: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    try { setBookings(await api.fetchBookings()); } catch (e) { alert((e as Error).message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (b: Booking, status: Booking['status']) => {
    try { await api.updateBooking(b.id, { status }); onChanged(); load(); } catch (e) { alert((e as Error).message); }
  };
  const del = async (b: Booking) => {
    if (!confirm(`Delete booking ${b.reference}?`)) return;
    try { await api.deleteBooking(b.id); load(); } catch (e) { alert((e as Error).message); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const badge: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    confirmed: 'bg-emerald-500/20 text-emerald-400',
    completed: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-white uppercase flex items-center gap-2"><ListOrdered className="w-5 h-5 text-[#ff6b00]" /> Bookings ({bookings.length})</h2>
        <div className="flex gap-1">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${filter === s ? 'bg-[#ff6b00] text-black' : 'bg-[#1a1c1c] text-white border border-white/10'}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-sm text-[#8e8d8c] py-6">Loading bookings...</div> : filtered.length === 0 ? (
        <div className="text-sm text-[#8e8d8c] py-8 border border-dashed border-white/10 rounded-xl text-center">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-xl bg-[#181a1a] border border-white/10 p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#ff6b00] font-bold text-sm">{b.reference}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge[b.status]}`}>{b.status}</span>
                  </div>
                  <div className="text-white font-bold mt-0.5">{b.fullName}</div>
                  <div className="text-xs text-[#8e8d8c]">{b.phone} · {b.email}</div>
                </div>
                <div className="flex gap-1.5">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as Booking['status'][]).map((s) => (
                    <button key={s} onClick={() => setStatus(b, s)} disabled={b.status === s} className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${b.status === s ? 'bg-[#ff6b00] text-black' : 'bg-[#1e2020] border border-white/10 text-white hover:bg-[#282a2b]'}`}>{s}</button>
                  ))}
                  <button onClick={() => del(b)} className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#bab8b7]">
                <div><span className="text-[#8e8d8c] block">Trailer</span><span className="text-white font-semibold">{b.trailerName}</span></div>
                <div><span className="text-[#8e8d8c] block">Pickup</span><span className="text-white font-semibold">{b.pickupDate} {b.pickupTime}</span></div>
                <div><span className="text-[#8e8d8c] block">Return</span><span className="text-white font-semibold">{b.returnDate} {b.returnTime}</span></div>
                <div><span className="text-[#8e8d8c] block">Duration</span><span className="text-white font-semibold">{b.days} days</span></div>
                <div><span className="text-[#8e8d8c] block">Fulfillment</span><span className="text-white font-semibold capitalize">{b.fulfillment}{b.fulfillment === 'delivery' && b.deliveryAddress ? ` — ${b.deliveryAddress}` : ''}</span></div>
                <div><span className="text-[#8e8d8c] block">Est. Total</span><span className="text-white font-semibold">${b.estimatedTotal}</span></div>
              </div>

              {b.notes && <div className="text-xs text-[#bab8b7]"><span className="text-[#8e8d8c]">Notes:</span> {b.notes}</div>}
              {b.licenseFiles && b.licenseFiles.length > 0 && (
                <div className="text-xs text-[#bab8b7]"><span className="text-[#8e8d8c]">License files:</span>{' '}
                  {b.licenseFiles.map((f, i) => <a key={i} href={f.url} target="_blank" rel="noreferrer" className="text-[#ff6b00] underline ml-1">#{i + 1}</a>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Settings ---------------- */

function SettingsPanel() {
  const [s, setS] = useState<any>(null);
  const [email, setEmail] = useState<any>({ host: '', port: 587, secure: false, user: '', pass: '', notifyTo: '' });
  const [businessName, setBusinessName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.fetchSettings().then((d) => {
      setS(d);
      setEmail(d.email || { host: '', port: 587, secure: false, user: '', pass: '', notifyTo: '' });
      setBusinessName(d.businessName);
      setAdminEmail(d.adminEmail || '');
    }).catch((e) => setMsg({ type: 'err', text: e.message }));
  }, []);

  const toggleBooking = async () => {
    try {
      await api.updateSettings({ bookingEnabled: !s.bookingEnabled });
      setS((p: any) => ({ ...p, bookingEnabled: !p.bookingEnabled }));
      setMsg({ type: 'ok', text: 'Booking status updated.' });
    } catch (e: any) { setMsg({ type: 'err', text: e.message }); }
  };

  const saveEmail = async () => {
    setMsg(null); setBusy(true);
    try {
      await api.updateSettings({ email, businessName, adminEmail, newPassword: newPassword || undefined });
      setNewPassword('');
      setMsg({ type: 'ok', text: 'Settings saved.' });
    } catch (e: any) { setMsg({ type: 'err', text: e.message }); } finally { setBusy(false); }
  };

  const sendTest = async () => {
    setMsg(null);
    try { await api.testEmail(); setMsg({ type: 'ok', text: 'Test email sent! Check your inbox.' }); }
    catch (e: any) { setMsg({ type: 'err', text: 'Test failed: ' + e.message }); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {s && (
        <div className="rounded-xl bg-[#181a1a] border border-white/10 p-5 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg text-white uppercase flex items-center gap-2">
              {s.bookingEnabled ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
              Online Booking: <span className={s.bookingEnabled ? 'text-emerald-400' : 'text-red-400'}>{s.bookingEnabled ? 'ON' : 'OFF'}</span>
            </div>
            <div className="text-xs text-[#8e8d8c]">When OFF, customers cannot submit new bookings on the website.</div>
          </div>
          <button onClick={toggleBooking} className={`px-4 py-2.5 rounded-lg text-sm font-bold uppercase cursor-pointer ${s.bookingEnabled ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {s.bookingEnabled ? 'Turn Booking OFF' : 'Turn Booking ON'}
          </button>
        </div>
      )}

      <div className="rounded-xl bg-[#181a1a] border border-white/10 p-5 space-y-4">
        <h3 className="font-display text-lg text-white uppercase">Business</h3>
        <Field label="Business Name">
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="inp" />
        </Field>
        <Field label="Owner Email (used for setup / password recovery)"><input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="inp" /></Field>
        <Field label="Change Admin Password (leave blank to keep current)"><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="inp" /></Field>
      </div>

      <div className="rounded-xl bg-[#181a1a] border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-white uppercase flex items-center gap-2"><Mail className="w-4 h-4 text-[#ff6b00]" /> Email Notifications</h3>
        </div>
        <p className="text-xs text-[#8e8d8c]">When a customer books on the website, an email will be sent to the notification address below. Use any SMTP account (Gmail app password, Zoho, etc.).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="SMTP Host"><input value={email.host} onChange={(e) => setEmail({ ...email, host: e.target.value })} placeholder="smtp.gmail.com" className="inp" /></Field>
          <Field label="SMTP Port"><input type="number" value={email.port} onChange={(e) => setEmail({ ...email, port: Number(e.target.value) })} className="inp" /></Field>
          <Field label="Username (sender email)"><input value={email.user} onChange={(e) => setEmail({ ...email, user: e.target.value })} placeholder="you@gmail.com" className="inp" /></Field>
          <Field label="Password / App Password"><input type="password" value={email.pass} onChange={(e) => setEmail({ ...email, pass: e.target.value })} className="inp" /></Field>
          <Field label="Notify To (owner/manager email)">
            <input value={email.notifyTo} onChange={(e) => setEmail({ ...email, notifyTo: e.target.value })} placeholder="owner@example.com" className="inp" />
          </Field>
          <label className="flex items-end pb-2">
            <span className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={email.secure} onChange={(e) => setEmail({ ...email, secure: e.target.checked })} className="h-4 w-4 accent-[#ff6b00]" /> SSL / Secure
            </span>
          </label>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={saveEmail} disabled={busy} className="btn-primary py-2.5 font-bold uppercase cursor-pointer"><Save className="w-4 h-4" /> {busy ? 'Saving...' : 'Save Settings'}</button>
          <button onClick={sendTest} className="px-4 py-2.5 rounded-lg border border-white/15 text-white font-bold uppercase text-sm hover:bg-white/10 cursor-pointer">Send Test Email</button>
        </div>
      </div>

      {msg && (
        <div className={`text-sm rounded-lg p-3 flex items-center gap-2 ${msg.type === 'ok' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          {msg.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {msg.text}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#8e8d8c] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
