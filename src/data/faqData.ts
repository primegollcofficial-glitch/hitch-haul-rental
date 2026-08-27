import { FaqItem } from '../types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'weight-limits',
    category: 'Logistics',
    title: 'Trailer Weight Ratings & Payload Capacities',
    summary: 'GVWR calculations, safe payload distribution, and loading guidelines.',
    content: 'Every trailer in our fleet has an explicit Gross Vehicle Weight Rating (GVWR) and payload capacity posted on its VIN plate and our spec sheet. Operators must ensure cargo plus trailer tare weight never exceeds the rated axle capacity.',
    bullets: [
      '14\' Hydraulic Dump Trailer: Max payload capacity 10,000 lbs (14,000 lbs GVWR).',
      '16\' High-Side Dump Trailer: Max payload capacity 11,000 lbs (14,000 lbs GVWR).',
      '20\' & 22\' Power Tilt Decks: Built for 11,000 to 14,000 lbs machinery, tractors, and vehicles.',
      'Cargo Loading Rule: Place approximately 60% of cargo weight in the front half of the trailer bed to ensure stable tongue weight.'
    ]
  },
  {
    id: 'hitch-requirements',
    category: 'Vehicle Prep',
    title: 'Hitch, Tow Rating & Electrical Connections',
    summary: 'Ball sizes, receiver classes, brake controller requirements, and safety chain hookups.',
    content: 'Your tow vehicle must be adequately equipped with a Class IV or Class V receiver hitch and an active in-cab electronic brake controller for trailers exceeding 3,000 lbs GVWR.',
    bullets: [
      'Dump & Tilt Trailers: Standard 2-5/16" solid steel ball coupler.',
      'Utility Trailers: Standard 2" ball coupler.',
      'Electrical connection: Standard 7-way RV blade round connector for electric brakes and running lights.',
      'Need hitch equipment? We rent adjustable drop-hitches and 2-5/16" balls on site for $15.'
    ]
  },
  {
    id: 'insurance-liability',
    category: 'Protection',
    title: 'Insurance & Proof of Coverage',
    summary: 'Auto policy requirements, commercial rider verification, and damage waiver protection.',
    content: 'To tow our trailers, the renter must provide a valid driver\'s license and current certificate of auto insurance showing liability coverage extending to towed trailers.',
    bullets: [
      'Valid state-issued Driver\'s License required at time of reservation dispatch.',
      'Matching auto insurance card with active policy term.',
      'Optional equipment damage waiver ($15/day) available to limit liability on accidental tire punctures or cosmetic scrape repair.'
    ]
  },
  {
    id: 'security-deposit',
    category: 'Financial',
    title: 'Security Deposits & Payment Methods',
    summary: 'Card pre-authorizations, refund turnaround, and accepted commercial payment terms.',
    content: 'A refundable security deposit hold ($250 for utility/tilt decks, $350 for dump trailers) is placed on your credit or debit card at the time of dispatch. The hold is immediately released upon equipment return following inspection.',
    bullets: [
      'We accept all major credit cards (Visa, MasterCard, Amex, Discover) and commercial company checks.',
      'Deposit hold is released within 24-48 business hours post return.',
      'No surprise cleanout fees as long as equipment is swept clean.'
    ]
  },
  {
    id: 'job-delivery',
    category: 'Dispatch',
    title: 'Job Site Trailer Delivery & Pick-Up Service',
    summary: 'On-demand site delivery, swap timing, and Decatur / Mt Zion dispatch zones.',
    content: 'Need equipment brought directly to your work site? We offer direct trailer drop-off and pickup across Decatur, Mount Zion, and surrounding Macon County locations.',
    bullets: [
      'Flexible drop-off scheduling right to your driveway or commercial project site.',
      'Flat $50 metro delivery and pickup within Decatur & Mt. Zion limits.',
      'Pre-trip hookup walk-through and safety latch verification included with all drop-offs.'
    ]
  }
];
