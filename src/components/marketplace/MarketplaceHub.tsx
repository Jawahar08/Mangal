// Phase 6: MangalSutra Marketplace & Commercial Tiers Hub (Module O & S)
// Curated wedding products, artisanal goods, honest sandbox checkout, and commercial tier plans.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MARKETPLACE_ITEMS, 
  MARKETPLACE_VENDORS, 
  COMMERCIAL_TIERS, 
  MarketplaceService 
} from '../../services/marketplaceService';
import { 
  MarketplaceItem, 
  MarketplaceCategory, 
  CartItem, 
  MarketplaceOrder, 
  CommercialTierId 
} from '../../types/marketplace';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Star, 
  Trash2, 
  Plus, 
  Minus, 
  Lock, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Info, 
  AlertTriangle, 
  CreditCard, 
  QrCode, 
  RefreshCw 
} from 'lucide-react';

export const MarketplaceHub: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'orders' | 'vendors' | 'tiers'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => MarketplaceService.getCart());

  // Orders State
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => MarketplaceService.getOrders());

  // Active Tier State
  const [activeTier, setActiveTier] = useState<CommercialTierId>(() => MarketplaceService.getActiveTier());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Checkout Form State
  const [shippingName, setShippingName] = useState(currentUser.name);
  const [shippingPhone, setShippingPhone] = useState('+91 98765 43210');
  const [shippingStreet, setShippingStreet] = useState('42, Heritage Enclave, Indiranagar');
  const [shippingCity, setShippingCity] = useState(currentUser.currentCity.split(',')[0]);
  const [shippingState, setShippingState] = useState('Karnataka');
  const [shippingPincode, setShippingPincode] = useState('560038');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'UPI' | 'CreditCard' | 'NetBanking'>('UPI');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Selected item modal
  const [viewingItem, setViewingItem] = useState<MarketplaceItem | null>(null);

  // Filtered Items
  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSub = item.subcategory.toLowerCase().includes(q);
      const matchVendor = item.vendorName.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchVendor) return false;
    }
    return true;
  });

  const handleAddToCart = (item: MarketplaceItem) => {
    const updated = MarketplaceService.addToCart(item, 1);
    setCart(updated);
    showToast('Added to Cart', `${item.name} is in your shopping cart.`, 'success');
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    const updated = MarketplaceService.updateQuantity(itemId, qty);
    setCart(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = MarketplaceService.removeFromCart(itemId);
    setCart(updated);
    showToast('Item Removed', 'Removed item from shopping cart.', 'info');
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, c) => acc + c.item.priceInr * c.quantity, 0);
  const gst = Math.round(subtotal * 0.03); // Standard 3% on bridal jewellery/crafts
  const shipping = subtotal > 2000 ? 0 : 250;
  const total = subtotal + gst + shipping;

  const handlePlaceSandboxOrder = () => {
    if (cart.length === 0) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      const newOrder: MarketplaceOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `MS-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        subtotalInr: subtotal,
        gstInr: gst,
        shippingInr: shipping,
        totalInr: total,
        shippingAddress: {
          fullName: shippingName,
          phone: shippingPhone,
          streetAddress: shippingStreet,
          city: shippingCity,
          state: shippingState,
          pincode: shippingPincode,
        },
        paymentMethod: 'Sandbox_Simulated',
        paymentStatus: 'Sandbox_Verified',
        orderStatus: 'Order_Placed',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        isSimulatedNotice: 'TEST TRANSACTION: Sandbox simulated order. Real payment gateways (Razorpay/Stripe) require production merchant KYC credentials.',
      };

      MarketplaceService.placeOrder(newOrder);
      setOrders(MarketplaceService.getOrders());
      setCart([]);
      setIsProcessingCheckout(false);
      setActiveTab('orders');
      showToast(
        'Sandbox Order Placed!',
        `Order ${newOrder.orderNumber} successfully recorded in the fulfillment ledger.`,
        'success'
      );
    }, 750);
  };

  const handleSelectTier = (tierId: CommercialTierId) => {
    MarketplaceService.setActiveTier(tierId);
    setActiveTier(tierId);
    showToast(
      'Active Plan Updated',
      `Switched to proposed tier: ${tierId.toUpperCase()} (Sandbox simulator).`,
      'info'
    );
  };

  return (
    <div className="container" style={{ maxWidth: '1060px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3B0764 0%, #581C87 50%, #7E22CE 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F3E8FF', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <ShoppingBag size={16} color="#E9D5FF" />
            <span>MangalSutra Marketplace & Commercial Architecture (Phase 6)</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            Curated Artisans. Honest Commerce.
          </h1>
          <p style={{ color: '#F3E8FF', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Discover certified bridal jewellery, handloom silk, complete Vedic havan kits, and rejuvenating couple retreats. 
            All checkouts operate with full transparency—no fake payment success or ungrounded guarantees.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} color="#E9D5FF" />
              <span>BIS 916 Hallmark & Silk Mark Artisans</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Lock size={14} color="#E9D5FF" />
              <span>Honest Gateway Sandbox (Zero Fake Success)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'shop', label: 'Curated Marketplace', icon: ShoppingBag },
          { id: 'cart', label: `Cart (${cart.reduce((a, c) => a + c.quantity, 0)})`, icon: ShoppingBag },
          { id: 'orders', label: `Orders Ledger (${orders.length})`, icon: Clock },
          { id: 'vendors', label: 'Artisan & Vendor Directory', icon: ShieldCheck },
          { id: 'tiers', label: 'Proposed Commercial Tiers', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? '#7E22CE' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid #7E22CE' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? '#7E22CE' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CURATED MARKETPLACE */}
      {activeTab === 'shop' && (
        <div>
          {/* Category Filter Pills & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'wedding_services', label: '💍 Wedding Jewellery & Silks' },
                { id: 'spiritual_puja', label: '🪔 Sacred Puja & Havan Kits' },
                { id: 'before_marriage', label: '🌿 Couple Retreats & Prompts' },
                { id: 'after_marriage_wellbeing', label: '🏡 Home Sanctuary Brassware' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: selectedCategory === cat.id ? '#6B21A8' : 'var(--bg-secondary)',
                    color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                    border: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ width: '240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search items, artisans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
              />
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
            </div>
          </div>

          {/* Product Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card-heritage"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '200px' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {item.ethicalTag && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(8px)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--color-burgundy-dark)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      {item.ethicalTag}
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.subcategory}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span>{item.rating} ({item.reviewsCount})</span>
                      </div>
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                      {item.name}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      By <strong>{item.vendorName}</strong> • {item.vendorLocation}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                        ₹{item.priceInr.toLocaleString('en-IN')}
                      </span>
                      {item.originalPriceInr && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{item.originalPriceInr.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.55rem', fontSize: '0.85rem' }}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag size={15} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CART & HONEST SANDBOX CHECKOUT */}
      {activeTab === 'cart' && (
        <div>
          {cart.length === 0 ? (
            <div className="card-heritage" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <ShoppingBag size={48} color="var(--color-gold)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="heading-card" style={{ fontSize: '1.4rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
                Your Cart is Empty
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Explore bridal jewellery, handloom silks, and sacred puja kits in the curated marketplace.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('shop')}>
                <span>Browse Marketplace</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 360px)', gap: '1.75rem', alignItems: 'flex-start' }}>
              {/* Left Column: Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)' }}>
                  Selected Items ({cart.length})
                </h3>

                {cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="card-heritage"
                    style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
                  >
                    <img
                      src={c.item.imageUrl}
                      alt={c.item.name}
                      style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {c.item.subcategory}
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                        {c.item.name}
                      </h4>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
                        ₹{c.item.priceInr.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        onClick={() => handleUpdateQuantity(c.item.id, c.quantity - 1)}
                        style={{ padding: '0.2rem', color: 'var(--text-secondary)' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '18px', textAlign: 'center' }}>
                        {c.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(c.item.id, c.quantity + 1)}
                        style={{ padding: '0.2rem', color: 'var(--text-secondary)' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(c.item.id)}
                      style={{ color: '#B91C1C', padding: '0.4rem' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Shipping Details */}
                <div className="card-heritage" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '1rem' }}>
                    Delivery Address & Contact
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                      <input className="form-input" value={shippingName} onChange={(e) => setShippingName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Contact Phone</label>
                      <input className="form-input" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Street Address</label>
                    <input className="form-input" value={shippingStreet} onChange={(e) => setShippingStreet(e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>City</label>
                      <input className="form-input" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>State</label>
                      <input className="form-input" value={shippingState} onChange={(e) => setShippingState(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Pincode</label>
                      <input className="form-input" value={shippingPincode} onChange={(e) => setShippingPincode(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bill Summary & Honest Sandbox Payment */}
              <div className="card-heritage" style={{ padding: '1.75rem', position: 'sticky', top: '5.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '1rem' }}>
                  Order Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>GST (Estimated 3%):</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Insured Shipping:</span>
                    <span>{shipping === 0 ? <strong style={{ color: '#15803D' }}>FREE</strong> : `₹${shipping}`}</span>
                  </div>
                  <div style={{ borderTop: 'var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-burgundy-dark)' }}>
                    <span>Total Payable:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Honest Sandbox Disclaimer */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#92400E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  <strong>🔒 Honest Sandbox Notice (Module O)</strong>: Production payment gateways require institutional merchant KYC credentials. This sandbox test demonstrates order dispatch without debiting your bank.
                </div>

                {/* Payment Mode Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                    Select Sandbox Test Mode:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {[
                      { id: 'UPI', label: '⚡ UPI QR Test' },
                      { id: 'CreditCard', label: '💳 Card Sandbox' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedPaymentMode(mode.id as any)}
                        style={{
                          padding: '0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: selectedPaymentMode === mode.id ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                          color: selectedPaymentMode === mode.id ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.92rem' }}
                  onClick={handlePlaceSandboxOrder}
                  disabled={isProcessingCheckout}
                >
                  {isProcessingCheckout ? (
                    <span>Verifying Sandbox Order...</span>
                  ) : (
                    <span>Confirm Sandbox Order (₹{total.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS LEDGER */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.35rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Orders & Vendor Fulfillment Ledger
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Transparent tracking of placed orders, insured dispatch status, and artisan fulfilment.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="card-heritage" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders placed yet. Add items to your cart to test the sandbox order flow.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="card-heritage"
                  style={{ padding: '1.75rem', borderLeft: '4px solid #15803D' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-burgundy-dark)' }}>
                        Order #{ord.orderNumber}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                        Placed on {ord.createdAt}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                        ✓ {ord.paymentStatus.replace(/_/g, ' ')}
                      </span>
                      <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                        📦 {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {ord.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>
                          {it.quantity}x {it.item.name} (by {it.item.vendorName})
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          ₹{(it.item.priceInr * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong>Ship To:</strong> {ord.shippingAddress.fullName}, {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                      Total: ₹{ord.totalInr.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
                    ℹ️ {ord.isSimulatedNotice}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ARTISAN & VENDOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.35rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Vetted Artisans & Service Partners
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Certified generational jewellers, master weavers, and authentic retreat centers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {MARKETPLACE_VENDORS.map((v) => (
              <div key={v.id} className="card-heritage" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                    {v.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                    <span>{v.rating} ({v.reviewCount})</span>
                  </div>
                </div>

                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                  {v.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <MapPin size={12} />
                  <span>{v.location} • Est. {v.establishedYear}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
                  {v.description}
                </p>

                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
                  ✓ {v.verificationBadge}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROPOSED COMMERCIAL TIERS & ENTITLEMENTS (MODULE S) */}
      {activeTab === 'tiers' && (
        <div>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Module S: Commercial Transparency
            </span>
            <h2 className="heading-section" style={{ fontSize: '2rem', marginTop: '0.3rem', marginBottom: '0.75rem' }}>
              Proposed Commercial Tiers & Entitlements
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We believe in uncompromised honesty. Membership tiers fund deep evidence-based registries and private sanctuary servers. 
              Payment never buys a verified badge or alters compatibility matching algorithms.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: 'var(--radius-full)', marginTop: '1.25rem' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '0.4rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: billingCycle === 'monthly' ? '#FFFFFF' : 'transparent',
                  color: billingCycle === 'monthly' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: billingCycle === 'monthly' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  padding: '0.4rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: billingCycle === 'annual' ? '#FFFFFF' : 'transparent',
                  color: billingCycle === 'annual' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: billingCycle === 'annual' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Annual Billing (Save ~33%)
              </button>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {COMMERCIAL_TIERS.map((tier) => {
              const price = billingCycle === 'monthly' ? tier.monthlyPriceInr : Math.round(tier.annualPriceInr / 12);
              const isCurrent = activeTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className="card-heritage"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: tier.isPopular ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                    position: 'relative',
                    background: tier.isPopular ? 'linear-gradient(180deg, #FFFFFF 0%, #FFFDFB 100%)' : '#FFFFFF',
                  }}
                >
                  {tier.isPopular && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '20px',
                        background: 'var(--color-burgundy)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      MOST POPULAR
                    </span>
                  )}

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                      {tier.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      {tier.tagline}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        / month {billingCycle === 'annual' && tier.annualPriceInr > 0 ? '(billed annually)' : ''}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#92400E', background: '#FEF3C7', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
                      {tier.transparencyCaveat}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
                      {tier.entitlements.map((ent, eIdx) => (
                        <div key={eIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem' }}>
                          <CheckCircle2
                            size={15}
                            color={ent.included ? '#15803D' : '#CBD5E1'}
                            style={{ flexShrink: 0, marginTop: '2px' }}
                          />
                          <span style={{ color: ent.included ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: ent.included ? 'none' : 'line-through' }}>
                            {ent.feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={isCurrent ? 'btn-gold' : 'btn-primary'}
                    style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
                    onClick={() => handleSelectTier(tier.id)}
                  >
                    {isCurrent ? '✓ Active Plan (Sandbox)' : 'Select Plan in Sandbox'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
