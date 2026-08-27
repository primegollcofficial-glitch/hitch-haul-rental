import { TrailerItem } from '../types';
import enclosedTrailerImg from '../assets/images/enclosed_trailer_1787682254578.jpg';

export const FLEET_ITEMS: TrailerItem[] = [
  {
    id: 'dump-14',
    name: "14' Hydraulic Dump Trailer",
    category: 'dump',
    tag: 'Dump Trailer',
    status: 'available',
    statusLabel: 'Available',
    description: 'Heavy-duty 14,000 GVWR hydraulic dump trailer. Perfect for construction debris, gravel, dirt, roofing tear-offs, and aggregate hauling.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XORj83O8AYudVEl7YuQiWvbRozQcdbdqRwbSD4JZV8IY67SwIfXyt143qN6gGoUAcZwiGto1nVM4IuOD9jP5LB2n9hsvry5Vg-gL8pKb4sjafG8I7TEIvuwf7hDAQI0JlsA72xLwZ6rEsACJvY2Gs9AZ2-MykFUpjnryWwZOeDlbhwAzH0e-OkG7YcuglJZTPVftjebiLUOqI-8W61oZhrfon88WOEPcZccONWVpSTnZ-xKiAwNaq8Sg',
    dailyRate: 125,
    rates: {
      oneDay: 125,
      threeDays: 300,
      sevenDays: 450
    },
    specs: {
      designation: 'Commercial Hydraulic Dump Trailer',
      capacity: '10,000 lbs Payload',
      axleRating: '14,000 lbs GVWR',
      liftSystem: 'Dual Cylinder Scissor Hoist',
      brakes: 'Dual Axle Electric Brakes',
      hitchSize: '2-5/16" Ball Coupler'
    },
    features: [
      'Heavy-duty 10-gauge steel floor & sides',
      'Roll-tarp kit installed for safe transit',
      'Rear barn-doors + spreader gate combo',
      'Onboard 110V smart trickle battery charger'
    ]
  },
  {
    id: 'dump-16',
    name: "16' High-Side Dump Trailer",
    category: 'dump',
    tag: 'Dump Trailer',
    status: 'available',
    statusLabel: 'Available',
    description: 'High-capacity 16-foot commercial dump trailer with 4-foot reinforced steel side walls. Built for major demolition, tree service, and heavy equipment transport.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc6b0L_ShMk22IYTYy27PnOSqSH_-c4l8jp4EKY4KV20vtM_pM5mYVtooNookvtcm7ddZqR82xogxee7lmo8UsTslY72Ng6fwSNjQ5VIP309HsbtyNSjQ3H0Uk_DWPxbeehTFpzrWlhIAqDqTiBCOS1Ye9m5zR4MkgVkr_d7s1oYpEzaL2fF9UG4XtlIXYQLBPAk1rgItGH40pI0tZqVewL0WzqNqfLmRWr2qp81UZBeFKT2tWYdRG',
    dailyRate: 150,
    rates: {
      oneDay: 150,
      threeDays: 320,
      sevenDays: 480
    },
    specs: {
      designation: 'Heavy-Duty 14K Dump Trailer',
      capacity: '11,000 lbs Payload',
      axleRating: '14,000 lbs GVWR',
      liftSystem: 'Scissor Hoist Hydraulic',
      brakes: 'Forward Self-Adjusting Electric',
      hitchSize: '2-5/16" Heavy Duty Ball'
    },
    features: [
      'High 48-inch steel side walls for maximized volume',
      'Heavy tie-down D-rings inside bed',
      'Wireless remote control hydraulic hoist',
      'Integrated heavy-duty equipment loading ramps'
    ]
  },
  {
    id: 'tilt-20',
    name: "20' Tilt Deck",
    category: 'flatbed',
    tag: 'Flatbed',
    status: 'in-use',
    statusLabel: 'In-Use',
    description: 'Full power tilt for easy loading of scissor lifts, skid steers, and low-clearance equipment without cumbersome ramps.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV0Lmp4DoeONl7hlUkaioNHu5yWq9PVRQt_Alk509cUV-tpqYvlzOtm1ADblBYZPH5xU6NqKdmCH1iUSSUg3QXlIlWFcPdKjmR-wBJ0OO0d6XuRg14JoifpK7HsD0gH1jYA1gnCZqzuAZZ4n92yRsWVAShbXpNfd9qbx61ejXp6gvCgHe-heT_Zwr452r6QPROBfcvz7559wvNt7QEN1yhS_RqSy0Tm88U614qiX-GOgNqGO74Z5dj',
    dailyRate: 110,
    rates: {
      oneDay: 110,
      threeDays: 300,
      sevenDays: 350
    },
    specs: {
      capacity: '11,000 lbs Payload',
      deckLength: '20 Feet (Full Tilt)',
      recovery: '12k Electric Winch',
      brakes: 'Dual Axle Electric',
      hitchSize: '2-5/16" Ball Coupler'
    },
    features: [
      '12,000 lb synthetic rope wireless winch',
      'Hydraulic cushion cylinder with lockout valve',
      'Heavy-duty rub rails & stake pockets along perimeter',
      'LED lighting with steel protective encasements'
    ]
  },
  {
    id: 'tilt-22',
    name: "22FT Tilt Deck",
    category: 'flatbed',
    tag: 'Flatbed',
    status: 'available',
    statusLabel: 'Available',
    description: 'Extra-long full tilt deck engineered for commercial machinery, dual vehicle moves, and heavy tractors.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyiZFgdycE9iqnFC6NvtUSR6oZg25ZPhxfLcEMgSmCm1mE1aEYA3pBLIBcthNe5tHaSQV5TGZ46YpXeIaNK2f03RGQpFQRjyZJkCrqD0D9DxiwNXtCaPIIRrRHjkPe4Eb_hULx-ja6FCcFhLqHCRGhn-CNvJNbYjdrDy0PLUhn5CE8wmJhHz4Y9NswTFHSALn6uXiJRYLwSvuGB0AZYEFvAX29tm9SEeo87CiU9bhZ7ZpYdimeH2b-',
    dailyRate: 160,
    rates: {
      oneDay: 160,
      threeDays: 300,
      sevenDays: 450
    },
    specs: {
      capacity: '14,000 lbs Payload',
      deckLength: '22 Feet (Tilt)',
      recovery: '12k Electric Winch',
      suspension: 'Heavy Duty Slipper Springs',
      hitchSize: '2-5/16" Adjustable Coupler'
    },
    features: [
      '12k Heavy-duty electric recovery winch',
      'Treated oak deck with flush mount D-rings',
      'Low 11-degree loading angle for low ground clearance',
      'Dual 7,000 lb Dexter axles'
    ]
  },
  {
    id: 'enclosed-8x20',
    name: "8x20' Enclosed",
    category: 'enclosed',
    tag: 'Enclosed',
    status: 'available',
    statusLabel: 'Available',
    description: 'Secure, weather-tight cargo transport with heavy-duty ramp door and integrated E-track tie-down system.',
    imageUrl: enclosedTrailerImg,
    dailyRate: 100,
    rates: {
      oneDay: 100,
      threeDays: 240,
      sevenDays: 450
    },
    specs: {
      capacity: '7,000 lbs',
      deckLength: "8' x 20' Interior",
      dimensions: "96in Wide x 7ft Interior Height",
      brakes: 'Electric Tandem Brakes',
      hitchSize: '2-5/16" Ball'
    },
    features: [
      'Dual E-track rows along both interior walls',
      'Spring-assist rear ramp door with flap',
      'Side access RV door with bar lock security',
      'Interior 12V LED illumination strip'
    ]
  },
  {
    id: 'utility-12',
    name: 'Utility Unit (6.5x12)',
    category: 'utility',
    tag: 'Utility',
    status: 'available',
    statusLabel: 'Available',
    description: 'Rugged open utility trailer with reinforced landscape rear gate and welded tie-downs for mowers, ATVs, and materials.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3q3DFOiPPFLKADpskGITTYbSmADLawZN6wGlqMap7jqnwVXFBfkx3Ctmjp2CMT2o4-yzp5LDQXTJoeApPGzdIX1eHJV-0rj5oVQjTE6auC-KXsM6dCGXnkAie-JWjwj9jNNNDE0PKkAss67P_mtQBNzDiSqZtG3vPfNiJPn3u3Dgvg1W6etvm27Q6rfaFrSrlhF1mO8ECsWYcegD_0Oei067da8NQtCzuvpPr1EabhdbltBc4sovl',
    dailyRate: 50,
    rates: {
      oneDay: 50,
      threeDays: 130,
      sevenDays: 250,
      perDayText: '~$50'
    },
    specs: {
      designation: 'Open Utility w/ Gate',
      dimensions: '6.5ft x 12ft',
      capacity: '2,500 lbs Payload',
      tieDowns: 'Welded D-Rings (6x)',
      hitchSize: '2" Ball Coupler'
    },
    features: [
      'Heavy-duty mesh fold-flat ramp gate',
      'High steel side rails for cargo containment',
      'Spare tire mounted with security lock',
      'Easy single-person hookup'
    ]
  },
  {
    id: 'equipment-18',
    name: '18FT Equipment Flatbed',
    category: 'flatbed',
    tag: 'Flatbed',
    status: 'maintenance',
    statusLabel: 'Maintenance',
    description: 'Commercial flatbed trailer with heavy duty stand-up spring-assisted ramps and treated pine decking for rugged equipment.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALk0SYh3cUWLjwmjuYMaKLdVnkxXGdgjucFNQdsD5bJ7wN2mLYdbrOQK7sm8LuiouDwS0DuaSRMYgVzZRBNpifmphjPVa8xy5Ckh6btUkbYH6nlwZK4TbrwJuxzx4qzR2fLQPZt1Q2nrcPEPCtq3QROu4LLQWBpxgrnBhnI9diD4kU6SEPYa18jrRwrw4Im_tWjhAuK0bIbYyLpJjF_fBpWMxoMwxsIVhEzY97NHQQ55X_1Oab1Vd0',
    dailyRate: 140,
    rates: {
      oneDay: 140,
      threeDays: 320,
      sevenDays: 550,
      perDayText: '~$140'
    },
    specs: {
      capacity: '14,000 lbs GVWR',
      deckLength: '18 Feet Flat',
      ramps: 'HD Stand-Up Spring Assisted',
      floor: 'Treated Pine Decking',
      hitchSize: '2-5/16" Heavy Duty'
    },
    features: [
      'Dual 7,000 lb electric brake axles',
      'Heavy duty channel tongue & frame',
      'Front bulkhead barrier for operator safety',
      '10,000 lb drop-leg jack'
    ]
  }
];

export const SERVICE_ADDONS = [
  {
    id: 'job-delivery',
    name: 'Job Site Trailer Delivery & Pick-Up',
    description: 'Direct delivery and retrieval of your rented trailer to your job site in Decatur or Mount Zion.',
    price: 50,
    priceNote: '$50 / drop'
  },
  {
    id: 'straps-rigging',
    name: 'Heavy-Duty Straps & Chains Kit',
    description: 'Commercial 4-pack of 3-inch ratchet straps, 5/16 grade 70 transport chains, and ratchet binders.',
    price: 25,
    priceNote: '$25 / rental'
  },
  {
    id: 'hitch-receiver',
    name: 'Hitch Receiver & Ball Kit',
    description: 'Adjustable 2-5/16" or 2" drop-hitch assembly with locking pins (Fits standard 2" and 2.5" receivers).',
    price: 15,
    priceNote: '$15 / rental'
  }
];
