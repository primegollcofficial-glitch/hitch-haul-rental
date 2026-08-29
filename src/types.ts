export type NavTab = 'home' | 'fleet' | 'rates' | 'areas' | 'booking' | 'return' | 'about' | 'testimonials' | 'faq' | 'contact' | 'admin';

export interface ServiceArea {
  id: string;
  name: string;
  county: string;
  zip: string;
  distanceFromHub: string;
  deliveryTime: string;
  description: string;
  popularUses: string[];
  highlights: string[];
  tagline: string;
}

export type TrailerStatus = 'available' | 'in-use' | 'maintenance';
export type TrailerCategory = 'dump' | 'flatbed' | 'enclosed' | 'utility';

export interface TrailerItem {
  id: string;
  name: string;
  category: TrailerCategory;
  tag: string;
  status: TrailerStatus;
  statusLabel: string;
  description: string;
  imageUrl: string;
  images?: string[];
  dailyRate: number;
  rates: {
    oneDay?: number;
    threeDays?: number;
    sevenDays?: number;
    perDayText?: string;
    dumpsterServiceNote?: string;
  };
  specs: {
    designation?: string;
    capacity: string;
    deckLength?: string;
    axleRating?: string;
    liftSystem?: string;
    recovery?: string;
    brakes?: string;
    suspension?: string;
    dimensions?: string;
    tieDowns?: string;
    ramps?: string;
    floor?: string;
    hitchSize?: string;
  };
  features: string[];
  bookingEnabled?: boolean;
  availability?: { start: string; end: string; note?: string }[];
  createdAt?: string;
}

export interface Booking {
  id: string;
  reference: string;
  trailerId: string;
  trailerName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress?: string;
  addons: { id: string; name: string; price: number }[];
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  licenseFiles: { url: string; filename: string; size: number; mimetype?: string }[];
  insuranceFiles: { url: string; filename: string; size: number; mimetype?: string }[];
  trailerVideoFiles: { url: string; filename: string; size: number; mimetype?: string }[];
  deliveryVideoFiles: { url: string; filename: string; size: number; mimetype?: string }[];
  estimatedTotal: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  checkedInAt?: string;
  checkedOutAt?: string;
  returnFiles?: { url: string; filename: string; size?: number; mimetype?: string }[];
  returnVideoAt?: string;
  createdAt: string;
}

export interface BookingSubmission {
  trailerId: string;
  trailerName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress?: string;
  addons: { id: string; name: string; price: number }[];
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  licenseFiles: { url: string; filename: string; size: number }[];
  insuranceFiles: { url: string; filename: string; size: number }[];
  estimatedTotal: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  featured?: boolean;
  trailerUsed?: string;
  category?: 'contractor' | 'homeowner' | 'landscaping' | 'hauling' | 'roofing';
  date?: string;
  verified?: boolean;
  projectType?: string;
}

export interface FaqItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  bullets?: string[];
  imagePlaceholder?: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  priceNote?: string;
}

export interface PublicSettings {
  bookingEnabled: boolean;
  businessName: string;
}
