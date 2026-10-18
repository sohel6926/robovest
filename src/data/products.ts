import { InvestmentProduct } from '../types';
import heroImage from '../assets/images/fancode_banner.jpg';
import planAImage from '../assets/images/fancode_cricket_card.jpg';
import planBImage from '../assets/images/fancode_f1_card.jpg';
import planCImage from '../assets/images/fancode_football_card.jpg';
import planDImage from '../assets/images/fancode_basketball_card.jpg';
import planEImage from '../assets/images/fancode_tennis_card.jpg';
import planFImage from '../assets/images/fancode_badminton_card.jpg';
import planGImage from '../assets/images/fancode_boxing_card.jpg';

export const HERO_IMAGE = heroImage;

export const PRODUCT_IMAGES_BY_ID: Record<string, string> = {
  A: planAImage,
  B: planBImage,
  C: planCImage,
  D: planDImage,
  E: planEImage,
  F: planFImage,
  G: planGImage,
};

export function resolveProductImage(id?: string, rawImage?: string): string {
  // If rawImage is already a fully valid external web URL or data URI, keep it
  if (rawImage && (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('data:'))) {
    return rawImage;
  }
  
  // If rawImage starts with '/assets/' (compiled Vite asset) and doesn't mention '/src/', it's valid
  if (rawImage && rawImage.startsWith('/assets/') && !rawImage.includes('/src/')) {
    return rawImage;
  }

  // If id matches known product letters
  if (id) {
    const key = id.toUpperCase();
    if (PRODUCT_IMAGES_BY_ID[key]) {
      return PRODUCT_IMAGES_BY_ID[key];
    }
  }

  // Fallback checks by image filename keywords
  if (rawImage) {
    const lower = rawImage.toLowerCase();
    if (lower.includes('cricket')) return planAImage;
    if (lower.includes('f1')) return planBImage;
    if (lower.includes('football')) return planCImage;
    if (lower.includes('basketball')) return planDImage;
    if (lower.includes('tennis')) return planEImage;
    if (lower.includes('badminton')) return planFImage;
    if (lower.includes('boxing')) return planGImage;
  }

  return planAImage;
}

export const PRODUCTS_CATALOG: InvestmentProduct[] = [
  {
    id: 'A',
    name: 'Product A',
    tagline: 'FanCode Premier League Cricket Tier',
    robotModel: 'Cricket Premier League',
    price: 5200,
    dailyIncome: 130,
    durationDays: 150,
    totalReturn: 19500,
    bonus: 50,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planAImage,
    imagePosition: 'object-center',
    badge: 'POPULAR',
    tier: 'Standard',
    specs: ['Daily Payout ₹130', '150 Days Duration', 'Instant ₹50 Bonus']
  },
  {
    id: 'B',
    name: 'Product B',
    tagline: 'FanCode Formula 1 Velocity Grand Prix',
    robotModel: 'Formula 1 Grand Prix',
    price: 2100,
    dailyIncome: 500,
    durationDays: 150,
    totalReturn: 75000,
    bonus: 100,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planBImage,
    imagePosition: 'object-center',
    badge: 'BEST VALUE',
    tier: 'Standard',
    specs: ['Daily Payout ₹500', '150 Days Duration', 'Instant ₹100 Bonus']
  },
  {
    id: 'C',
    name: 'Product C',
    tagline: 'FanCode Champions League Striker League',
    robotModel: 'Football Champions League',
    price: 4000,
    dailyIncome: 950,
    durationDays: 150,
    totalReturn: 142500,
    bonus: 250,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planCImage,
    imagePosition: 'object-center',
    badge: 'HIGH GROWTH',
    tier: 'Standard',
    specs: ['Daily Payout ₹950', '150 Days Duration', 'Instant ₹250 Bonus']
  },
  {
    id: 'D',
    name: 'Product D',
    tagline: 'FanCode NBA Slam Dunk Arena Championship',
    robotModel: 'Basketball NBA Pro Arena',
    price: 8200,
    dailyIncome: 2000,
    durationDays: 150,
    totalReturn: 300000,
    bonus: 500,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planDImage,
    imagePosition: 'object-center',
    badge: 'SUPER TIER',
    tier: 'Standard',
    specs: ['Daily Payout ₹2,000', '150 Days Duration', 'Instant ₹500 Bonus']
  },
  {
    id: 'E',
    name: 'Product E',
    tagline: 'FanCode Grand Slam Tennis Masters',
    robotModel: 'Tennis Grand Slam Masters',
    price: 15500,
    dailyIncome: 3500,
    durationDays: 150,
    totalReturn: 525000,
    bonus: 1200,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: true,
    image: planEImage,
    imagePosition: 'object-center',
    badge: 'VIP ELITE',
    tier: 'Elite',
    specs: ['Requires Product A, B, C, or D', 'Daily Payout ₹3,500', 'Instant ₹1,200 Bonus']
  },
  {
    id: 'F',
    name: 'Product F',
    tagline: 'FanCode World Badminton Super Series',
    robotModel: 'Badminton World Tour Series',
    price: 35000,
    dailyIncome: 8000,
    durationDays: 150,
    totalReturn: 1200000,
    bonus: 3000,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: true,
    image: planFImage,
    imagePosition: 'object-center',
    badge: 'EXECUTIVE ELITE',
    tier: 'Elite',
    specs: ['Requires Product A, B, C, or D', 'Daily Payout ₹8,000', 'Instant ₹3,000 Bonus']
  },
  {
    id: 'G',
    name: 'Product G',
    tagline: 'FanCode Heavyweight Boxing Championship',
    robotModel: 'Combat Heavyweight World Title',
    price: 75000,
    dailyIncome: 16500,
    durationDays: 150,
    totalReturn: 2475000,
    bonus: 5000,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: true,
    image: planGImage,
    imagePosition: 'object-center',
    badge: 'APEX MASTERPIECE',
    tier: 'Quantum Apex',
    specs: ['Requires Product A, B, C, or D', 'Daily Payout ₹16,500', 'Instant ₹5,000 Bonus']
  }
];

export const COLOR_TRUST_RATIONALE = {
  title: 'FanCode Official Sports Investment Platform',
  bullets: [
    {
      heading: 'FanCode Electric Orange (#FE4600 / #FF5100)',
      text: 'Dynamic sports entertainment energy and high visibility UX driving confidence and clarity.'
    },
    {
      heading: 'Crisp White Surface Cards with Rounded Aesthetics',
      text: 'High-clarity sports investment cards delivering transparent daily payouts, bonuses, and terms.'
    }
  ]
};
