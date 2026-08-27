import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#181a1a] border-2 border-white/20 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#ff6b00]/10 text-[#ff6b00]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl text-white uppercase">
                RENTAL AGREEMENT & LIABILITY POLICY
              </h2>
              <p className="text-xs text-[#8e8d8c]">
                Hitch & Haul Trailer Rental LLC (Decatur / Mt. Zion, IL)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#121414] hover:bg-[#282a2b] text-white border border-white/15 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#bab8b7] max-h-[60vh] overflow-y-auto pr-2">
          <section className="space-y-1">
            <h3 className="font-bold text-white uppercase text-sm text-[#ff6b00]">
              1. Tow Vehicle Compliance & Operator Eligibility
            </h3>
            <p>
              The renter represents and warrants that the tow vehicle is properly rated to tow the gross weight of the rented unit and payload. The operator must possess a valid, unrestricted driver's license and maintain current automobile insurance with liability coverage extending to the trailer.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-bold text-white uppercase text-sm text-[#ff6b00]">
              2. Security Deposit & Return Condition
            </h3>
            <p>
              A pre-authorization hold ($250-$350 depending on equipment category) is held on the renter's card upon checkout. Equipment must be returned in the same condition as dispatched, swept clean of excessive aggregate, and with tires, ramps, and hydraulic remotes intact. Deposits are released upon check-in inspection.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-bold text-white uppercase text-sm text-[#ff6b00]">
              3. Cargo Regulations & Prohibited Materials
            </h3>
            <p>
              Trailer loads must be securely tarped or tied down before traveling on public roadways. Strict ban on hauling hazardous waste, biomedical refuse, unsealed liquid chemicals, and flammable fuels without certified transport placards.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-bold text-white uppercase text-sm text-[#ff6b00]">
              4. Safe Loading & Weight Distribution
            </h3>
            <p>
              Load must be distributed with approximately 60% of cargo weight forward of the trailer axle centerline to prevent hazardous tongue sway. Tie-down straps and chains must be secured to structural D-rings only.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wider cursor-pointer"
          >
            I UNDERSTAND & ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
};
