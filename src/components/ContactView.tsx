import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Navigation,
  ExternalLink,
  MessageSquare,
  Calendar,
  Facebook
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Equipment Availability');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight">
          CONTACT <span className="text-[#ff6b00]">US</span>
        </h1>
        <p className="text-sm sm:text-base text-[#bab8b7] leading-relaxed">
          Have a question about trailer availability, custom rental schedules, or job site delivery? Send us a message or reach out directly to our team.
        </p>
      </div>

      {/* 1. CONTACT FORM (FIRST) */}
      <section className="bg-[#181a1a] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b00] via-[#ff8833] to-[#ff6b00]" />
        
        <div className="mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Send a Message</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-white uppercase">
            Rental Inquiry & Support Form
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8d8c] mt-1">
            Fill out the details below and we will get back to you promptly.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 sm:p-12 rounded-xl bg-[#121414] border border-emerald-500/40 text-center space-y-4 animate-in fade-in duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase">
              Message Sent Successfully
            </h3>
            <p className="text-sm text-[#bab8b7] max-w-md mx-auto leading-relaxed">
              Thank you for contacting Hitch & Haul Trailer Rental LLC. We have received your inquiry and our team will get in touch with you shortly.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFullName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#bab8b7] uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#111313] border border-white/15 text-white rounded-lg px-4 py-3.5 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none transition-all placeholder-[#555]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bab8b7] uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="(217) 853-7475"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#111313] border border-white/15 text-white rounded-lg px-4 py-3.5 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none transition-all placeholder-[#555]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#bab8b7] uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111313] border border-white/15 text-white rounded-lg px-4 py-3.5 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none transition-all placeholder-[#555]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bab8b7] uppercase tracking-wider mb-2">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#111313] border border-white/15 text-white rounded-lg px-4 py-3.5 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none transition-all"
                >
                  <option value="Equipment Availability">Trailer Availability & Pricing</option>
                  <option value="Dump Trailer Rental">Dump Trailer Rental</option>
                  <option value="Car Hauler Rental">Car Hauler / Equipment Trailer</option>
                  <option value="Enclosed Trailer Rental">Enclosed Cargo Trailer</option>
                  <option value="Contractor / Long-Term">Contractor & Multi-Day Rental</option>
                  <option value="General Question">General Inquiries & Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#bab8b7] uppercase tracking-wider mb-2">
                Your Message / Rental Details *
              </label>
              <textarea
                rows={5}
                placeholder="Let us know what trailer you need, rental dates, payload requirements, or any questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#111313] border border-white/15 text-white rounded-lg p-4 text-sm focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] focus:outline-none transition-all placeholder-[#555]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all"
            >
              <Send className="w-5 h-5" />
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </section>

      {/* 2. CONTACT INFO (SECOND) */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-3">
          <h2 className="font-display text-2xl sm:text-3xl text-white uppercase">
            CONTACT <span className="text-[#ff6b00]">INFORMATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8d8c] mt-1">
            Reach us directly by phone, email, or visit our primary staging location.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Phone Card */}
          <a
            href="tel:12178537475"
            className="p-5 sm:p-6 rounded-xl bg-[#181a1a] border border-white/10 hover:border-[#ff6b00] transition-all group block space-y-3"
          >
            <div className="h-11 w-11 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] group-hover:bg-[#ff6b00] group-hover:text-black transition-colors flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8e8d8c] tracking-wider block">
                Call / Text Support
              </span>
              <span className="font-display text-xl sm:text-2xl text-white group-hover:text-[#ff6b00] transition-colors block mt-1">
                (217) 853-7475
              </span>
              <span className="text-xs text-[#8e8d8c] block mt-1">
                Reservations & quotes
              </span>
            </div>
          </a>

          {/* Email Card */}
          <a
            href="mailto:hitchandhaul330@gmail.com"
            className="p-5 sm:p-6 rounded-xl bg-[#181a1a] border border-white/10 hover:border-[#ff6b00] transition-all group block space-y-3"
          >
            <div className="h-11 w-11 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] group-hover:bg-[#ff6b00] group-hover:text-black transition-colors flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8e8d8c] tracking-wider block">
                Email Address
              </span>
              <span className="font-semibold text-sm sm:text-base text-white group-hover:text-[#ff6b00] transition-colors block mt-1 truncate">
                hitchandhaul330@gmail.com
              </span>
              <span className="text-xs text-[#8e8d8c] block mt-1">
                Inquiries & requests
              </span>
            </div>
          </a>

          {/* Facebook Page Card */}
          <a
            href="https://www.facebook.com/share/1dNDWyYaMy/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 sm:p-6 rounded-xl bg-[#181a1a] border border-white/10 hover:border-[#1877F2] transition-all group block space-y-3"
          >
            <div className="h-11 w-11 rounded-lg bg-[#1877F2]/15 text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-colors flex items-center justify-center shadow-sm">
              <div className="w-6 h-6 rounded-full bg-[#1877F2] group-hover:bg-white flex items-center justify-center transition-colors">
                <Facebook className="w-3.5 h-3.5 fill-white text-white group-hover:fill-[#1877F2] group-hover:text-[#1877F2] transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8e8d8c] tracking-wider block">
                Official Facebook
              </span>
              <span className="font-display text-xl sm:text-2xl text-white group-hover:text-[#1877F2] transition-colors block mt-1">
                Hitch & Haul
              </span>
              <span className="text-xs text-[#8e8d8c] block mt-1 flex items-center gap-1">
                <span>View Facebook Page</span>
                <ExternalLink className="w-3 h-3 text-[#1877F2]" />
              </span>
            </div>
          </a>

          {/* Location Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#181a1a] border border-white/10 space-y-3">
            <div className="h-11 w-11 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8e8d8c] tracking-wider block">
                Primary Location
              </span>
              <span className="font-display text-xl sm:text-2xl text-white block mt-1">
                Mount Zion & Decatur
              </span>
              <span className="text-xs text-[#8e8d8c] block mt-1">
                Serving Macon County, IL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOURS OF OPERATION (THIRD) */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-3">
          <h2 className="font-display text-2xl sm:text-3xl text-white uppercase flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#ff6b00]" />
            HOURS OF <span className="text-[#ff6b00]">OPERATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8d8c] mt-1">
            Standard pick-up, return, and phone support hours.
          </p>
        </div>

        <div className="bg-[#181a1a] border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="divide-y divide-white/10">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#ff6b00]" />
                <span className="font-semibold text-white text-sm sm:text-base">Monday – Friday</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm sm:text-base text-white font-medium">7:00 AM – 6:00 PM</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Open
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#ff6b00]" />
                <span className="font-semibold text-white text-sm sm:text-base">Saturday</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm sm:text-base text-white font-medium">8:00 AM – 2:00 PM</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Open
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#141616]">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#bab8b7]" />
                <span className="font-semibold text-[#bab8b7] text-sm sm:text-base">Sunday</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-[#ff6b00] font-semibold">By Appointment / Emergency Rentals</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-orange-500/10 text-[#ff6b00] border border-orange-500/30">
                  On Call
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LOCATION MAP (FOURTH) */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white uppercase flex items-center gap-2.5">
              <Navigation className="w-6 h-6 text-[#ff6b00]" />
              LOCATION & <span className="text-[#ff6b00]">SERVICE AREA</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8e8d8c] mt-1">
              Conveniently serving Mount Zion, Decatur, Forsyth, Long Creek, and throughout Macon County.
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mount+Zion+IL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6b00] hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Map Container */}
        <div className="bg-[#181a1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-80 sm:h-96">
            <iframe
              title="Hitch & Haul Service Area - Mount Zion and Decatur IL"
              src="https://maps.google.com/maps?q=Mount%20Zion%2C%20IL&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter grayscale-[25%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-5 sm:p-6 bg-[#141616] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white uppercase tracking-wide">
                Mount Zion & Decatur Service Area
              </div>
              <div className="text-xs text-[#8e8d8c]">
                Quick trailer pickup and site delivery across all surrounding central Illinois communities.
              </div>
            </div>
            <button
              onClick={() => onNavigate('fleet')}
              className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              Browse Available Trailers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
