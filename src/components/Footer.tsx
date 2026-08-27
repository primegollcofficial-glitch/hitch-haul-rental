import React from 'react';
import { NavTab } from '../types';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import logoImg from '../assets/images/logo_clean.png';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSpecs: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSpecs, onOpenTerms }) => {
  const logoUrl = logoImg;

  const handleLink = (tab: NavTab) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 text-[#c8c6c5] relative overflow-hidden">
      {/* Top Hazard Accent Stripe */}
      <div className="h-2 w-full hazard-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Col 1: Brand & Headquarters */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Hitch & Haul Trailer Rental LLC Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display text-2xl text-[#ff6b00] tracking-wider leading-none">
                  HITCH & HAUL
                </h3>
                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mt-0.5">
                  TRAILER RENTAL LLC
                </span>
              </div>
            </div>
            <p className="text-xs text-[#8e8d8c] leading-relaxed">
              Heavy-duty hydraulic dump trailers, car haulers, and commercial equipment trailers serving Central Illinois.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-white/15 rounded text-xs text-[#bab8b7]">
              <span className="h-2 w-2 rounded-full bg-[#ff6b00]"></span>
              <span>MOUNT ZION & DECATUR, IL</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (All Navbar Buttons) */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-display text-base text-white uppercase tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-[#bab8b7]">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('fleet')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  Trailer Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('testimonials')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('faq')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  FAQ & Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('areas')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium flex items-center gap-1.5"
                >
                  <span>Areas</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ff6b00]/10 text-[#ff6b00] text-[10px] font-bold">12+ Towns</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left font-medium"
                >
                  Contact
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => handleLink('booking')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:text-white uppercase tracking-wider cursor-pointer transition-colors"
                >
                  <span>Book / Reserve Now →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Areas Coverage */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-display text-base text-white uppercase tracking-wider">
              SERVICE AREAS
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => handleLink('areas')}
                className="text-[#ff6b00] hover:underline font-semibold text-xs block cursor-pointer"
              >
                View All 12+ Areas →
              </button>
              <div className="text-[11px] text-[#8e8d8c] leading-relaxed break-words">
                Forsyth, Long Creek, Harristown, Oreana, Elwin, Boody, Macon, Warrensburg, Argenta, Maroa, Blue Mound, Niantic, Mt. Zion & Decatur.
              </div>
              <div className="pt-1 text-[11px] text-[#bab8b7]">
                Direct driveway & job site delivery throughout Macon County.
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-display text-base text-white uppercase tracking-wider">
              DIRECT DISPATCH
            </h4>
            <ul className="space-y-2.5 text-[#bab8b7]">
              <li>
                <a
                  href="tel:12178537475"
                  className="hover:text-[#ff6b00] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                  <span className="font-semibold text-white">(217) 853-7475</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hitchandhaul330@gmail.com"
                  className="hover:text-[#ff6b00] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                  <span className="truncate">hitchandhaul330@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#bab8b7]">
                <MapPin className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                <span>Mount Zion & Decatur, IL</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="https://www.facebook.com/share/1dNDWyYaMy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1877F2]/15 border border-white/15 hover:border-[#1877F2] text-white transition-all group"
                aria-label="Visit Hitch and Haul Trailer Rental on Facebook"
              >
                <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Facebook className="w-3 h-3 fill-white text-white" />
                </div>
                <span className="font-semibold text-xs text-white group-hover:text-[#1877F2] transition-colors">
                  Official Facebook Page
                </span>
              </a>
            </div>
          </div>

          {/* Col 5: Legal & Specs */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-display text-base text-white uppercase tracking-wider">
              LEGAL & SPECS
            </h4>
            <ul className="space-y-2 text-[#bab8b7]">
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSpecs}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Equipment Specifications
                </button>
              </li>
              <li>
                <span className="text-[11px] text-[#8e8d8c] block pt-1">
                  Fully Insured & DOT Certified Fleet
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8d8c]">
          <p>© 2026 Hitch & Haul Trailer Rental LLC. All rights reserved.</p>
          <p className="text-[11px] text-[#717171]">
            Mount Zion & Decatur, IL • Commercial & Residential Trailer Rentals
          </p>
        </div>
      </div>
    </footer>
  );
};

