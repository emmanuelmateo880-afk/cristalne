export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const GOOGLE_ADSENSE_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    features: ['720p HD', '1 device', 'Ad-supported'],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: ['1080p Full HD', '2 devices', 'Ad-free'],
  },
  ULTIMATE: {
    id: 'ultimate',
    name: 'Ultimate',
    price: 15.99,
    features: ['4K Ultra HD', '4 devices', 'Ad-free', 'Download content'],
  },
};
