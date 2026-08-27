import React, { useState, useMemo } from 'react';
import { NavTab, Testimonial } from '../types';
import { TESTIMONIALS } from '../data/testimonialsData';
import {
  Star,
  ShieldCheck,
  MapPin,
  Truck,
  CheckCircle2,
  MessageSquarePlus,
  Phone,
  Calendar,
  ThumbsUp,
  Award,
  Sparkles,
  X
} from 'lucide-react';

interface TestimonialsViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectTrailer?: (trailerId: string) => void;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({
  onNavigate,
  onSelectTrailer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [submittedReview, setSubmittedReview] = useState<boolean>(false);

  // Review form state
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTrailer, setFormTrailer] = useState('14\' Hydraulic Dump Trailer');
  const [formQuote, setFormQuote] = useState('');

  const categories = [
    { id: 'all', label: 'All Reviews' },
    { id: 'contractor', label: 'Contractors & Trades' },
    { id: 'homeowner', label: 'Homeowners & DIY' },
    { id: 'landscaping', label: 'Landscaping' },
    { id: 'roofing', label: 'Roofing' },
    { id: 'hauling', label: 'Auto & Equipment' },
  ];

  const filteredTestimonials = useMemo(() => {
    return TESTIMONIALS.filter((item) => {
      return selectedCategory === 'all' || item.category === selectedCategory;
    });
  }, [selectedCategory]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formQuote) return;
    setSubmittedReview(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setSubmittedReview(false);
      setFormName('');
      setFormQuote('');
      setFormLocation('');
      setFormRole('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#121414] text-[#e2e2e2] pb-20">
      {/* Top Breadcrumb & Header Banner */}
      <section className="bg-black border-b border-white/10 pt-10 pb-8 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b00]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none">
                VERIFIED CUSTOMER <span className="text-[#ff6b00]">TESTIMONIALS</span>
              </h1>
              <p className="text-base sm:text-lg text-[#bab8b7] leading-relaxed">
                Read real feedback from contractors, roofers, landscapers, and homeowners who rely on Hitch & Haul trailers throughout Decatur, Mount Zion, and Central Illinois.
              </p>
            </div>

            {/* Overall Rating Score Card */}
            <div className="bg-[#181818] border-2 border-white/15 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl flex-shrink-0">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-2xl font-bold text-white font-mono">
                  <span className="text-4xl sm:text-5xl font-display text-[#ff6b00]">5.0</span>
                  <span className="text-sm text-[#8e8d8c]">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-[#8e8d8c] block mt-1">
                  100% 5-Star Satisfaction
                </span>
              </div>

              <div className="h-px sm:h-12 w-full sm:w-px bg-white/10" />

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn-primary text-xs uppercase px-4 py-2.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Leave A Review</span>
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="btn-secondary text-xs uppercase px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#ff6b00]" />
                  <span>Reserve Trailer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">100%</div>
                <div className="text-xs text-[#8e8d8c]">DOT Certified & Insured</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">12+ Towns</div>
                <div className="text-xs text-[#8e8d8c]">Macon County Delivery</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">14,000 lbs</div>
                <div className="text-xs text-[#8e8d8c]">Commercial GVWR Fleet</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">Zero</div>
                <div className="text-xs text-[#8e8d8c]">Hidden Mileage Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Filtering & Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#ff6b00] text-black shadow-md shadow-orange-500/20'
                    : 'bg-[#181818] text-[#bab8b7] hover:text-white hover:bg-[#222222] border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Results Summary */}
        <div className="py-4 flex items-center justify-between text-xs text-[#8e8d8c]">
          <span>
            Showing <strong className="text-white">{filteredTestimonials.length}</strong> verified customer reviews
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[#ff6b00] hover:underline cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-12 text-center my-8 space-y-4">
            <MessageSquarePlus className="w-12 h-12 text-[#8e8d8c] mx-auto opacity-50" />
            <h3 className="text-xl font-bold text-white uppercase">No Reviews Found</h3>
            <p className="text-sm text-[#8e8d8c] max-w-md mx-auto">
              No reviews match the selected category. Try selecting a different filter.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary text-xs uppercase px-5 py-2.5"
            >
              Show All Reviews
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredTestimonials.map((review) => (
              <div
                key={review.id}
                className="bg-[#181818] border border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:border-[#ff6b00]/60 transition-all duration-200 group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Rating & Verified Tag Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Renter</span>
                      </span>
                    )}
                  </div>

                  {/* Quote Body */}
                  <p className="text-sm text-[#e2e2e2] leading-relaxed italic">
                    "{review.quote}"
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                  {/* Project and Trailer Tags */}
                  {(review.trailerUsed || review.projectType) && (
                    <div className="space-y-1.5 text-[11px]">
                      {review.trailerUsed && (
                        <div className="flex items-center gap-1.5 text-[#ff6b00] font-medium">
                          <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{review.trailerUsed}</span>
                        </div>
                      )}
                      {review.projectType && (
                        <div className="text-[#8e8d8c]">
                          <span className="font-semibold text-[#bab8b7]">Project: </span>
                          <span>{review.projectType}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Author, Role & Location */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-[#ff6b00] transition-colors">
                        {review.author}
                      </div>
                      <div className="text-xs text-[#8e8d8c]">
                        {review.role}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#bab8b7]">
                        <MapPin className="w-3 h-3 text-[#ff6b00]" />
                        <span>{review.location}</span>
                      </div>
                      {review.date && (
                        <div className="text-[10px] text-[#717171]">
                          {review.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Why Central Illinois Trusts Hitch & Haul Section */}
        <div className="mt-16 bg-gradient-to-br from-[#1b1b1b] to-[#121212] border-2 border-white/15 rounded-3xl p-6 sm:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-full text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE HITCH & HAUL ADVANTAGE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
              WHY OUR RENTERS KEEP COMING BACK
            </h2>
            <p className="text-sm text-[#bab8b7]">
              Built by local equipment operators for contractors, homeowners, and trades who demand reliable commercial-grade trailers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base sm:text-lg text-white uppercase">
                Spotless Maintenance
              </h3>
              <p className="text-xs text-[#8e8d8c] leading-relaxed">
                Tires checked to full pressure, fresh hydraulic fluid, greased axles, and tested electric brakes before every single pickup.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base sm:text-lg text-white uppercase">
                Direct Driveway Delivery
              </h3>
              <p className="text-xs text-[#8e8d8c] leading-relaxed">
                Don't have a tow vehicle? We deliver right to your home driveway, roofing job site, or commercial acreage anywhere in Macon County.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00] font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base sm:text-lg text-white uppercase">
                Transparent Local Pricing
              </h3>
              <p className="text-xs text-[#8e8d8c] leading-relaxed">
                Upfront flat day rates, weekend packages, and contractor multi-day discounts with zero surprise mileage fees or hidden clauses.
              </p>
            </div>
          </div>

          {/* Bottom Dispatch CTA */}
          <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-lg sm:text-xl text-white uppercase tracking-wide">
                READY TO START YOUR NEXT PROJECT?
              </h4>
              <p className="text-xs text-[#8e8d8c] mt-0.5">
                Book online in 60 seconds or call our Mount Zion yard for immediate dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="tel:12178537475"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#111111] border border-white/20 text-white hover:text-[#ff6b00] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Phone className="w-4 h-4 text-[#ff6b00]" />
                <span>(217) 853-7475</span>
              </a>
              <button
                onClick={() => onNavigate('booking')}
                className="flex-1 sm:flex-initial btn-primary px-6 py-3 text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>RESERVE TRAILER NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#181818] border-2 border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 text-[#8e8d8c] hover:text-white cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedReview ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-wide">
                  THANK YOU FOR YOUR FEEDBACK!
                </h3>
                <p className="text-xs text-[#8e8d8c]">
                  Your review has been submitted to the Hitch & Haul team. We appreciate your local business!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Customer Feedback</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight">
                    SUBMIT A REVIEW
                  </h3>
                  <p className="text-xs text-[#8e8d8c]">
                    Tell us about your rental experience with Hitch & Haul Trailer Rental LLC.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#bab8b7] font-semibold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Brad Miller"
                      className="w-full px-3 py-2.5 bg-[#111111] border border-white/15 rounded-lg text-white placeholder-[#717171] focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#bab8b7] font-semibold mb-1">
                        Town / Location
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Decatur, IL"
                        className="w-full px-3 py-2.5 bg-[#111111] border border-white/15 rounded-lg text-white placeholder-[#717171] focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#bab8b7] font-semibold mb-1">
                        Role / Project Type
                      </label>
                      <input
                        type="text"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="e.g. Homeowner or Contractor"
                        className="w-full px-3 py-2.5 bg-[#111111] border border-white/15 rounded-lg text-white placeholder-[#717171] focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#bab8b7] font-semibold mb-1">
                      Trailer Rented
                    </label>
                    <select
                      value={formTrailer}
                      onChange={(e) => setFormTrailer(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#111111] border border-white/15 rounded-lg text-white focus:outline-none focus:border-[#ff6b00]"
                    >
                      <option value="14' Hydraulic Dump Trailer">14' Hydraulic Dump Trailer (14k GVWR)</option>
                      <option value="16' Heavy-Duty Dump Trailer">16' Heavy-Duty Dump Trailer (14k GVWR)</option>
                      <option value="20' Tilt Deck Equipment Hauler">20' Tilt Deck Equipment Hauler</option>
                      <option value="20' Car Hauler Trailer">20' Car Hauler Trailer</option>
                      <option value="Driveway Dumpster Service">Driveway Dumpster Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#bab8b7] font-semibold mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormRating(star)}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= formRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-[#717171]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-white ml-2">
                        {formRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#bab8b7] font-semibold mb-1">
                      Your Review / Experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      placeholder="How did the trailer perform? How was the service and pickup/drop-off experience?"
                      className="w-full px-3 py-2.5 bg-[#111111] border border-white/15 rounded-lg text-white placeholder-[#717171] focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-4 py-2.5 rounded-lg border border-white/15 text-[#bab8b7] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary text-xs uppercase px-6 py-2.5 cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
