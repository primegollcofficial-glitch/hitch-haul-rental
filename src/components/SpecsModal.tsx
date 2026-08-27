import React from 'react';
import { useData } from '../DataContext';
import { X, FileText, ShieldCheck } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  const { fleet } = useData();
  const FLEET_ITEMS = fleet;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#181a1a] border-2 border-[#ff6b00] rounded-xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl my-4 sm:my-8 relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/30 flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-2xl lg:text-3xl text-white uppercase leading-tight">
                TECHNICAL LOAD & FLEET SPECS
              </h2>
              <p className="text-[10px] sm:text-xs text-[#8e8d8c] mt-1 hidden sm:block">
                Hitch & Haul Trailer Rental LLC - Mount Zion / Decatur Staging Yard Master Engineering Sheet (DOT Spec Rev 2026.1)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#121414] hover:bg-[#282a2b] text-white border border-white/15 cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Table (sm+) */}
        <div className="hidden sm:block overflow-x-auto border border-white/10 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#121414] text-white uppercase font-display text-sm tracking-wider">
              <tr>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">Unit Model</th>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">GVWR Rating</th>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">Payload Cap.</th>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">Coupler Size</th>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">Brakes & Axles</th>
                <th className="p-3.5 border-b border-white/10 whitespace-nowrap">Lift / Winch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[#bab8b7]">
              {FLEET_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-white whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="p-3.5 font-mono text-white">
                    {item.specs.axleRating || '14,000 lbs'}
                  </td>
                  <td className="p-3.5 font-mono text-[#ff6b00] font-semibold">
                    {item.specs.capacity}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {item.specs.hitchSize || '2-5/16"'}
                  </td>
                  <td className="p-3.5">
                    {item.specs.brakes || 'Dual Axle Electric'}
                  </td>
                  <td className="p-3.5">
                    {item.specs.liftSystem || item.specs.recovery || 'Heavy-Duty Ramps'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (< sm) */}
        <div className="sm:hidden space-y-3">
          {FLEET_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-[#121414] border border-white/10 rounded-lg p-3.5 space-y-2"
            >
              <div className="font-display text-sm text-white uppercase font-bold">
                {item.name}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                <div>
                  <span className="text-[#8e8d8c] uppercase text-[9px] font-bold tracking-wider block">GVWR</span>
                  <span className="text-white font-mono">{item.specs.axleRating || '14,000 lbs'}</span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] uppercase text-[9px] font-bold tracking-wider block">Payload</span>
                  <span className="text-[#ff6b00] font-mono font-semibold">{item.specs.capacity}</span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] uppercase text-[9px] font-bold tracking-wider block">Coupler</span>
                  <span className="text-[#bab8b7]">{item.specs.hitchSize || '2-5/16"'}</span>
                </div>
                <div>
                  <span className="text-[#8e8d8c] uppercase text-[9px] font-bold tracking-wider block">Brakes</span>
                  <span className="text-[#bab8b7]">{item.specs.brakes || 'Dual Axle Electric'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#8e8d8c] uppercase text-[9px] font-bold tracking-wider block">Lift / Winch</span>
                  <span className="text-[#bab8b7]">{item.specs.liftSystem || item.specs.recovery || 'Heavy-Duty Ramps'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Towing Vehicle Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#bab8b7] bg-[#121414] p-4 rounded-lg border border-white/10">
          <div className="space-y-1.5">
            <span className="font-bold text-white uppercase block text-[11px] text-[#ff6b00]">
              Towing Electrical Standard
            </span>
            <p>
              Requires standard 7-way RV Blade connector wired to pin standard J560 for electric brake engagement and charging of onboard breakaway batteries.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-bold text-white uppercase block text-[11px] text-[#ff6b00]">
              Weight & Tongue Distribution
            </span>
            <p>
              Distribute approximately 60% of cargo weight in front of the trailer axle centerline to prevent hazardous tongue sway. Secure loads to welded D-rings.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
            All units DOT compliant and inspected daily.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto btn-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wider cursor-pointer"
          >
            CLOSE SPEC SHEET
          </button>
        </div>
      </div>
    </div>
  );
};
