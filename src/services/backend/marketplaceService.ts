// Backend Service: MangalSutra Marketplace & Commercial Architecture

import {
  MarketplaceVendor,
  MarketplaceItem,
  MarketplaceOrder,
  CommercialTierPlan,
  CartItem,
  MarketplaceCategory,
} from '../../types/marketplace';
import {
  MARKETPLACE_VENDORS,
  MARKETPLACE_ITEMS,
  COMMERCIAL_TIERS,
} from '../marketplaceService';

export const MarketplaceBackendService = {
  // 1. Fetch Catalog Items with Optional Category Filter
  async getItems(category?: MarketplaceCategory | 'all'): Promise<MarketplaceItem[]> {
    if (category && category !== 'all') {
      return MARKETPLACE_ITEMS.filter((i: MarketplaceItem) => i.category === category);
    }
    return MARKETPLACE_ITEMS;
  },

  // 2. Fetch Vendors
  async getVendors(): Promise<MarketplaceVendor[]> {
    return MARKETPLACE_VENDORS;
  },

  // 3. Process Truthful Sandbox / Gateway Checkout Order
  async placeOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: {
      fullName: string;
      phone: string;
      streetAddress: string;
      city: string;
      state: string;
      pincode: string;
    },
    paymentMethod: 'UPI' | 'NetBanking' | 'CreditCard' | 'Sandbox_Simulated'
  ): Promise<{ success: boolean; order: MarketplaceOrder; error?: string }> {
    if (!items || items.length === 0) {
      return { success: false, order: {} as MarketplaceOrder, error: 'Shopping cart is empty.' };
    }

    if (!shippingAddress.fullName || !shippingAddress.pincode) {
      return { success: false, order: {} as MarketplaceOrder, error: 'Incomplete shipping delivery details.' };
    }

    const subtotalInr = items.reduce((sum, ci) => sum + ci.item.priceInr * ci.quantity, 0);
    const gstInr = Math.round(subtotalInr * 0.18);
    const shippingInr = subtotalInr > 1500 ? 0 : 150;
    const totalInr = subtotalInr + gstInr + shippingInr;

    const orderNumber = `MS-ORD-${Date.now().toString().slice(-6)}`;
    const isSimulatedNotice =
      'SANDBOX SIMULATION: This transaction was processed through the MangalSutra test sandbox. No real bank transfer or credit card charge was made.';

    const order: MarketplaceOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      items,
      subtotalInr,
      gstInr,
      shippingInr,
      totalInr,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'Sandbox_Verified',
      orderStatus: 'Order_Placed',
      createdAt: new Date().toISOString(),
      isSimulatedNotice,
    };

    return { success: true, order };
  },

  // 4. Fetch Commercial Tier Plans & Entitlements
  async getCommercialTierPlans(): Promise<CommercialTierPlan[]> {
    return COMMERCIAL_TIERS;
  },
};
