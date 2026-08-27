import React, { useState, useMemo } from 'react';
import { NavTab, ServiceArea } from '../types';
import { SERVICE_AREAS } from '../data/serviceAreasData';
import {
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  Phone,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

interface AreasViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectArea?: (areaName: string) => void;
}

export const AreasView: React.FC<AreasViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);

  const filteredAreas = useMemo(() => {
    if (!searchTerm.trim()) return SERVICE_AREAS;
    const term = searchTerm.toLowerCase();
    return SERVICE_AREAS.filter(
      (area) =>
        area.name.toLowerCase().includes(term) ||
        area.zip.toLowerCase().includes(term) ||
        area.tagline.toLowerCase().includes(term) ||
        area.popularUses.some((use) => use.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const handleBookInArea = (area: ServiceArea) => {
    onNavigate('booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 text-[#ff6b00] text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Macon County & Central Illinois Coverage</span>
        </div>
        <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight">
          SERVICE <span className="text-[#ff6b00]">AREAS</span>
        </h1>
        <p className="text-sm sm:text-base text-[#bab8b7] leading-relaxed">
          We deliver heavy-duty hydraulic dump trailers, car haulers, and utility equipment directly to your job site, farm, or driveway throughout Central Illinois.
        </p>

        {/* Quick Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-[#8e8d8c] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your town (e.g. Forsyth, Long Creek, Harristown...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#181a1a] border border-white/20 text-white rounded-xl pl-12 pr-10 py-3.5 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none placeholder-[#777] transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e8d8c] hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Badges Bar */}
      <div className="p-4 rounded-xl bg-[#181a1a] border border-white/10">
        <div className="text-xs font-bold text-[#8e8d8c] uppercase tracking-wider mb-3 text-center sm:text-left">
          Quick Jump to Community:
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {SERVICE_AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => {
                setSelectedArea(area);
                const el = document.getElementById(`area-${area.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#ff6b00] hover:text-black border border-white/10 hover:border-[#ff6b00] text-xs font-medium text-[#e2e2e2] transition-all cursor-pointer"
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Areas Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white uppercase">
              COMMUNITIES & TOWNS ({filteredAreas.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#8e8d8c]">
              Select any town for local dispatch times, delivery options, and popular rental setups.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 self-start sm:self-auto">
            ALL REGIONS ACTIVE
          </span>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="text-center py-16 bg-[#181a1a] border border-white/10 rounded-2xl p-8 space-y-4">
            <MapPin className="w-12 h-12 text-[#ff6b00] mx-auto opacity-70" />
            <h3 className="font-display text-lg sm:text-xl text-white uppercase">No Areas Found</h3>
            <p className="text-sm text-[#8e8d8c] max-w-md mx-auto">
              We deliver across all of Macon County and surrounding Central Illinois counties. Contact us directly for a custom delivery quote.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-secondary px-6 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Show All Areas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAreas.map((area) => (
              <div
                key={area.id}
                id={`area-${area.id}`}
                className="rounded-2xl bg-[#181a1a] border border-white/10 hover:border-[#ff6b00]/60 p-6 flex flex-col justify-between space-y-5 transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ff6b00]" />
                        <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight group-hover:text-[#ff6b00] transition-colors">
                          {area.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-[#8e8d8c]">
                        {area.county} • ZIP {area.zip}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-[#111111] border border-white/15 text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">
                      {area.deliveryTime}
                    </span>
                  </div>

                  {/* Tagline / Dist */}
                  <div className="text-xs font-semibold text-[#ff8833]">
                    {area.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#bab8b7] leading-relaxed line-clamp-3">
                    {area.description}
                  </p>

                  {/* Popular Uses */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-[#8e8d8c] tracking-wider block">
                      Common Rentals in {area.name}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {area.popularUses.slice(0, 3).map((use, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#111111] text-[#c8c6c5] border border-white/10 text-[10px]"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#8e8d8c] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>{area.distanceFromHub}</span>
                  </span>

                  <button
                    onClick={() => handleBookInArea(area)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#ff6b00] hover:bg-[#ff8833] text-black text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery & Site Service Information */}
      <div className="bg-[#181a1a] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-1">
            DELIVERY & HAUL-OFF SERVICES
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-white uppercase">
            HOW OUR LOCAL SERVICE WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#111111] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center font-display text-xl font-bold">
              1
            </div>
            <h3 className="font-display text-lg text-white uppercase">
              Direct Driveway Drop-Off
            </h3>
            <p className="text-xs text-[#bab8b7] leading-relaxed">
              We deliver hydraulic dump trailers right to your driveway or job site in any listed town. Safe, rubber-wheeled trailers protect concrete and asphalt.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111111] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center font-display text-xl font-bold">
              2
            </div>
            <h3 className="font-display text-lg text-white uppercase">
              You Load At Your Pace
            </h3>
            <p className="text-xs text-[#bab8b7] leading-relaxed">
              Take 24 hours, a weekend, or a full week for roofing, remodel junk, yard clearing, or machine hauling. Multi-day contractor discounts apply.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111111] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center font-display text-xl font-bold">
              3
            </div>
            <h3 className="font-display text-lg text-white uppercase">
              We Haul & Dump It Away
            </h3>
            <p className="text-xs text-[#bab8b7] leading-relaxed">
              Once filled, call or text us. We hook up and haul the waste directly to licensed transfer facilities so you never have to make landfill runs.
            </p>
          </div>
        </div>

        {/* Dispatch Banner */}
        <div className="p-6 rounded-xl bg-[#141616] border border-[#ff6b00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-lg sm:text-xl text-white uppercase">
              Need Delivery Outside These Towns?
            </div>
            <p className="text-xs text-[#bab8b7]">
              We also service Springfield, Champaign, Bloomington, Shelbyville, and greater Central Illinois upon request.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:12178537475"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black hover:bg-[#1f2121] border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Phone className="w-4 h-4 text-[#ff6b00]" />
              <span>(217) 853-7475</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
