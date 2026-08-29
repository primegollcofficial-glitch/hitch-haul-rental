import React, { useState, useRef, useEffect } from 'react';
import { NavTab } from '../types';
import { SERVICE_AREAS } from '../data/serviceAreasData';
import { Menu, X, Phone, ShieldCheck, MapPin, Calendar, Truck, ArrowRight, ChevronDown } from 'lucide-react';
import logoImg from '../assets/images/logo_clean.png';

interface NavbarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileAreasExpanded, setMobileAreasExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logoUrl = logoImg;

  // Full list used by the mobile drawer
  const navLinks: { tab: NavTab; label: string; hasDropdown?: boolean }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'fleet', label: 'Trailer Fleet' },
    { tab: 'about', label: 'About Us' },
    { tab: 'testimonials', label: 'Testimonials' },
    { tab: 'faq', label: 'FAQ & Specs' },
    { tab: 'areas', label: 'Areas', hasDropdown: true },
    { tab: 'contact', label: 'Contact' },
    { tab: 'return', label: 'Return / Checkout' },
  ];

  // Desktop: keep the most-used links visible, the rest tucked under "More" so the bar stays clean
  const desktopPrimary: { tab: NavTab; label: string }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'fleet', label: 'Trailer Fleet' },
    { tab: 'about', label: 'About Us' },
    { tab: 'areas', label: 'Areas' },
    { tab: 'contact', label: 'Contact' },
  ];
  const desktopMore: { tab: NavTab; label: string }[] = [
    { tab: 'testimonials', label: 'Testimonials' },
    { tab: 'faq', label: 'FAQ & Specs' },
    { tab: 'return', label: 'Return / Checkout' },
    { tab: 'admin', label: 'Admin Panel' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAreasDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    setAreasDropdownOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAreaSelect = (areaId: string) => {
    onNavigate('areas');
    setAreasDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`area-${areaId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 shadow-2xl">
      {/* Main Navigation Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-h-16 sm:min-h-20 py-2.5 sm:py-3">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group text-left cursor-pointer focus:outline-none"
            aria-label="Hitch and Haul Trailer Rental LLC Homepage"
          >
            <div className="relative h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src={logoUrl}
                alt="Hitch & Haul Trailer Rental LLC Logo"
                className="w-full h-full object-contain object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center flex-shrink-0 min-w-0">
              <span className="font-display text-lg sm:text-2xl lg:text-3xl tracking-wider text-white group-hover:text-[#ff6b00] transition-colors leading-none whitespace-nowrap">
                HITCH & HAUL
              </span>
              <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-[#ff6b00] uppercase mt-0.5 sm:mt-1 whitespace-nowrap">
                TRAILER RENTAL LLC
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 min-w-0" ref={dropdownRef}>
            {desktopPrimary.map((link) => {
              const isActive = activeTab === link.tab;

              if (link.tab === 'areas') {
                return (
                  <div
                    key={link.tab}
                    className="relative"
                    onMouseEnter={() => setAreasDropdownOpen(true)}
                    onMouseLeave={() => setAreasDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick('areas')}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 relative cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'text-white bg-white/10 shadow-sm'
                          : 'text-[#c8c6c5] hover:text-white hover:bg-white/5'
                      }`}
                      aria-expanded={areasDropdownOpen}
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${areasDropdownOpen ? 'rotate-180 text-[#ff6b00]' : 'text-[#8e8d8c]'}`} />
                      {isActive && (
                        <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#ff6b00] rounded-full" />
                      )}
                    </button>

                    {/* Areas Mega/Menu */}
                    {areasDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] max-w-[90vw] p-4 bg-[#0a0a0a] border border-white/15 rounded-2xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#ff6b00]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                              Macon County Service Areas
                            </span>
                          </div>
                          <button
                            onClick={() => handleNavClick('areas')}
                            className="text-[11px] font-bold text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>View All Areas</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
                          {SERVICE_AREAS.map((area) => (
                            <button
                              key={area.id}
                              onClick={() => handleAreaSelect(area.id)}
                              className="w-full text-left px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#ff6b00] hover:text-black transition-colors group/item flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <span className="font-semibold text-xs text-white group-hover/item:text-black block">
                                  {area.name}
                                </span>
                                <span className="text-[10px] text-[#8e8d8c] group-hover/item:text-black/80 block">
                                  {area.distanceFromHub}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400 group-hover/item:text-black">
                                {area.deliveryTime}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/10 text-center">
                          <span className="text-[10px] text-[#8e8d8c]">
                            Fast dispatch from Mt. Zion & Decatur • Same-day drop-off available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.tab}
                  onClick={() => handleNavClick(link.tab)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 relative cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-[#c8c6c5] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#ff6b00] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* More dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                onClick={() => setMoreDropdownOpen((v) => !v)}
                className="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 relative cursor-pointer flex items-center gap-1.5 text-[#c8c6c5] hover:text-white hover:bg-white/5"
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#ff6b00]' : 'text-[#8e8d8c]'}`} />
              </button>
              {moreDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-52 p-1.5 bg-[#0a0a0a] border border-white/15 rounded-xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  {desktopMore.map((link) => {
                    const isActive = activeTab === link.tab;
                    return (
                      <button
                        key={link.tab}
                        onClick={() => handleNavClick(link.tab)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#ff6b00] text-black'
                            : 'text-[#c8c6c5] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-white/30'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Actions (lg+) */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <a
              href="tel:12178537475"
              className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-white/15 bg-[#111111] hover:bg-[#1a1a1a] hover:border-white/30 text-white text-xs font-bold tracking-wider transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="whitespace-nowrap">(217) 853-7475</span>
            </a>
            <button
              onClick={() => handleNavClick('booking')}
              className="btn-primary text-sm uppercase px-5 py-2.5 shadow-md shadow-orange-500/20 group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">BOOK A TRAILER</span>
            </button>
          </div>

          {/* Mobile & Tablet Right Controls (<lg) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <a
              href="tel:12178537475"
              className="p-2.5 rounded-lg border border-white/15 bg-[#111111] text-[#ff6b00] hover:text-white hover:border-white/30 focus:outline-none transition-colors sm:hidden"
              aria-label="Call phone"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleNavClick('booking')}
              className="btn-primary text-xs sm:text-sm uppercase px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span className="hidden sm:inline">BOOK A TRAILER</span>
              <span className="sm:hidden">BOOK</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-white/15 bg-[#111111] text-white hover:text-[#ff6b00] hover:border-white/30 focus:outline-none cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-b border-white/15 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1.5 pb-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.tab;

              if (link.tab === 'areas') {
                return (
                  <div key={link.tab} className="space-y-1">
                    <div
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all ${
                        isActive
                          ? 'bg-[#ff6b00] text-black font-bold shadow'
                          : 'bg-[#111111] text-white border border-white/5'
                      }`}
                    >
                      <button
                        onClick={() => handleNavClick('areas')}
                        className="flex-1 text-left flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{link.label} (All Towns)</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileAreasExpanded(!mobileAreasExpanded);
                        }}
                        className="p-1 rounded hover:bg-white/10 cursor-pointer"
                        aria-label="Toggle area list"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAreasExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Mobile Expanded Areas List */}
                    {mobileAreasExpanded && (
                      <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-[#0a0a0a] border border-white/10">
                        {SERVICE_AREAS.map((area) => (
                          <button
                            key={area.id}
                            onClick={() => handleAreaSelect(area.id)}
                            className="text-left px-2.5 py-1.5 rounded bg-[#161616] hover:bg-[#ff6b00] hover:text-black text-[11px] font-medium text-[#c8c6c5] transition-colors truncate cursor-pointer flex items-center justify-between"
                          >
                            <span className="truncate">{area.name}</span>
                            <span className="text-[9px] font-mono text-emerald-400 pl-1">{area.deliveryTime}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.tab}
                  onClick={() => handleNavClick(link.tab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all ${
                    isActive
                      ? 'bg-[#ff6b00] text-black font-bold shadow'
                      : 'bg-[#111111] text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-black' : 'text-white/40'}`} />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <button
              onClick={() => handleNavClick('booking')}
              className="w-full btn-primary py-3.5 text-base uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>RESERVE A TRAILER NOW</span>
            </button>

            <a
              href="tel:12178537475"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#111111] text-white text-sm font-semibold border border-white/10 hover:border-[#ff6b00] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#ff6b00]" />
              <span>(217) 853-7475 • Direct Dispatch</span>
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                activeTab === 'admin'
                  ? 'bg-[#ff6b00] text-black font-bold shadow'
                  : 'bg-[#111111] text-white border border-white/10 hover:border-[#ff6b00]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
              <span>Admin Panel</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-[#8e8d8c] py-1">
              <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Mount Zion & Decatur, IL Service Yard</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
