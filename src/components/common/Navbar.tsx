// Navigation Header & Mobile Bottom Bar
// Re-architected with Streamlined Ecosystem Dropdown, Clear Profile Pill & Visible Logout

import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { 
  Compass, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  User, 
  Map, 
  Sparkles, 
  HeartHandshake, 
  Flower2, 
  Flame, 
  ShoppingBag, 
  LogOut, 
  LogIn, 
  Lock, 
  UserPlus, 
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    mutualConnections, 
    currentUser, 
    isUserVerified, 
    openAuthModal, 
    logoutUser, 
    startOnboarding 
  } = useApp();

  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEcosystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items (Left-to-Center)
  const primaryNavItems: { tab: ActiveTab; label: string; icon: any; badge?: number; isProtected?: boolean }[] = [
    { tab: 'discover', label: 'Discover', icon: Compass, isProtected: true },
    { tab: 'matches', label: 'Matches', icon: Heart, badge: isUserVerified && mutualConnections.length > 0 ? mutualConnections.length : undefined, isProtected: true },
    { tab: 'messages', label: 'Messages', icon: MessageCircle, badge: isUserVerified && mutualConnections.length > 0 ? 1 : undefined, isProtected: true },
    { tab: 'trust', label: 'Trust Hub', icon: ShieldCheck, isProtected: true },
    { tab: 'intelligence', label: 'Intelligence', icon: HeartHandshake, isProtected: true },
  ];

  // Secondary ecosystem items inside the compact dropdown
  const ecosystemItems: { tab: ActiveTab; label: string; sub: string; icon: any; isProtected?: boolean }[] = [
    { tab: 'second_chapter', label: 'Second Chapter', sub: 'Remarriage & Family Transition', icon: Flower2, isProtected: true },
    { tab: 'pratha', label: 'Pratha Traditions', sub: 'Rituals, Vedic Astrologers & Pujas', icon: Flame, isProtected: true },
    { tab: 'marketplace', label: 'Marketplace', sub: 'Curated Wedding Venues & Photographers', icon: ShoppingBag, isProtected: true },
    { tab: 'roadmap', label: 'Ecosystem Vision', sub: 'Architecture & Innovation Roadmap', icon: Map },
  ];

  const isEcosystemActive = ecosystemItems.some((item) => item.tab === activeTab);

  return (
    <>
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Brand */}
          <div 
            className="nav-brand" 
            onClick={() => setActiveTab(isUserVerified ? 'discover' : 'home')}
            role="button"
            tabIndex={0}
            title="MangalSutra Home"
          >
            <div className="nav-brand-logo">
              <Sparkles size={20} color="#D4AF37" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="nav-brand-title">MangalSutra</span>
              </div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Marriage, With Trust
              </div>
            </div>
          </div>

          {/* Desktop Links (Primary 5 + Ecosystem Dropdown) */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              const showLock = item.isProtected && !isUserVerified;

              return (
                <button
                  key={item.tab}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.tab)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {showLock && (
                    <Lock size={12} color="var(--color-gold-dark)" style={{ opacity: 0.7 }} />
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        background: 'var(--color-burgundy)',
                        color: '#FFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Ecosystem Dropdown Menu */}
            <div className="nav-dropdown-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                className={`nav-item-btn ${isEcosystemActive ? 'active' : ''}`}
                onClick={() => setIsEcosystemOpen(!isEcosystemOpen)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                aria-expanded={isEcosystemOpen}
                aria-haspopup="true"
              >
                <Layers size={17} />
                <span>More Hubs</span>
                <ChevronDown 
                  size={14} 
                  style={{ 
                    transform: isEcosystemOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 200ms ease' 
                  }} 
                />
              </button>

              {isEcosystemOpen && (
                <div 
                  className="nav-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    minWidth: '290px',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 100,
                    animation: 'fadeIn 180ms ease-out'
                  }}
                >
                  <div style={{ padding: '0.4rem 0.6rem 0.25rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Complementary Ecosystem
                  </div>
                  {ecosystemItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    const showLock = item.isProtected && !isUserVerified;

                    return (
                      <button
                        key={item.tab}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setIsEcosystemOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.65rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isActive ? 'rgba(107, 23, 40, 0.07)' : 'transparent',
                          color: isActive ? 'var(--color-burgundy-dark)' : 'var(--text-primary)',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '8px', 
                            background: isActive ? 'var(--color-burgundy)' : 'var(--bg-secondary)', 
                            color: isActive ? '#FFF' : 'var(--color-burgundy)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem' }}>
                            <span>{item.label}</span>
                            {showLock && <Lock size={12} color="var(--color-gold-dark)" />}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.25 }}>
                            {item.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* User Auth & Profile Actions (Always prominent and unclipped) */}
          <div className="nav-actions">
            {isUserVerified ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                {/* Profile Pill Button */}
                <button
                  className={`btn-outline ${activeTab === 'profile' ? 'active-profile' : ''}`}
                  style={{ 
                    padding: '0.38rem 0.85rem', 
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: activeTab === 'profile' ? 'rgba(107, 23, 40, 0.08)' : '#FFFFFF',
                    borderColor: activeTab === 'profile' ? 'var(--color-burgundy)' : 'var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onClick={() => setActiveTab('profile')}
                  title="View and manage your 5-layer profile"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '1.5px solid var(--color-gold)'
                    }}
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Profile
                    </span>
                  </div>
                </button>

                {/* Explicit Logout Button */}
                <button
                  className="btn-outline nav-logout-btn"
                  style={{ 
                    padding: '0.42rem 0.85rem', 
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: 'var(--radius-md)',
                    borderColor: '#FECACA',
                    color: '#991B1B',
                    background: '#FEF2F2'
                  }}
                  onClick={logoutUser}
                  title="Sign out of your account"
                  aria-label="Log Out"
                >
                  <LogOut size={15} color="#DC2626" />
                  <span style={{ fontWeight: 600 }}>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  className="btn-outline" 
                  style={{ 
                    padding: '0.45rem 0.95rem', 
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }} 
                  onClick={() => setActiveTab('login')}
                  title="Sign in to your registered account"
                >
                  <LogIn size={15} />
                  <span>Log In</span>
                </button>
                <button 
                  className="btn-primary" 
                  style={{ 
                    padding: '0.45rem 1.05rem', 
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }} 
                  onClick={startOnboarding}
                  title="Create new verified matrimonial account"
                >
                  <UserPlus size={15} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav-mobile" aria-label="Mobile Navigation">
        <button
          className={`bottom-nav-item ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          <Compass size={20} />
          <span>Discover</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          <Heart size={20} />
          <span>Matches</span>
          {isUserVerified && mutualConnections.length > 0 && (
            <span className="bottom-nav-badge">{mutualConnections.length}</span>
          )}
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageCircle size={20} />
          <span>Messages</span>
          {isUserVerified && mutualConnections.length > 0 && (
            <span className="bottom-nav-badge">1</span>
          )}
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'trust' ? 'active' : ''}`}
          onClick={() => setActiveTab('trust')}
        >
          <ShieldCheck size={20} />
          <span>Trust</span>
        </button>

        {/* Profile / Account on mobile */}
        {isUserVerified ? (
          <button
            className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        ) : (
          <button
            className={`bottom-nav-item ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>
        )}
      </nav>
    </>
  );
};
