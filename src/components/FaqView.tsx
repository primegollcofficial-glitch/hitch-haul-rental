import React, { useState } from 'react';
import { NavTab } from '../types';
import { FAQ_ITEMS } from '../data/faqData';
import {
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Info,
  Phone,
  ArrowRight,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface FaqViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSpecs: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate, onOpenSpecs }) => {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id, FAQ_ITEMS[1].id]);

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* 1. Header */}
      <div className="border-b border-white/10 pb-8 space-y-2">
        <h1 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight">
          OPERATIONAL <span className="text-[#ff6b00]">INTELLIGENCE</span>
        </h1>
        <p className="text-sm sm:text-base text-[#bab8b7] max-w-3xl">
          Everything you need to know about tow ratings, coupler requirements, insurance verification, security deposits, and Macon County disposal protocols.
        </p>
      </div>

      {/* 2. Critical Warning / Manual Box */}
      <div className="p-6 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-wide">
              OPERATOR SAFETY & COMPLIANCE MANDATE
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-2xl">
              All operators must verify hitch class, ball size, and tire load ratings before leaving the Mount Zion staging yard. Never exceed rated gross vehicle weight ratings (GVWR).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSpecs}
          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0 shadow-md shadow-amber-500/20"
        >
          <FileText className="w-4 h-4" />
          VIEW TECHNICAL MANUAL
        </button>
      </div>

      {/* 3. Interactive Accordion Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#1a1c1c] border border-white/10 hover:border-white/20 transition-colors overflow-hidden shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1">
                    <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ff6b00]">
                      {item.category}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8e8d8c] hidden sm:block">
                      {item.summary}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#121414] text-[#ff6b00] border border-white/10 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-sm text-[#bab8b7] space-y-4 border-t border-white/5 animate-in fade-in duration-150">
                    <p className="leading-relaxed text-xs sm:text-sm">
                      {item.content}
                    </p>

                    {item.bullets && (
                      <div className="p-4 rounded-lg bg-[#141616] border border-white/10 space-y-2">
                        {item.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e2e2e2]">
                            <CheckCircle className="w-4 h-4 text-[#ff6b00] flex-shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-xl bg-[#1e2020] border border-white/15 space-y-4 shadow-xl">
            <h4 className="font-display text-xl sm:text-2xl text-white uppercase">
              NEED IMMEDIATE ASSISTANCE?
            </h4>
            <p className="text-xs text-[#bab8b7] leading-relaxed">
              Have a question regarding custom hauling weights, goosenecks, or weekend return scheduling? Speak directly to our Mount Zion yard dispatcher.
            </p>

            <a
              href="tel:12178537475"
              className="w-full btn-primary py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Phone className="w-4 h-4" />
              CALL (217) 853-7475
            </a>

            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-lg bg-[#141616] hover:bg-[#282a2b] text-white border border-white/20 hover:border-white/30 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Send Dispatch Transmission
            </button>
          </div>

          {/* Towing Rules Summary Card */}
          <div className="p-5 rounded-xl bg-[#161818] border border-white/10 space-y-3 text-xs">
            <div className="font-display text-lg text-white uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ff6b00]" />
              QUICK TOWING CHECKLIST
            </div>
            <ul className="space-y-2 text-[#bab8b7]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                Ensure 2-5/16" solid ball rating &gt; 14,000 lbs
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                Safety chains crossed under tongue in X-pattern
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                Breakaway cable securely fastened to tow hitch
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                Check trailer electric brake gain controller in cab
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
