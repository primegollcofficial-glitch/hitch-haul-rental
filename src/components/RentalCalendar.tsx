import React, { useEffect, useMemo, useState } from 'react';
import { TrailerItem, Booking } from '../types';
import * as api from '../api';
import { ChevronLeft, ChevronRight, CalendarDays, CircleDot, Ban, Loader2 } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function bookingsOnDate(bookings: Booking[], trailerId: string, key: string): Booking[] {
  return bookings.filter((b) => {
    if (b.trailerId !== trailerId) return false;
    if (b.status === 'cancelled') return false;
    return key >= b.pickupDate && key <= b.returnDate;
  });
}

function isDateBlocked(t: TrailerItem, key: string): boolean {
  if (!t.availability || t.availability.length === 0) return false;
  return t.availability.some((a) => {
    const start = (a.start || '').slice(0, 10);
    const end = (a.end || '').slice(0, 10);
    if (!start || !end) return false;
    return key >= start && key <= end;
  });
}

export const RentalCalendar: React.FC = () => {
  const [fleet, setFleet] = useState<TrailerItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerId, setTrailerId] = useState<string>('all');
  const [cursor, setCursor] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [f, b] = await Promise.all([api.fetchFleet(), api.fetchBookings()]);
      setFleet(f);
      setBookings(b);
      if (!trailerId || trailerId === 'all') setTrailerId(f.length ? f[0].id : 'all');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const grid = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const start = addDays(firstOfMonth, -firstOfMonth.getDay());
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
    return cells;
  }, [year, month]);

  const monthBookings = useMemo(
    () => bookings.filter((b) => b.pickupDate.slice(0, 7) === `${year}-${String(month + 1).padStart(2, '0')}` || b.returnDate.slice(0, 7) === `${year}-${String(month + 1).padStart(2, '0')}`),
    [bookings, year, month]
  );

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const todayKey = dateKey(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="font-display text-xl text-white uppercase flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#ff6b00]" /> Rental Calendar
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={trailerId}
            onChange={(e) => setTrailerId(e.target.value)}
            className="inp bg-[#111111] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            {fleet.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#111111]">{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg bg-[#1a1c1c] border border-white/15 text-white hover:border-[#ff6b00] cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="font-display text-2xl text-white uppercase">{monthLabel}</div>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg bg-[#1a1c1c] border border-white/15 text-white hover:border-[#ff6b00] cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#8e8d8c] py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading calendar...
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-[#8e8d8c] py-1">
                {d}
              </div>
            ))}
            {grid.map((d) => {
              const key = dateKey(d);
              const inMonth = d.getMonth() === month;
              const isToday = key === todayKey;
              const blocked = isDateBlocked(fleet.find((t) => t.id === trailerId) as TrailerItem, key);
              const dayBookings = bookingsOnDate(bookings, trailerId, key);
              const isBooked = dayBookings.length > 0;
              return (
                <div
                  key={key}
                  className={`relative min-h-[64px] sm:min-h-[80px] rounded-lg border p-1.5 flex flex-col transition-colors ${
                    !inMonth
                      ? 'bg-transparent border-transparent opacity-40'
                      : blocked
                      ? 'bg-red-500/10 border-red-500/30'
                      : isBooked
                      ? 'bg-[#ff6b00]/15 border-[#ff6b00]/40'
                      : 'bg-[#181a1a] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono ${isToday ? 'text-[#ff6b00] font-bold' : 'text-[#bab8b7]'}`}>
                      {d.getDate()}
                    </span>
                    {isToday && <span className="text-[8px] font-bold uppercase text-[#ff6b00]">Today</span>}
                  </div>
                  {isBooked && (
                    <div className="mt-1 space-y-0.5">
                      {dayBookings.slice(0, 2).map((b) => (
                        <div key={b.id} className="text-[8px] sm:text-[9px] leading-tight text-[#ff6b00] truncate" title={b.fullName}>
                          • {b.fullName.split(' ')[0]} {b.status !== 'confirmed' ? `(${b.status})` : ''}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-[8px] text-[#8e8d8c]">+{dayBookings.length - 2} more</div>
                      )}
                    </div>
                  )}
                  {blocked && (
                    <div className="mt-auto text-[8px] font-bold uppercase tracking-wide text-red-400 flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Blocked
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-[#bab8b7] py-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#ff6b00]/40 border border-[#ff6b00]/60 inline-block" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50 inline-block" /> Blocked</span>
            <span className="flex items-center gap-1.5"><CircleDot className="w-3 h-3 text-[#ff6b00]" /> Today</span>
          </div>

          {/* Month summary */}
          <div className="p-4 rounded-xl bg-[#181a1a] border border-white/10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">This Month</div>
            {monthBookings.length === 0 ? (
              <div className="text-sm text-[#8e8d8c]">No bookings this month.</div>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {monthBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs text-[#bab8b7] py-1 border-b border-white/5 last:border-0">
                    <div>
                      <span className="font-semibold text-white">{b.fullName}</span>
                      <span className="text-[#8e8d8c]"> · {b.trailerName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#ff6b00]">{b.pickupDate} → {b.returnDate}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#8e8d8c]">{b.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
