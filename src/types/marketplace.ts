// Phase 6: MangalSutra Marketplace & Commercial Architecture Types (Module O & Module S)

export type MarketplaceCategory = 
  | 'before_marriage'
  | 'wedding_services'
  | 'after_marriage_wellbeing'
  | 'spiritual_puja';

export interface MarketplaceVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  verificationBadge: string;
  establishedYear: number;
  description: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: MarketplaceCategory;
  subcategory: string;
  priceInr: number;
  originalPriceInr?: number;
  vendorId: string;
  vendorName: string;
  vendorLocation: string;
  rating: number;
  reviewsCount: number;
  description: string;
  keyFeatures: string[];
  imageUrl: string;
  deliveryEstimate: string;
  inStock: boolean;
  ethicalTag?: string; // e.g. "Eco-Friendly", "Temple-Crafted", "Certified Fair-Trade"
}

export interface CartItem {
  item: MarketplaceItem;
  quantity: number;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotalInr: number;
  gstInr: number;
  shippingInr: number;
  totalInr: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'UPI' | 'NetBanking' | 'CreditCard' | 'Sandbox_Simulated';
  paymentStatus: 'Sandbox_Verified' | 'Payment_Failed' | 'Merchant_Pending';
  orderStatus: 'Order_Placed' | 'Processing_With_Vendor' | 'Dispatched' | 'Delivered';
  createdAt: string;
  isSimulatedNotice: string;
}

export type CommercialTierId = 
  | 'free'
  | 'premium'
  | 'verified'
  | 'premium_verified'
  | 'couple';

export interface CommercialTierPlan {
  id: CommercialTierId;
  name: string;
  tagline: string;
  monthlyPriceInr: number;
  annualPriceInr: number;
  isPopular?: boolean;
  entitlements: {
    feature: string;
    included: boolean;
    detail?: string;
  }[];
  transparencyCaveat: string;
}
