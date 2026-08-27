import React, { useState } from 'react';
import { NavTab, TrailerCategory } from '../types';
import { useData } from '../DataContext';
import {
  ShieldCheck,
  Calendar,
  Zap,
  Check,
  FileText,
  AlertCircle,
  Truck,
  PlusCircle,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

interface FleetViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectTrailer: (trailerId: string) => void;
  onOpenSpecs: () => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
  onNavigate,
  onSelectTrailer,
  onOpenSpecs,
}) => {
  const { fleet: FLEET_ITEMS, addons: SERVICE_ADDONS } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'dump', label: 'Hydraulic Dump Trailers' },
    { id: 'flatbed', label: 'Power Tilt & Flatbeds' },
    { id: 'enclosed', label: 'Enclosed Cargo' },
    { id: 'utility', label: 'Utility Trailers' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? FLEET_ITEMS
      : FLEET_ITEMS.filter((item) => item.category === (activeCategory as TrailerCategory));

  const handleRent = (trailerId: string) => {
    onSelectTrailer(trailerId);
    onNavigate('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* 1. Header */}
      <div className="border-b border-white/10 pb-8">
        <div className="space-y-3 max-w-3xl">
          <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight">
            ACTIVE FLEET & <span className="text-[#ff6b00]">RATES</span>
          </h1>
          <p className="text-sm sm:text-base text-[#bab8b7] leading-relaxed">
            Industrial-grade heavy-duty trailers prepared for immediate deployment in Mount Zion and Decatur. Transparent daily, 3-day, and weekly billing schedules with zero hidden fees.
          </p>
        </div>
      </div>

      {/* 2. Category Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#ff6b00] text-black shadow-md shadow-orange-500/20'
                : 'bg-[#1a1c1c] text-[#c8c6c5] hover:bg-[#242727] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Fleet Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {filteredItems.map((trailer) => (
          <div
            key={trailer.id}
            className="brutalist-card rounded-xl overflow-hidden flex flex-col justify-between group"
          >
            {/* Top image header */}
            <div className="relative h-52 sm:h-64 lg:h-72 w-full bg-black/80 overflow-hidden">
              <img
                src={trailer.images && trailer.images.length > 0 ? trailer.images[0] : trailer.imageUrl}
                alt={trailer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/85 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider">
                {trailer.tag}
              </div>
              <div className="absolute top-4 right-4">
                {trailer.status === 'available' && (
                  <span className="px-3 py-1 rounded bg-[#121414]/90 border border-emerald-500 text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ready For Dispatch
                  </span>
                )}
                {trailer.status === 'in-use' && (
                  <span className="px-3 py-1 rounded bg-[#121414]/90 border border-[#ff6b00] text-xs font-bold text-[#ff6b00] uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Clock className="w-3.5 h-3.5" />
                    In-Use (Reserve Ahead)
                  </span>
                )}
                {trailer.status === 'maintenance' && (
                  <span className="px-3 py-1 rounded bg-[#121414]/90 border border-red-500 text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Scheduled Maintenance
                  </span>
                )}
                {trailer.bookingEnabled === false && trailer.status === 'available' && (
                  <span className="px-3 py-1 rounded bg-[#121414]/90 border border-white/40 text-xs font-bold text-[#c8c6c5] uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    Booking Off
                  </span>
                )}
              </div>

              {/* Hazard bottom stripe */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 hazard-stripe" />
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide group-hover:text-[#ff6b00] transition-colors">
                      {trailer.name}
                    </h3>
                    <div className="text-xs text-[#ff6b00] font-semibold tracking-wider uppercase mt-0.5">
                      {trailer.specs.designation || 'Heavy-Duty Commercial Unit'}
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <div className="font-display text-2xl sm:text-3xl text-[#ff6b00]">
                      ${trailer.dailyRate}
                      <span className="text-xs text-[#bab8b7] font-normal lowercase">/day</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#bab8b7] leading-relaxed">
                  {trailer.description}
                </p>

                {/* Technical Specifications Grid */}
                <div className="bg-[#141616] p-4 rounded-lg border border-white/10 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#ff6b00] tracking-wider mb-2">
                    Key Technical Specifications
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Capacity</span>
                      <span className="text-white font-semibold">{trailer.specs.capacity}</span>
                    </div>
                    {trailer.specs.axleRating && (
                      <div>
                        <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Axle Rating</span>
                        <span className="text-white font-semibold">{trailer.specs.axleRating}</span>
                      </div>
                    )}
                    {trailer.specs.deckLength && (
                      <div>
                        <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Deck Length</span>
                        <span className="text-white font-semibold">{trailer.specs.deckLength}</span>
                      </div>
                    )}
                    {trailer.specs.recovery && (
                      <div>
                        <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Winch System</span>
                        <span className="text-white font-semibold">{trailer.specs.recovery}</span>
                      </div>
                    )}
                    {trailer.specs.liftSystem && (
                      <div>
                        <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Hydraulics</span>
                        <span className="text-white font-semibold">{trailer.specs.liftSystem}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold">Coupler Hitch</span>
                      <span className="text-white font-semibold">{trailer.specs.hitchSize || '2-5/16"'}</span>
                    </div>
                  </div>
                </div>

                {/* Rates Breakdown Box */}
                <div className="p-3.5 rounded bg-[#1e2020] border border-white/15 space-y-2">
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>STANDARD RATE SCHEDULE</span>
                    <span className="text-xs text-[#ff6b00]">Decatur / Mt. Zion</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-[#121414] border border-white/5">
                      <div className="text-[#8e8d8c] text-[10px] font-bold uppercase">1 Day</div>
                      <div className="font-display text-base sm:text-lg text-white">${trailer.rates.oneDay || trailer.dailyRate}</div>
                    </div>
                    <div className="p-2 rounded bg-[#121414] border border-white/5">
                      <div className="text-[#8e8d8c] text-[10px] font-bold uppercase">3 Days</div>
                      <div className="font-display text-base sm:text-lg text-white">
                        ${trailer.rates.threeDays || trailer.dailyRate * 2.5}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#121414] border border-white/5">
                      <div className="text-[#8e8d8c] text-[10px] font-bold uppercase">7 Days (Weekly)</div>
                      <div className="font-display text-base sm:text-lg text-[#ff6b00]">
                        ${trailer.rates.sevenDays || trailer.dailyRate * 4.5}
                      </div>
                    </div>
                  </div>
                  {trailer.rates.dumpsterServiceNote && (
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
                      <span>{trailer.rates.dumpsterServiceNote}</span>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-1.5 pt-1">
                  {trailer.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#c8c6c5]">
                      <Check className="w-3.5 h-3.5 text-[#ff6b00] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleRent(trailer.id)}
                  disabled={trailer.bookingEnabled === false}
                  className="flex-1 btn-primary py-3 text-sm font-bold uppercase tracking-wide cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  {trailer.bookingEnabled === false ? 'BOOKING OFF' : 'RESERVE THIS UNIT'}
                </button>
                <button
                  onClick={onOpenSpecs}
                  className="px-4 py-3 rounded-lg bg-[#1a1c1c] hover:bg-[#252828] border border-white/15 hover:border-white/30 text-xs font-bold uppercase tracking-wider text-[#e2e2e2] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ff6b00]" />
                  SPECS SHEET
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Fleet Expansion Teaser Card */}
        <div className="p-6 sm:p-8 rounded-xl border-2 border-dashed border-white/20 bg-[#161818]/60 flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center text-[#ff6b00]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-white uppercase">
            FLEET EXPANSION INCOMING
          </h3>
          <p className="text-sm text-[#bab8b7] max-w-md leading-relaxed">
            We are continuously augmenting our Macon County inventory. Upcoming units include 28' Gooseneck Power Tilts, 24' Heavy Car Haulers, and Heavy Deckover Equipment Trailers.
          </p>
          <button
            onClick={() => {
              onNavigate('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-lg bg-[#1e2020] hover:bg-[#282a2b] text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Request Custom Equipment
          </button>
        </div>
      </div>

      {/* 4. GENERAL SERVICE ADD-ONS */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div>
          <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
            JOB SITE LOGISTICS
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-white uppercase">
            GENERAL SERVICE ADD-ONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_ADDONS.map((addon) => (
            <div
              key={addon.id}
              className="p-6 rounded-xl bg-[#1a1c1c] border border-white/10 hover:border-[#ff6b00]/50 transition-colors flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <h4 className="font-display text-lg sm:text-xl text-white uppercase">{addon.name}</h4>
                  <span className="font-display text-base sm:text-lg text-[#ff6b00]">{addon.priceNote}</span>
                </div>
                <p className="text-xs text-[#bab8b7] leading-relaxed">
                  {addon.description}
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-lg bg-[#141616] hover:bg-[#242626] border border-white/15 hover:border-white/30 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#ff6b00]" />
                Add to Reservation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
