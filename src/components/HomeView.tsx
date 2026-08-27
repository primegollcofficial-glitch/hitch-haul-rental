import React, { useState } from 'react';
import { NavTab, TrailerItem } from '../types';
import { useData } from '../DataContext';
import { TESTIMONIALS } from '../data/testimonialsData';
import heroTrailerImage from '../assets/images/hero_trailer_rental_1787680857296.jpg';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  LayoutGrid,
  MapPin,
  Star,
  DollarSign,
  Phone,
  Handshake,
  Wrench
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectTrailer: (trailerId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectTrailer }) => {
  const { fleet } = useData();
  const FLEET_ITEMS: TrailerItem[] = fleet.length > 0 ? fleet : [{
    id: 'placeholder', name: 'Loading Fleet...', category: 'utility', tag: 'Utility', status: 'available', statusLabel: 'Available',
    description: '', imageUrl: '', dailyRate: 0, rates: { oneDay: 0, threeDays: 0, sevenDays: 0 }, specs: { capacity: '' }, features: [], bookingEnabled: true,
  }];
  // Quick estimator state
  const [estTrailerId, setEstTrailerId] = useState<string>(FLEET_ITEMS[0].id);
  const [estDays, setEstDays] = useState<number>(1);
  const [estFulfillment, setEstFulfillment] = useState<'pickup' | 'delivery'>('pickup');

  const selectedEstTrailer = FLEET_ITEMS.find((t) => t.id === estTrailerId) || FLEET_ITEMS[0];

  const calculateEstimate = () => {
    let base = 0;
    if (estDays === 1) {
      base = selectedEstTrailer.rates.oneDay || selectedEstTrailer.dailyRate;
    } else if (estDays === 3) {
      base = selectedEstTrailer.rates.threeDays || selectedEstTrailer.dailyRate * 2.5;
    } else if (estDays === 7) {
      base = selectedEstTrailer.rates.sevenDays || selectedEstTrailer.dailyRate * 4.5;
    } else {
      base = selectedEstTrailer.dailyRate * estDays;
    }
    const deliveryFee = estFulfillment === 'delivery' ? 50 : 0;
    return base + deliveryFee;
  };

  const handleBookSelected = (trailerId: string) => {
    onSelectTrailer(trailerId);
    onNavigate('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-20">
      {/* 1. HERO SECTION (Exact Match to Screenshot) */}
      <section className="relative min-h-[480px] sm:min-h-[640px] lg:min-h-[700px] flex items-center overflow-hidden border-b-2 border-[#ff6b00]">
        {/* Background Image with Authentic Commercial Trailer Lineup */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroTrailerImage}
            alt="Commercial Trailers and Heavy Duty Haulers at Hitch & Haul Trailer Rental LLC"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Gentle gradient for text readability without obscuring the trailer */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-normal text-white uppercase tracking-tight leading-[0.92]">
              <span className="text-[#ff6b00]">RELIABLE</span> TRAILER<br />
              RENTALS
            </h1>

            {/* Subtext Card with Orange Left Border */}
            <div className="p-4 sm:p-5 bg-[#181a1a]/90 border-l-4 border-[#ff6b00] text-[#e0dedd] text-sm sm:text-base leading-relaxed max-w-xl shadow-2xl backdrop-blur-sm">
              Heavy-duty trailers for your toughest jobs. From car haulers and power tilt decks to heavy-duty hydraulic dump trailers and enclosed cargo, we provide professional-grade, locally owned trailer rental solutions designed for industrial strength and reliability.
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  onNavigate('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary text-base sm:text-lg uppercase px-5 py-3 sm:px-8 sm:py-4 shadow-lg shadow-orange-500/25 group cursor-pointer"
              >
                <span>RESERVE EQUIPMENT</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onNavigate('fleet');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary text-base sm:text-lg uppercase px-5 py-3 sm:px-8 sm:py-4 cursor-pointer group"
              >
                <span>VIEW FLEET</span>
                <LayoutGrid className="w-5 h-5 text-[#ff6b00] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR FLEET SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
              OUR FLEET
            </h2>
            <p className="text-sm sm:text-base text-[#bab8b7] mt-1">
              Industrial-grade equipment maintained to the highest standards. Ready for immediate deployment.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('fleet');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-[#ff6b00] hover:text-white font-display text-base sm:text-lg tracking-wider uppercase group cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>VIEW ALL EQUIPMENT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Fleet Cards Matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 14' Hydraulic Dump */}
          <div
            onClick={() => handleBookSelected('dump-14')}
            className="bg-[#181a1a] border border-white/15 hover:border-[#ff6b00] transition-colors rounded-sm overflow-hidden flex flex-col group cursor-pointer shadow-lg"
          >
            <div className="relative h-44 sm:h-56 w-full bg-black/60 overflow-hidden">
              <img
                src={(FLEET_ITEMS.find((t) => t.id === 'dump-14')?.imageUrl) || FLEET_ITEMS[0].imageUrl}
                alt={FLEET_ITEMS.find((t) => t.id === 'dump-14')?.name || 'Trailer'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#ff6b00] text-black text-xs font-display uppercase tracking-wider font-bold">
                {FLEET_ITEMS.find((t) => t.id === 'dump-14')?.tag || 'DUMP'}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-[#ff6b00] transition-colors">
                  {FLEET_ITEMS.find((t) => t.id === 'dump-14')?.name || "14' HYDRAULIC DUMP"}
                </h3>
                <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed mt-2">
                  {FLEET_ITEMS.find((t) => t.id === 'dump-14')?.description || 'Heavy-duty dump trailer.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">DAILY RATE</span>
                  <span className="font-display text-lg sm:text-xl text-[#ff6b00] font-bold">
                    ${(FLEET_ITEMS.find((t) => t.id === 'dump-14')?.rates.oneDay ?? FLEET_ITEMS.find((t) => t.id === 'dump-14')?.dailyRate) ?? 125}
                  </span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">CAPACITY</span>
                  <span className="font-display text-lg sm:text-xl text-white font-bold">
                    {FLEET_ITEMS.find((t) => t.id === 'dump-14')?.specs.capacity || '10,000 lbs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 20' Tilt Deck */}
          <div
            onClick={() => handleBookSelected('tilt-20')}
            className="bg-[#181a1a] border border-white/15 hover:border-[#ff6b00] transition-colors rounded-sm overflow-hidden flex flex-col group cursor-pointer shadow-lg"
          >
            <div className="relative h-44 sm:h-56 w-full bg-black/60 overflow-hidden">
              <img
                src={(FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.imageUrl) || (FLEET_ITEMS[1]?.imageUrl || '')}
                alt={FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.name || "20' Tilt Deck"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#ff6b00] text-black text-xs font-display uppercase tracking-wider font-bold">
                {FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.tag || 'FLATBED'}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-[#ff6b00] transition-colors">
                  {FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.name || "20' TILT DECK"}
                </h3>
                <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed mt-2">
                  {FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.description || 'Full power tilt deck trailer.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">DAILY RATE</span>
                  <span className="font-display text-lg sm:text-xl text-[#ff6b00] font-bold">
                    ${(FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.rates.oneDay ?? FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.dailyRate) ?? 110}
                  </span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">CAPACITY</span>
                  <span className="font-display text-lg sm:text-xl text-white font-bold">
                    {FLEET_ITEMS.find((t) => t.id === 'tilt-20')?.specs.capacity || '11,000 lbs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 8x20' Enclosed */}
          <div
            onClick={() => handleBookSelected('enclosed-8x20')}
            className="bg-[#181a1a] border border-white/15 hover:border-[#ff6b00] transition-colors rounded-sm overflow-hidden flex flex-col group cursor-pointer shadow-lg"
          >
            <div className="relative h-44 sm:h-56 w-full bg-black/60 overflow-hidden">
              <img
                src={(FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.imageUrl) || (FLEET_ITEMS[2]?.imageUrl || '')}
                alt={FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.name || "8x20' Enclosed"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#ff6b00] text-black text-xs font-display uppercase tracking-wider font-bold">
                {FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.tag || 'ENCLOSED'}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-[#ff6b00] transition-colors">
                  {FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.name || "8X20' ENCLOSED"}
                </h3>
                <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed mt-2">
                  {FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.description || "8x20' enclosed cargo trailer."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">DAILY RATE</span>
                  <span className="font-display text-lg sm:text-xl text-[#ff6b00] font-bold">
                    ${(FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.rates.oneDay ?? FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.dailyRate) ?? 100}
                  </span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] block text-[10px] uppercase font-bold tracking-wider">CAPACITY</span>
                  <span className="font-display text-lg sm:text-xl text-white font-bold">
                    {FLEET_ITEMS.find((t) => t.id === 'enclosed-8x20')?.specs.capacity || '7,000 lbs'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE FEATURE CARDS (Exact match to screenshot bottom bento) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: 24/7 Availability */}
          <div className="relative p-5 sm:p-7 rounded-lg bg-[#181a1a] border border-white/10 hover:border-[#ff6b00]/50 transition-colors overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.12),_transparent_70%)] pointer-events-none" />
            <div className="text-[#ff6b00]">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl sm:text-3xl text-white uppercase tracking-wide">
              24/7 AVAILABILITY
            </h3>
            <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed">
              Book online anytime. Flexible pick-up and drop-off to keep your project moving on your schedule.
            </p>
          </div>

          {/* Feature 2: Locally Owned */}
          <div className="relative p-5 sm:p-7 rounded-lg bg-[#181a1a] border border-white/10 hover:border-[#ff6b00]/50 transition-colors overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.12),_transparent_70%)] pointer-events-none" />
            <div className="text-[#ff6b00]">
              <Handshake className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl sm:text-3xl text-white uppercase tracking-wide">
              LOCALLY OWNED
            </h3>
            <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed">
              Proudly serving the Decatur community. Expect straight talk and reliable service from your neighbors.
            </p>
          </div>

          {/* Feature 3: Rugged Equipment */}
          <div className="relative p-5 sm:p-7 rounded-lg bg-[#181a1a] border border-white/10 border-b-2 border-b-[#ff6b00] hover:border-[#ff6b00] transition-colors overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.12),_transparent_70%)] pointer-events-none" />
            <div className="text-[#ff6b00]">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl sm:text-3xl text-white uppercase tracking-wide">
              RUGGED EQUIPMENT
            </h3>
            <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed">
              Commercial-grade trailers maintained to industrial standards. Built to handle the heaviest loads safely.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INSTANT RENTAL ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-xl bg-[#1a1c1c] border-2 border-white/15 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                TRANSPARENT PRICING
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-white uppercase leading-tight">
                INSTANT HAUL ESTIMATOR
              </h2>
              <p className="text-sm text-[#bab8b7] leading-relaxed">
                Configure your equipment duration and delivery preference for an instant upfront calculation. No hidden environmental surcharges or surprise check-in fees.
              </p>
              <div className="space-y-2 pt-2 text-xs text-[#e2e2e2]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#ff6b00]" />
                  <span>DOT-inspected hydraulic dumps, tilt decks, & utility trailers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#ff6b00]" />
                  <span>Customer yard pickup available 7 days a week</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#ff6b00]" />
                  <span>Decatur & Mt. Zion job site delivery available</span>
                </div>
              </div>
            </div>

            {/* Right Estimator Controls */}
            <div className="lg:col-span-7 bg-[#121414] p-5 sm:p-6 rounded-lg border border-white/10 space-y-5">
              {/* Select Unit */}
              <div>
                <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-2">
                  Select Equipment Unit
                </label>
                <select
                  value={estTrailerId}
                  onChange={(e) => setEstTrailerId(e.target.value)}
                  className="w-full bg-[#1e2020] border border-white/20 text-white rounded p-3 text-sm focus:border-[#ff6b00] focus:outline-none"
                >
                  {FLEET_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (${item.dailyRate}/day - {item.specs.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration & Delivery Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-2">
                    Rental Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 3, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setEstDays(days)}
                        className={`py-2.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                          estDays === days
                            ? 'bg-[#ff6b00] text-black border-[#ff6b00] shadow-md shadow-orange-500/20'
                            : 'bg-[#1e2020] text-[#c8c6c5] border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#bab8b7] uppercase tracking-wider mb-2">
                    Fulfillment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEstFulfillment('pickup')}
                      className={`py-2.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                        estFulfillment === 'pickup'
                          ? 'bg-[#ff6b00] text-black border-[#ff6b00] shadow-md shadow-orange-500/20'
                          : 'bg-[#1e2020] text-[#c8c6c5] border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      Self Tow ($0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstFulfillment('delivery')}
                      className={`py-2.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                        estFulfillment === 'delivery'
                          ? 'bg-[#ff6b00] text-black border-[#ff6b00] shadow-md shadow-orange-500/20'
                          : 'bg-[#1e2020] text-[#c8c6c5] border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      Site Delivery ($50)
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Output Bar */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#1e2020] border border-[#ff6b00]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <div className="text-xs text-[#bab8b7] uppercase tracking-wider font-bold">
                    Estimated Base Quote
                  </div>
                   <div className="font-display text-2xl sm:text-3xl text-white">
                    ${calculateEstimate()}
                    <span className="text-xs text-[#ff6b00] ml-2 font-normal font-sans font-semibold">
                      ({estDays} {estDays === 1 ? 'day' : 'days'} • {estFulfillment === 'pickup' ? 'Yard Pickup' : 'Delivered'})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookSelected(selectedEstTrailer.id)}
                  className="btn-primary px-6 py-3 text-sm font-bold uppercase cursor-pointer whitespace-nowrap"
                >
                  <span>RESERVE AT THIS RATE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-10 rounded-xl bg-[#161818] border border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
                VERIFIED OPERATORS
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
                BUILT ON TRUST & POWER
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-[#ff6b00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#ff6b00]" />
                ))}
                <span className="text-white font-bold ml-2 text-sm">5.0 / 5.0 Rating</span>
              </div>
              <button
                onClick={() => {
                  onNavigate('testimonials');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#ff6b00] hover:text-white uppercase tracking-wider cursor-pointer underline flex items-center gap-1 transition-colors"
              >
                <span>All Reviews ({TESTIMONIALS.length}) →</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-lg bg-[#1e2020] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-[#ff6b00]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ff6b00]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#bab8b7] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-xs text-[#ff6b00]">
                    {t.role} • {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 SERVICE AREAS HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-xl bg-[#181a1a] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                LOCAL DELIVERY DISPATCH
              </div>
              <h2 className="font-display text-xl sm:text-3xl text-white uppercase">
                AREAS & TOWNS SERVED
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('areas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6b00] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Explore All 12+ Areas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#bab8b7]">
            We deliver direct to driveways, farms, and job sites across all of Macon County and Central Illinois:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {[
              'Forsyth',
              'Long Creek',
              'Harristown',
              'Oreana',
              'Elwin',
              'Boody',
              'Macon',
              'Warrensburg',
              'Argenta',
              'Maroa',
              'Blue Mound',
              'Niantic'
            ].map((town) => (
              <button
                key={town}
                onClick={() => {
                  onNavigate('areas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#ff6b00] hover:text-black border border-white/10 hover:border-[#ff6b00] text-left transition-all group cursor-pointer"
              >
                <span className="font-semibold text-xs text-white group-hover:text-black block truncate">
                  {town}
                </span>
                <span className="text-[10px] text-[#8e8d8c] group-hover:text-black/80 block mt-0.5">
                  Macon County
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-5 sm:p-12 rounded-2xl bg-gradient-to-r from-[#ff6b00] to-[#e65c00] text-black shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-black">
              OVER 500+ HAULS COMPLETED
            </h2>
            <p className="text-black/90 font-medium text-base sm:text-lg max-w-xl">
              Lock in your commercial trailer rental today. Mount Zion & Decatur staging yard ready for pickup or direct job site delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                onNavigate('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 sm:px-8 sm:py-4 bg-black hover:bg-[#1a1c1c] text-white font-bold text-base sm:text-lg uppercase tracking-wider rounded-lg border border-black/50 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>RESERVE YOUR RIG</span>
              <ArrowRight className="w-5 h-5 text-[#ff6b00]" />
            </button>
            <a
              href="tel:12178537475"
              className="px-4 py-3 sm:px-6 sm:py-4 bg-black/10 hover:bg-black/20 text-black font-bold text-base sm:text-lg uppercase tracking-wider rounded-lg border border-black/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              (217) 853-7475
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

