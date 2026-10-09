// Phase 6: MangalSutra Marketplace & Commercial Tiers Service (Module O & S)

import { 
  MarketplaceItem, 
  MarketplaceVendor, 
  MarketplaceOrder, 
  CartItem, 
  CommercialTierPlan,
  CommercialTierId 
} from '../types/marketplace';

export const MARKETPLACE_VENDORS: MarketplaceVendor[] = [
  {
    id: 'v_zaveri_01',
    name: 'Zaveri & Sons Heritage Jewellers',
    category: 'Fine Jewellery & Mangalsutras',
    location: 'Zaveri Bazaar, Mumbai',
    rating: 4.9,
    reviewCount: 342,
    verificationBadge: 'BIS 916 Hallmark & ChaanBean Verified Artisan',
    establishedYear: 1954,
    description: 'Specializing in traditional 22K gold Mangalsutras, sacred Black Bead malas, and certified Polki bridal sets crafted by generational karigars.',
  },
  {
    id: 'v_kanchi_02',
    name: 'Kanchi Weavers Guild',
    category: 'Handloom Bridal & Groom Textiles',
    location: 'Kanchipuram, Tamil Nadu',
    rating: 4.8,
    reviewCount: 215,
    verificationBadge: 'Silk Mark India & Geographical Indication (GI) Certified',
    establishedYear: 1978,
    description: 'Direct weaver cooperative producing genuine mulberry silk Kanjeevarams with pure zari borders woven on traditional pit looms.',
  },
  {
    id: 'v_veda_03',
    name: 'Vedic Samagri Pratisthan',
    category: 'Sacred Ritual Goods & Puja Kits',
    location: 'Haridwar, Uttarakhand',
    rating: 4.9,
    reviewCount: 520,
    verificationBadge: '100% Pure Forest Herbs & Certified Organic Ghee',
    establishedYear: 1992,
    description: 'Providing consecrated puja samagri, brassware from Moradabad, and complete ceremonial kits for Vivaha sanskaras and home pujas.',
  },
  {
    id: 'v_ananda_04',
    name: 'Ananda Sacred Retreats',
    category: 'Couple Wellness & Contemplative Stays',
    location: 'Rishikesh, Uttarakhand',
    rating: 4.9,
    reviewCount: 188,
    verificationBadge: 'Eco-Certified Holistic Wellness Sanctuary',
    establishedYear: 2008,
    description: 'Peaceful Himalayan sanctuaries offering private couple meditation retreats, Ayurvedic consultations, and relationship renewal stays.',
  },
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'item_ms_01',
    name: 'Heritage Traditional 22K Gold Mangalsutra (Thali Design)',
    category: 'wedding_services',
    subcategory: 'Bridal Jewellery',
    priceInr: 68500,
    originalPriceInr: 74000,
    vendorId: 'v_zaveri_01',
    vendorName: 'Zaveri & Sons Heritage',
    vendorLocation: 'Mumbai, Maharashtra',
    rating: 4.9,
    reviewsCount: 148,
    description: 'Crafted in hallmarked 22 Karat gold with authentic black onyx beads to ward off negative energies. Features traditional double-cup pendant symbolizing mutual devotion.',
    keyFeatures: [
      'BIS Hallmarked 22K Gold (approx 9.5 grams)',
      'Strung on reinforced silk cord with black spiritual beads',
      'Accompanied by Certificate of Authenticity and valuation report',
      'Complimentary lifetime ultrasonic cleaning at partner centers',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: '5–7 business days (Insured courier)',
    inStock: true,
    ethicalTag: 'BIS 916 Certified',
  },
  {
    id: 'item_saree_02',
    name: 'Handwoven Kanchipuram Pure Silk Bridal Saree (Crimson Gold)',
    category: 'wedding_services',
    subcategory: 'Bridal Textiles',
    priceInr: 34500,
    originalPriceInr: 39000,
    vendorId: 'v_kanchi_02',
    vendorName: 'Kanchi Weavers Guild',
    vendorLocation: 'Kanchipuram, Tamil Nadu',
    rating: 4.8,
    reviewsCount: 96,
    description: 'Woven with certified mulberry silk and genuine gold zari. Features the classic temple korvai border with peacock and chakra motifs celebrating eternal marital union.',
    keyFeatures: [
      '100% Pure Silk with Silk Mark Tag',
      'Genuine zari border with heavy pallu',
      'Direct from artisan weaver cooperative',
      'Matching unstitched silk blouse fabric included',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: '4–6 business days',
    inStock: true,
    ethicalTag: 'Silk Mark Certified',
  },
  {
    id: 'item_puja_03',
    name: 'Complete Vedic Vivaha Agni Havan Kit (108 Herbs & Pure Ghee)',
    category: 'spiritual_puja',
    subcategory: 'Ceremonial Samagri',
    priceInr: 4800,
    originalPriceInr: 5500,
    vendorId: 'v_veda_03',
    vendorName: 'Vedic Samagri Pratisthan',
    vendorLocation: 'Haridwar, Uttarakhand',
    rating: 4.9,
    reviewsCount: 310,
    description: 'Contains every ceremonial herb and offering required for the Vedic Vivaha sanskara, Saptapadi, and Laja Homa as per Grihya Sutras.',
    keyFeatures: [
      '108 Himalayan medicinal havan herbs and Guggal/Dhoop',
      '1 Litre pure Desi Gir Cow Vedic Bilona Ghee',
      'Brass puja spoon (Sruva) and sacred Mango wood samidha twigs',
      'Sealed Gangajal bottle from Gomukh and Akshata rice',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: '3–5 business days',
    inStock: true,
    ethicalTag: '100% Natural Organic',
  },
  {
    id: 'item_retreat_04',
    name: '3-Day Pre-Marriage Himalayan Couple Reconnection Retreat',
    category: 'before_marriage',
    subcategory: 'Couple Experiences',
    priceInr: 38000,
    originalPriceInr: 45000,
    vendorId: 'v_ananda_04',
    vendorName: 'Ananda Sacred Retreats',
    vendorLocation: 'Rishikesh, Uttarakhand',
    rating: 5.0,
    reviewsCount: 74,
    description: 'An unhurried weekend retreat overlooking the Ganges. Includes private morning yoga, guided couple meditation, Ayurvedic dining, and quiet conversation pavilions.',
    keyFeatures: [
      '2 Nights / 3 Days luxury riverside cottage accommodation',
      'Daily curated couple wellness & breathwork sessions',
      'All organic Sattvic farm-to-table meals included',
      'Private evening Ganga Aarti access on hotel ghat',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: 'Digital Voucher with flexible 12-month booking',
    inStock: true,
    ethicalTag: 'Eco Sanctuary',
  },
  {
    id: 'item_brass_05',
    name: 'Heritage Handcrafted Brass Puja Thali & Diya Set (11 Pieces)',
    category: 'after_marriage_wellbeing',
    subcategory: 'Home Sanctuary',
    priceInr: 6200,
    originalPriceInr: 7500,
    vendorId: 'v_veda_03',
    vendorName: 'Vedic Samagri Pratisthan',
    vendorLocation: 'Haridwar, Uttarakhand',
    rating: 4.8,
    reviewsCount: 182,
    description: 'Solid virgin brass puja set engraved with traditional floral vines. Perfect for daily household aarti, festive Lakshmi poojas, and Griha Pravesh.',
    keyFeatures: [
      'Heavy 12-inch engraved brass thali with protective lacquer',
      'Includes brass Bell, Pancha-diya, Kalash, Agarbatti holder & Katori set',
      'Traditional Moradabad brass casting technique',
      'Packaged in reusable velvet gift box',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: '3–5 business days',
    inStock: true,
    ethicalTag: 'Handmade Artisan',
  },
  {
    id: 'item_journal_06',
    name: 'The Sacred Union: Pre-Marital Conversation & Reflection Cards',
    category: 'before_marriage',
    subcategory: 'Relationship Wisdom',
    priceInr: 1450,
    originalPriceInr: 1800,
    vendorId: 'v_ananda_04',
    vendorName: 'Ananda Sacred Retreats',
    vendorLocation: 'Rishikesh, Uttarakhand',
    rating: 4.9,
    reviewsCount: 228,
    description: 'A beautifully boxed deck of 75 guided prompt cards covering finances, extended family boundaries, conflict resolution, and spiritual alignment.',
    keyFeatures: [
      '75 high-GSM linen-finish cards across 6 life categories',
      'Includes 2 companion cloth-bound journals for private notes',
      'Grounded in modern Indian psychology and Vedic relational ethics',
      'Compact travel-friendly format for date nights and quiet tea talks',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    deliveryEstimate: '2–4 business days',
    inStock: true,
    ethicalTag: 'MangalSutra Original',
  },
];

export const COMMERCIAL_TIERS: CommercialTierPlan[] = [
  {
    id: 'free',
    name: 'Free (Sahaj)',
    tagline: 'Essential Dignified Discovery',
    monthlyPriceInr: 0,
    annualPriceInr: 0,
    entitlements: [
      { feature: 'Profile Creation & 5-Layer Management', included: true, detail: 'Complete biodata, family background, and expectations' },
      { feature: 'Search & Match Filtering', included: true, detail: 'Standard religion, age, profession, and location filters' },
      { feature: 'Basic 36 Guna Ashta Kuta Score Preview', included: true, detail: 'Authentic calculated Guna Milan total' },
      { feature: 'Express Interest & Connection Requests', included: true, detail: 'Send expressions of interest to eligible profiles' },
      { feature: 'ChaanBean Self-Affirmed Trust Profile', included: true, detail: 'Basic mobile & email verification' },
      { feature: 'Astra AI Deep Compatibility Guidance', included: false, detail: 'Requires Verified or Premium tier' },
      { feature: 'Institutional Document & Court Verification', included: false, detail: 'Requires Verified tier' },
      { feature: 'Couple Conversation Mode & Milestones', included: false, detail: 'Requires Couple tier' },
    ],
    transparencyCaveat: 'Free forever for essential matchmaking. No hidden fees to send basic connection requests.',
  },
  {
    id: 'premium',
    name: 'Premium (Shrestha)',
    tagline: 'Deep Relationship Intelligence',
    monthlyPriceInr: 1499,
    annualPriceInr: 11990,
    entitlements: [
      { feature: 'Everything in Free', included: true },
      { feature: 'Full 12 Modern Compatibility Dimensions', included: true, detail: 'Detailed perspectives on money, career, family, and communication' },
      { feature: 'Astra AI Grounded Relationship Assistant', included: true, detail: 'Personalized questions and discussion advice' },
      { feature: 'Unlimited Mutual Connection Chat', included: true, detail: 'Direct private conversations with unlocked matches' },
      { feature: 'Second Chapter Remarriage Ecosystem Access', included: true, detail: 'Rebuild profile and 7-pillar resources' },
      { feature: 'ChaanBean Full ID & Education Verification', included: false, detail: 'Requires Verified tier' },
      { feature: 'Couple Sanctuary Mode', included: false, detail: 'Requires Couple tier' },
    ],
    transparencyCaveat: 'PROPOSED TIER: Subscription enhances matchmaking intelligence. It does NOT guarantee matches or alter compatibility calculations.',
  },
  {
    id: 'verified',
    name: 'Verified (ChaanBean Vishwas)',
    tagline: 'Certified Trust & Evidence Foundation',
    monthlyPriceInr: 1999,
    annualPriceInr: 15990,
    isPopular: true,
    entitlements: [
      { feature: 'Everything in Premium', included: true },
      { feature: 'ChaanBean Trust Vault Verification', included: true, detail: 'DigiLocker ID, Degree registries & Employment audits' },
      { feature: 'Certified Marital Status Audit', included: true, detail: 'Section 13B court decree audit or Never Married affirmation' },
      { feature: 'Public Court Record (eCourts CNR) Screening', included: true, detail: 'Civil and criminal litigation index checks' },
      { feature: 'Consent & Audit Trail Ledger Access', included: true, detail: 'Real-time revocation and visibility controls' },
      { feature: 'Trust Badge Display on Profile', included: true, detail: 'Verified green badges across all discovery pools' },
      { feature: 'Couple Sanctuary Mode', included: false, detail: 'Requires Couple tier' },
    ],
    transparencyCaveat: 'PROPOSED TIER: Paying for verification covers institutional registry checks. Trust badges CANNOT be bought without verified evidence.',
  },
  {
    id: 'premium_verified',
    name: 'Premium Verified (Sampoorna)',
    tagline: 'The Complete Matrimonial Suite',
    monthlyPriceInr: 2999,
    annualPriceInr: 23990,
    entitlements: [
      { feature: 'Everything in Verified & Premium', included: true },
      { feature: 'Priority Verification Processing (<24 Hours)', included: true, detail: 'Expedited document audit in ChaanBean Vault' },
      { feature: 'Personal Relationship Concierge Advice', included: true, detail: 'Senior advisor support for delicate family communications' },
      { feature: 'Confidential Ask MS Trust AI Unlimited Queries', included: true, detail: '24/7 grounded background guidance' },
      { feature: 'Pratha Contemplation & Temple Travel Discounts', included: true, detail: 'Partner retreat and travel privileges' },
    ],
    transparencyCaveat: 'PROPOSED TIER: Designed for families seeking complete peace of mind. Does not alter compatibility or guarantee wedding outcomes.',
  },
  {
    id: 'couple',
    name: 'Couple Sanctuary (Yugma)',
    tagline: 'Pre & Post-Marriage Life Journey',
    monthlyPriceInr: 999,
    annualPriceInr: 7990,
    entitlements: [
      { feature: 'Private Mutual Couple Sanctuary Mode', included: true, detail: 'Shared notes, joint agreement ledger, and milestones' },
      { feature: 'Talk Before You Marry Paced Reflection Engine', included: true, detail: 'Mutual answer reveals for money, kids, and family' },
      { feature: 'First 100 Days Post-Marriage Transition Guide', included: true, detail: 'Phased guidance for co-living harmony' },
      { feature: 'Annual Marriage Health Check', included: true, detail: 'Yearly check-in for communication, intimacy, and finances' },
      { feature: '21-Day Pratha Couple Spiritual Journey', included: true, detail: 'Daily micro-rituals and shared evening gratitude' },
    ],
    transparencyCaveat: 'PROPOSED TIER: One shared subscription covers both partners. Unlocked only with explicit mutual consent from both individuals.',
  },
];

const STORAGE_KEY_ORDERS = 'mangalsutra_orders_ledger_v1';
const STORAGE_KEY_CART = 'mangalsutra_cart_v1';
const STORAGE_KEY_ACTIVE_TIER = 'mangalsutra_active_tier_v1';

export class MarketplaceService {
  static getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }

  static addToCart(item: MarketplaceItem, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ item, quantity });
    }
    this.saveCart(cart);
    return cart;
  }

  static removeFromCart(itemId: string): CartItem[] {
    const cart = this.getCart().filter((c) => c.item.id !== itemId);
    this.saveCart(cart);
    return cart;
  }

  static updateQuantity(itemId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((c) => c.item.id !== itemId);
    } else {
      const target = cart.find((c) => c.item.id === itemId);
      if (target) target.quantity = quantity;
    }
    this.saveCart(cart);
    return cart;
  }

  static clearCart(): void {
    localStorage.removeItem(STORAGE_KEY_CART);
  }

  static getOrders(): MarketplaceOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static placeOrder(order: MarketplaceOrder): void {
    try {
      const orders = this.getOrders();
      orders.unshift(order);
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
      this.clearCart();
    } catch (e) {
      console.error('Failed to record order', e);
    }
  }

  static getActiveTier(): CommercialTierId {
    try {
      const tier = localStorage.getItem(STORAGE_KEY_ACTIVE_TIER) as CommercialTierId;
      return tier || 'verified';
    } catch {
      return 'verified';
    }
  }

  static setActiveTier(tier: CommercialTierId): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TIER, tier);
    } catch (e) {
      console.error('Failed to save tier', e);
    }
  }
}
