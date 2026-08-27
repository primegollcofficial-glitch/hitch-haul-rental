import React from 'react';
import { NavTab } from '../types';
import { TESTIMONIALS } from '../data/testimonialsData';
import yardDispatchImg from '../assets/images/hero_trailer_yard_1787680113183.jpg';
import {
  ShieldCheck,
  Award,
  Truck,
  Wrench,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-16">
      {/* 1. Header & Hero Story */}
      <div className="border-b border-white/10 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight leading-[0.95]">
              BUILT FOR THE <br />
              <span className="text-[#ff6b00]">HEAVY LIFT</span>
            </h1>

            <p className="text-base sm:text-lg text-[#bab8b7] leading-relaxed">
              Hitch & Haul Trailer Rental LLC was founded with a singular mission: providing contractor-grade, ultra-dependable hauling equipment to Decatur, Mount Zion, and surrounding Central Illinois communities without the typical rental yard headaches.
            </p>

            <div className="p-5 rounded-lg bg-[#1a1c1c] border-l-4 border-[#ff6b00] border-y border-r border-white/10 space-y-2">
              <div className="font-display text-lg text-white uppercase">Our Commitment to Operators</div>
              <p className="text-xs sm:text-sm text-[#bab8b7] leading-relaxed">
                Whether you're a commercial general contractor tearing out a retail storefront, a tree service handling storm damage, or a homeowner clearing out a garage, our trailers are maintained to strict DOT standards so you can work safely and stay on schedule.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                <span>Zero Corporate Red Tape</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                <span>24/7 Yard Dispatch Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                <span>Transparent Daily & Weekly Rates</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-visible">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <img
                src={yardDispatchImg}
                alt="Hitch & Haul local trailer dispatch yard in Mount Zion Decatur"
                className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <div className="inline-block px-3 py-1 bg-[#ff6b00] text-black font-display text-xs uppercase tracking-wider rounded font-bold">
                  DECATUR • MT ZION
                </div>
                <div className="font-display text-xl sm:text-2xl text-white uppercase">
                  LOCAL DISPATCH YARD
                </div>
                <p className="text-xs text-[#c8c6c5]">
                  Equipped with dual 7,000 lb axles, scissor hydraulic dumps, and 12,000 lb recovery winches.
                </p>
              </div>
            </div>
            {/* Corner Badge */}
            <div className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-black border-2 border-[#ff6b00] text-white p-3 rounded-lg shadow-xl font-display text-center">
              <div className="text-xl sm:text-2xl text-[#ff6b00]">100%</div>
              <div className="text-[9px] uppercase tracking-wider text-[#bab8b7]">Locally Owned</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Pillars Bento */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
            THE HITCH & HAUL STANDARD
          </div>
          <h2 className="font-display text-2xl sm:text-5xl text-white uppercase">
            OPERATIONAL PILLARS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 sm:p-7 rounded-xl bg-[#1a1c1c] border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center text-[#ff6b00]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase">
              1. INDUSTRIAL HARDWARE
            </h3>
            <p className="text-sm text-[#bab8b7] leading-relaxed">
              We exclusively deploy commercial trailers built with 10-gauge structural steel floors, dual Dexter brake axles, radial heavy-ply tires, and high-amp scissor hoists.
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-xl bg-[#1a1c1c] border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center text-[#ff6b00]">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase">
              2. PROACTIVE MAINTENANCE
            </h3>
            <p className="text-sm text-[#bab8b7] leading-relaxed">
              Every unit is thoroughly inspected post-return. Bearings are packed, hydraulic reservoirs checked, lights verified, and tire pressures adjusted so your haul is safe.
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-xl bg-[#1a1c1c] border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center text-[#ff6b00]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase">
              3. CONTRACTOR PARTNERSHIP
            </h3>
            <p className="text-sm text-[#bab8b7] leading-relaxed">
              We understand job timelines. If you need early 6:00 AM pickups or same-day empty & swap on an active roof tear-off, we bend over backward to make it happen.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Verified Contractor Reviews */}
      <div className="p-5 sm:p-10 rounded-xl bg-[#181a1a] border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
              WHAT OUR OPERATORS SAY
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white uppercase">
              BUILT ON TRUST
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#bab8b7]">
            <Star className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
            <span className="font-bold text-white">5.0 Star Rating</span>
            <span>across Central Illinois</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-lg bg-[#121414] border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-[#ff6b00]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ff6b00]" />
                  ))}
                </div>
                <p className="text-xs text-[#bab8b7] italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="font-bold text-white text-xs">{t.author}</div>
                <div className="text-[11px] text-[#ff6b00]">
                  {t.role} • {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => {
              onNavigate('testimonials');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#ff6b00] text-white hover:text-black border border-white/15 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>View All Verified Customer Reviews ({TESTIMONIALS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Callout Banner */}
      <div className="p-5 sm:p-12 rounded-xl bg-[#1e2020] border-2 border-[#ff6b00] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
            READY TO ROLL?
          </div>
          <h3 className="font-display text-3xl sm:text-4xl text-white uppercase">
            LET'S GET YOUR EQUIPMENT STAGED
          </h3>
          <p className="text-sm text-[#bab8b7] max-w-lg">
            Book online in 2 minutes or reach our direct dispatch line to check today's available yard units.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              onNavigate('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary px-5 py-3 sm:px-8 sm:py-3.5 text-base uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/25 group"
          >
            <span>RESERVE NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="tel:12178537475"
            className="px-6 py-3.5 rounded-lg bg-[#141616] hover:bg-[#282a2b] text-white border border-white/20 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#ff6b00]" />
            (217) 853-7475
          </a>
        </div>
      </div>
    </div>
  );
};
