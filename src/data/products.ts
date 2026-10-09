import { InvestmentProduct } from '../types';
import heroImage from '../assets/images/hero_home_robot_1791407310783.jpg';
import planAImage from '../assets/images/plan_a_micro_nao.jpg';
import planBImage from '../assets/images/plan_b_spot_dog.jpg';
import planCImage from '../assets/images/plan_c_asimo_biped.jpg';
import planDImage from '../assets/images/plan_d_atlas_lab.jpg';
import planEImage from '../assets/images/plan_e_titan_freight.jpg';
import planFImage from '../assets/images/plan_f_valkyrie_hero.jpg';
import planGImage from '../assets/images/plan_g_colossus_titan.jpg';

export const HERO_IMAGE = heroImage;

export const PRODUCTS_CATALOG: InvestmentProduct[] = [
  {
    id: 'A',
    name: 'Product A',
    tagline: 'Nao-Micro Autonomous Desktop Assistant',
    robotModel: 'Nao Core Micro Assistant',
    price: 520,
    dailyIncome: 130,
    durationDays: 150,
    totalReturn: 19500,
    bonus: 50,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planAImage,
    imagePosition: 'object-top',
    badge: 'Popular Starter',
    tier: 'Standard',
    specs: ['25.0% Daily ROI Yield', 'Automated Micro-Tasks', 'Instant ₹50 Cash Bonus']
  },
  {
    id: 'B',
    name: 'Product B',
    tagline: 'Spot-X Agile Quadruped Scout & Courier',
    robotModel: 'Spot-X Quadruped Patrol Bot',
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
    badge: 'Best Value',
    tier: 'Standard',
    specs: ['23.8% Daily Yield', 'Agile Terrain Mobility', 'Instant ₹100 Cash Bonus']
  },
  {
    id: 'C',
    name: 'Product C',
    tagline: 'ASIMO-V Kinetic Bipedal Android',
    robotModel: 'ASIMO-V Precision Service Biped',
    price: 4000,
    dailyIncome: 950,
    durationDays: 150,
    totalReturn: 142500,
    bonus: 250,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planCImage,
    imagePosition: 'object-top',
    badge: 'High Growth',
    tier: 'Standard',
    specs: ['23.75% Daily Yield', 'Kinetic Smart Automation', 'Instant ₹250 Cash Bonus']
  },
  {
    id: 'D',
    name: 'Product D',
    tagline: 'Atlas Prime Neural Laboratory Android',
    robotModel: 'Atlas Prime AI Diagnostics Android',
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
    badge: 'Super Tier',
    tier: 'Standard',
    specs: ['24.39% Daily Yield', 'Algorithmic Arbitrage', 'Instant ₹500 Cash Bonus']
  },
  {
    id: 'E',
    name: 'Product E',
    tagline: 'Aurora Heavy Industrial Logistics Titan',
    robotModel: 'Aurora Unit-04 Heavy Freight Titan',
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
    badge: 'VIP Elite',
    tier: 'Elite',
    specs: ['Requires Product A, B, C, or D', '450KG Freight Payload', 'Instant ₹1,200 Cash Bonus']
  },
  {
    id: 'F',
    name: 'Product F',
    tagline: 'Valkyrie R5 Deep-Space Sovereign Android',
    robotModel: 'Valkyrie R5 Orbital Space Sentinel',
    price: 35000,
    dailyIncome: 8000,
    durationDays: 150,
    totalReturn: 1200000,
    bonus: 3000,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: true,
    image: planFImage,
    imagePosition: 'object-top',
    badge: 'Executive Elite',
    tier: 'Elite',
    specs: ['Requires Product A, B, C, or D', 'Autonomous Data Syndicate', 'Instant ₹3,000 Cash Bonus']
  },
  {
    id: 'G',
    name: 'Product G',
    tagline: 'Omega Freedom Colossal Super-Titan',
    robotModel: 'Omega Freedom Apex Defense Titan',
    price: 75000,
    dailyIncome: 16500,
    durationDays: 150,
    totalReturn: 2475000,
    bonus: 5000,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: true,
    image: planGImage,
    imagePosition: 'object-top',
    badge: 'Apex Masterpiece',
    tier: 'Quantum Apex',
    specs: ['Requires Product A, B, C, or D', 'Colossal Apex Grid Core', 'Instant ₹5,000 Cash Bonus']
  }
];

export const COLOR_TRUST_RATIONALE = {
  title: 'Financial Design: Why Half-White / Cream & Royal Blue Establish Maximum Trust',
  bullets: [
    {
      heading: 'Institutional Security (Royal Blue #2563EB / #1D4ED8)',
      text: 'Global fintech giants and leading banking institutions rely on Royal Blue. Financial UX studies confirm blue is the #1 color associated with fiduciary reliability, cybersecurity, and financial integrity.'
    },
    {
      heading: 'Warm Passbook Texture (Soft Cream #FAF7F2 & Half-White #FFFDF9)',
      text: 'Replacing harsh clinical stark white with subtle half-white and cream tones provides a warm, tactile banking passbook aesthetic that reduces eye strain and establishes authentic trust.'
    },
    {
      heading: 'Modern Autonomous Tech Aesthetics',
      text: 'Clean cream chassis with electric royal blue accents creates high contrast for financial ledgers, withdrawal rules, and yield calculations.'
    }
  ]
};
