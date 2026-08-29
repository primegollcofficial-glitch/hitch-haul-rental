import { Booking, BookingSubmission, PublicSettings, TrailerItem } from './types';

const TOKEN_KEY = 'hh_admin_token';

export const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch {
      /* ignore */
    }
    const err: any = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

// Settings
export const fetchPublicSettings = () =>
  request<PublicSettings>('/settings/public');

export const fetchConfigState = () =>
  request<{ adminConfigured: boolean; emailConfigured: boolean }>('/settings/configured');

export const fetchSettings = () =>
  request<{
    bookingEnabled: boolean;
    businessName: string;
    adminEmail?: string;
    email?: any;
  }>('/settings');

export function updateSettings(payload: any) {
  return request('/settings', { method: 'POST', body: JSON.stringify(payload) });
}

// Auth
export function login(password: string) {
  return request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export function setupAdmin(password: string, email?: string) {
  return request<{ token: string }>('/auth/setup', { method: 'POST', body: JSON.stringify({ password, email }) });
}

// Fleet
export const fetchFleet = () => request<TrailerItem[]>('/fleet');
export const fetchAvailability = (trailerId: string) =>
  request<{ blockedDates: string[] }>(`/availability/${trailerId}`);

export function createFleet(item: Partial<TrailerItem>) {
  return request<TrailerItem>('/fleet', { method: 'POST', body: JSON.stringify(item) });
}
export function updateFleet(id: string, item: Partial<TrailerItem>) {
  return request<TrailerItem>(`/fleet/${id}`, { method: 'PUT', body: JSON.stringify(item) });
}
export function deleteFleet(id: string) {
  return request<{ ok: boolean }>(`/fleet/${id}`, { method: 'DELETE' });
}
export function resetFleet() {
  return request<{ ok: boolean }>('/fleet/seed', { method: 'POST' });
}

// Uploads
export function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const fd = new FormData();
  fd.append('file', file);
  return request('/upload', { method: 'POST', body: fd });
}

export function uploadBookingFiles(files: File[]): Promise<{ files: { url: string; filename: string; size: number; mimetype: string }[] }> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  return request('/booking-upload', { method: 'POST', body: fd });
}

// Bookings
export const fetchBookings = () => request<Booking[]>('/bookings');
export function createBooking(payload: BookingSubmission) {
  return request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(payload) });
}
export function updateBooking(id: string, payload: any) {
  return request<Booking>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}
export const checkInBooking = (id: string) =>
  updateBooking(id, { checkedInAt: new Date().toISOString() });
export const checkOutBooking = (id: string) =>
  updateBooking(id, { checkedOutAt: new Date().toISOString() });

export function uploadVideos(reference: string, type: 'receiving' | 'delivery', files: File[]) {
  const fd = new FormData();
  fd.append('type', type);
  files.forEach((f) => fd.append('files', f));
  return request<any>(`/bookings/${encodeURIComponent(reference)}/videos`, { method: 'POST', body: fd });
}
export function deleteBooking(id: string) {
  return request<{ ok: boolean }>(`/bookings/${id}`, { method: 'DELETE' });
}

// Email test
export function testEmail() {
  return request<{ ok: boolean }>('/email/test', { method: 'POST' });
}
