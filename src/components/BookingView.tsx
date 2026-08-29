import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavTab, TrailerItem } from '../types';
import { useData } from '../DataContext';
import {
  Calendar,
  CheckCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  FileCheck,
  AlertTriangle,
  Send,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import * as api from '../api';

interface BookingViewProps {
  selectedTrailerId: string;
  onNavigate: (tab: NavTab) => void;
  onSelectTrailer: (trailerId: string) => void;
}

const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

export const BookingView: React.FC<BookingViewProps> = ({
  selectedTrailerId,
  onNavigate,
  onSelectTrailer,
}) => {
  const { fleet, addons, settings } = useData();

  // Form State
  const [trailerId, setTrailerId] = useState<string>(selectedTrailerId || '');
  const [pickupDate, setPickupDate] = useState<string>(() => toDateStr(new Date(Date.now() + 86400000)));
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [returnTime, setReturnTime] = useState<string>('17:00');
  const [days, setDays] = useState<number>(1);
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [licenseFiles, setLicenseFiles] = useState<{ url: string; filename: string; size: number }[]>([]);
  const [insuranceFiles, setInsuranceFiles] = useState<{ url: string; filename: string; size: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Availability
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState<{
    reference: string;
    total: number;
    trailerName: string;
  } | null>(null);

  const currentTrailer: TrailerItem | undefined =
    fleet.find((t) => t.id === trailerId) || fleet[0];

  // Load availability for the selected trailer
  useEffect(() => {
    if (!trailerId) return;
    api.fetchAvailability(trailerId).then((r) => setBlockedDates(r.blockedDates)).catch(() => setBlockedDates([]));
  }, [trailerId]);

  // Compute return date from pickup + days
  const returnDate = useMemo(() => {
    if (!pickupDate) return '';
    const d = new Date(pickupDate + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return toDateStr(d);
  }, [pickupDate, days]);

  const daysFromDates = useCallback((start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
  }, []);

  const isDateBlocked = (dateStr: string) => blockedDates.includes(dateStr);

  // Allow pickup date from tomorrow onward, blocking unavailable dates
  const pickupDateAttr = {
    min: toDateStr(new Date(Date.now() + 86400000)),
  };

  // Prevent selecting a blocked pickup date
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isDateBlocked(val)) {
      setError('That date is unavailable for the selected trailer. Please choose another.');
      return;
    }
    setError('');
    setPickupDate(val);
  };

  // Price Calculation
  const calculateTotal = () => {
    if (!currentTrailer) return 0;
    let base = 0;
    if (days === 1) base = currentTrailer.rates.oneDay || currentTrailer.dailyRate;
    else if (days === 3) base = currentTrailer.rates.threeDays || currentTrailer.dailyRate * 2.5;
    else if (days === 7) base = currentTrailer.rates.sevenDays || currentTrailer.dailyRate * 4.5;
    else base = currentTrailer.dailyRate * days;

    const deliveryCost = fulfillment === 'delivery' ? 50 : 0;
    let addonsCost = 0;
    selectedAddons.forEach((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) addonsCost += addon.price;
    });
    return base + deliveryCost + addonsCost;
  };

  const handleAddonToggle = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleFileUpload = async (target: 'license' | 'insurance', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const r = await api.uploadBookingFiles(Array.from(files));
      const urls = r.files.map((f) => ({ url: f.url, filename: f.filename, size: f.size }));
      if (target === 'insurance') setInsuranceFiles((prev) => [...prev, ...urls]);
      else setLicenseFiles((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentTrailer) return setError('Please select a trailer.');
    if (!settings.bookingEnabled) return setError('Online booking is currently disabled. Please call us.');
    if (currentTrailer.bookingEnabled === false) return setError('Booking is currently disabled for this trailer.');
    if (!fullName || !phone || !email) return setError('Please fill out Full Name, Phone, and Email.');
    if (licenseFiles.length === 0) return setError('A valid driver\'s license upload is required before your booking can proceed.');
    if (insuranceFiles.length === 0) return setError('Please upload your insurance document (photo or video).');
    if (fulfillment === 'delivery' && !deliveryAddress) return setError('Please enter a delivery address.');

    setSubmitting(true);
    try {
      const booking = await api.createBooking({
        trailerId: trailerId || currentTrailer.id,
        trailerName: currentTrailer.name,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        days,
        fulfillment,
        deliveryAddress: fulfillment === 'delivery' ? deliveryAddress : undefined,
        addons: selectedAddons.map((id) => {
          const a = addons.find((x) => x.id === id);
          return { id, name: a ? a.name : id, price: a ? a.price : 0 };
        }),
        fullName,
        phone,
        email,
        notes,
        licenseFiles,
        insuranceFiles,
        estimatedTotal: calculateTotal(),
      });
      setSubmittedBooking({
        reference: booking.reference,
        total: booking.estimatedTotal,
        trailerName: booking.trailerName,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6b00]">
          <Truck className="w-4 h-4" />
          ONLINE RESERVATION DISPATCH
        </div>
        <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight">
          SECURE YOUR <span className="text-[#ff6b00]">HAUL</span>
        </h1>
        <p className="text-sm sm:text-base text-[#bab8b7] max-w-2xl">
          Reserve heavy-duty dump trailers, tilt decks, or cargo haulers in minutes. Fast dispatch verification for Decatur, Mt. Zion, and Macon County.
        </p>
      </div>

      {!settings.bookingEnabled && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center gap-3 text-sm text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          Online booking is currently disabled. Please call our dispatch line to reserve.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          {currentTrailer ? (
            <div className="brutalist-card rounded-xl overflow-hidden p-0">
              <div className="relative h-44 sm:h-52 w-full bg-black">
                <img
                  src={currentTrailer.images && currentTrailer.images.length > 0 ? currentTrailer.images[0] : currentTrailer.imageUrl}
                  alt={currentTrailer.name}
                  className="w-full h-full object-cover filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-xs font-bold text-white uppercase">
                  {currentTrailer.tag || currentTrailer.category}
                </div>
                {currentTrailer.bookingEnabled === false && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-red-500 text-xs font-bold text-white uppercase">
                    Booking Off
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 hazard-stripe" />
              </div>
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-0">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-white uppercase">{currentTrailer.name}</h3>
                    <div className="text-xs text-[#ff6b00] font-semibold">{currentTrailer.specs.capacity}</div>
                  </div>
                  <div className="font-display text-xl sm:text-2xl text-[#ff6b00]">
                    ${currentTrailer.dailyRate}
                    <span className="text-xs text-[#bab8b7] font-normal lowercase">/day</span>
                  </div>
                </div>
                <div className="text-xs text-[#bab8b7] leading-relaxed">{currentTrailer.description}</div>
              </div>
            </div>
          ) : (
            <div className="brutalist-card rounded-xl p-6 text-sm text-[#8e8d8c]">Select a trailer to see its details.</div>
          )}

          {/* Prerequisites */}
          <div className="p-5 rounded-xl bg-[#181a1a] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-display text-lg uppercase tracking-wide border-b border-white/10 pb-2">
              <FileCheck className="w-5 h-5 text-[#ff6b00]" /> DISPATCH PREREQUISITES
            </div>
            <div className="space-y-3 text-xs text-[#bab8b7]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div><strong className="text-white block font-semibold">Tow Vehicle Rating:</strong> Must possess a minimum Class IV receiver hitch with functional electronic brake controller for 14k units.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div><strong className="text-white block font-semibold">Valid License &amp; Insurance:</strong> Please upload your driver's license and insurance during checkout. Receiving &amp; delivery videos are uploaded separately on the Upload Videos page.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div><strong className="text-white block font-semibold">Security Hold:</strong> A refundable $250–$350 authorization hold will be placed on card at equipment handover.</div>
              </div>
            </div>
          </div>

          {/* Call */}
          <div className="p-4 rounded-lg bg-[#141616] border border-[#ff6b00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
              <div className="font-bold text-white uppercase">NEED SAME-DAY DISPATCH?</div>
              <div className="text-[#8e8d8c]">Call our Mount Zion dispatch yard</div>
            </div>
            <a href="tel:12178537475" className="px-3 py-1.5 rounded bg-[#ff6b00] text-black font-display text-sm uppercase flex items-center gap-1 font-bold">
              <Phone className="w-3.5 h-3.5" /> (217) 853-7475
            </a>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl bg-[#1a1c1c] border-2 border-white/15 space-y-6 sm:space-y-8 shadow-2xl">
            {/* Step 1: Equipment & Schedule */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="h-6 w-6 rounded-full bg-[#ff6b00] text-black font-display flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-display text-xl sm:text-2xl text-white uppercase">EQUIPMENT & SCHEDULE</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Select Equipment Rig</label>
                <select
                  value={trailerId || ''}
                  onChange={(e) => {
                    setTrailerId(e.target.value);
                    onSelectTrailer(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none"
                >
                  {!trailerId && <option value="">Select a trailer...</option>}
                  {fleet.map((item) => (
                    <option key={item.id} value={item.id} disabled={item.bookingEnabled === false}>
                      {item.name} — ${item.dailyRate}/day ({item.specs.capacity}){item.bookingEnabled === false ? ' (Booking Off)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Pick-Up Date</label>
                  <input type="date" value={pickupDate} min={pickupDateAttr.min} onChange={handlePickupChange} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" required />
                  <div className="text-[11px] text-[#8e8d8c] mt-1">Unavailable dates are disabled/reserved.</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Number of Days</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Pick-Up Time</label>
                  <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none">
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Return Time</label>
                  <select value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none">
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="text-xs text-[#ff6b00] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {days} {days === 1 ? 'Day' : 'Days'} · {pickupDate} {pickupTime} → {returnDate} {returnTime}
              </div>
            </div>

            {/* Step 2: Fulfillment & Addons */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="h-6 w-6 rounded-full bg-[#ff6b00] text-black font-display flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-display text-xl sm:text-2xl text-white uppercase">FULFILLMENT & ADD-ONS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setFulfillment('pickup')} className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${fulfillment === 'pickup' ? 'bg-[#1e2020] border-[#ff6b00] shadow-md ring-1 ring-[#ff6b00]' : 'bg-[#121414] border-white/10 hover:border-white/30'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-lg text-white uppercase">Customer Yard Pick-Up</span>
                    <span className="text-xs font-bold text-emerald-400 uppercase">FREE ($0)</span>
                  </div>
                  <p className="text-xs text-[#bab8b7]">Mount Zion staging yard. Flexible checkout & return window.</p>
                </button>
                <button type="button" onClick={() => setFulfillment('delivery')} className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${fulfillment === 'delivery' ? 'bg-[#1e2020] border-[#ff6b00] shadow-md ring-1 ring-[#ff6b00]' : 'bg-[#121414] border-white/10 hover:border-white/30'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-lg text-white uppercase">Site Drop-Off Delivery</span>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase">+$50 METRO</span>
                  </div>
                  <p className="text-xs text-[#bab8b7]">Direct delivery to Decatur, Mt. Zion, or surrounding job site.</p>
                </button>
              </div>

              {fulfillment === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Delivery Address / Job Site Location</label>
                  <input type="text" placeholder="e.g. 1234 N Water St, Decatur, IL" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" required={fulfillment === 'delivery'} />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-2">Optional Equipment & Service Add-ons</label>
                <div className="space-y-2">
                  {addons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <label key={addon.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-[#1e2020] border-[#ff6b00]' : 'bg-[#121414] border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={isChecked} onChange={() => handleAddonToggle(addon.id)} className="h-4 w-4 rounded accent-[#ff6b00] bg-[#121414] border-white/30" />
                          <div>
                            <div className="font-semibold text-white text-xs sm:text-sm">{addon.name}</div>
                            <div className="text-[11px] text-[#8e8d8c]">{addon.description}</div>
                          </div>
                        </div>
                        <span className="font-display text-sm text-[#ff6b00] ml-2 flex-shrink-0">{addon.priceNote || `$${addon.price}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Operator Info + License Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="h-6 w-6 rounded-full bg-[#ff6b00] text-black font-display flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-display text-xl sm:text-2xl text-white uppercase">OPERATOR &amp; REQUIRED DOCUMENTS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Full Legal Name *</label>
                  <input type="text" placeholder="John Doe / Acme Contracting" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Phone Number (SMS Dispatch) *</label>
                  <input type="tel" placeholder="(217) 555-0199" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Email Address *</label>
                <input type="email" placeholder="contractor@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" required />
              </div>

              <div className="space-y-4">
                {([
                  ['license', 'Driver\'s License *', 'Upload a clear picture of your driver\'s license (photo, not expired).'],
                  ['insurance', 'Proof of Insurance *', 'Upload your auto / coverage insurance document or card (photo or video).'],
                ] as const).map(([key, label, hint], idx) => {
                  const value = key === 'license' ? licenseFiles : insuranceFiles;
                  const setter = key === 'license' ? setLicenseFiles : setInsuranceFiles;
                  const missing = value.length === 0;
                  return (
                    <div key={key}>
                      <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">{label} <span className="text-red-400">*</span>{missing && <span className="ml-1 text-[#ff6b00] lowercase normal-case font-semibold">(required)</span>}</label>
                      <div className={`text-[11px] text-[#8e8d8c] mb-1.5 -mt-1`}>{hint}</div>
                      <label className={`flex items-center gap-2 p-4 rounded-lg border-2 border-dashed text-sm cursor-pointer transition-colors ${missing ? 'border-[#8e8d8c]/50 text-[#bab8b7] hover:border-[#ff6b00]' : 'border-emerald-500/50 text-emerald-400 hover:border-[#ff6b00]'} ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        <Upload className="w-5 h-5" />
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : missing ? null : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {uploading ? 'Uploading...' : (missing ? 'Click to upload (picture and/or video)' : `${value.length} file${value.length === 1 ? '' : 's'} uploaded — add more?`)}
                        <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleFileUpload(key, e)} />
                      </label>
                      {value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {value.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-[#121414] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span className="max-w-[160px] truncate">{f.filename}</span>
                              <button onClick={() => setter((prev) => prev.filter((_, idx) => idx !== i))} className="text-[#8e8d8c] hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-1.5">Load & Haul Notes (Optional)</label>
                <textarea rows={2} placeholder="Material type, drop location instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#121414] border border-white/20 text-white rounded-lg p-3 text-sm focus:border-[#ff6b00] focus:outline-none" />
              </div>

              <div className="space-y-2 pt-2 text-xs text-[#bab8b7]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="h-4 w-4 rounded accent-[#ff6b00]" />
                  <span>I confirm the operator has a valid Driver's License & Tow-rated vehicle.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="h-4 w-4 rounded accent-[#ff6b00]" />
                  <span>I understand that a refundable security deposit hold is required at pickup.</span>
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="p-5 rounded-xl bg-[#121414] border-2 border-[#ff6b00] space-y-4">
              <input type="hidden" value={returnDate} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#bab8b7] uppercase tracking-wider block">TOTAL ESTIMATED RESERVATION</span>
                  <div className="text-xs text-[#8e8d8c]">
                    {days} {days === 1 ? 'day' : 'days'}{fulfillment === 'delivery' ? ' + $50 delivery' : ' (Yard Pick-up)'}
                  </div>
                </div>
                <div className="font-display text-3xl sm:text-4xl text-white sm:text-right">${calculateTotal()}</div>
              </div>

              {error && <div className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{error}</div>}

              <button type="submit" disabled={submitting} className="w-full btn-primary py-4 text-base sm:text-lg font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-orange-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {submitting ? 'TRANSMITTING...' : 'TRANSMIT RESERVATION REQUEST'}
              </button>

              <div className="text-center text-[11px] text-[#8e8d8c]">
                Instant reservation verification. No payment is charged right now.
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {submittedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-[#181a1a] border border-[#ff6b00]/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-center relative">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-[#ff6b00] uppercase">RESERVATION TRANSMITTED</span>
              <h3 className="font-display text-3xl sm:text-4xl text-white uppercase">HAUL CONFIRMED</h3>
              <p className="text-xs sm:text-sm text-[#bab8b7]">
                Your booking request has been logged. The dispatch team has been notified by email and will contact you shortly to confirm pickup time and gate code.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121414] border border-white/10 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#8e8d8c]">Tracking Reference:</span><span className="font-mono font-bold text-[#ff6b00] text-sm">{submittedBooking.reference}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#8e8d8c]">Equipment:</span><span className="text-white font-semibold">{submittedBooking.trailerName}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-1.5"><span className="text-[#8e8d8c]">Dates:</span><span className="text-white font-semibold">{pickupDate} {pickupTime} to {returnDate} {returnTime} ({days} days)</span></div>
              <div className="flex justify-between"><span className="text-[#8e8d8c]">Estimated Total:</span><span className="font-display text-base text-white">${submittedBooking.total}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="tel:12178537475" className="flex-1 py-3 rounded-lg bg-[#1e2020] hover:bg-[#282a2b] text-white border border-white/20 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"><Phone className="w-4 h-4 text-[#ff6b00]" /> Call Dispatch</a>
              <button onClick={() => { setSubmittedBooking(null); onNavigate('return'); }} className="flex-1 py-3 rounded-lg bg-[#1e2020] hover:bg-[#282a2b] text-white border border-white/20 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"><Upload className="w-4 h-4 text-[#ff6b00]" /> Upload Videos</button>
              <button onClick={() => { setSubmittedBooking(null); onNavigate('fleet'); }} className="flex-1 btn-primary py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
