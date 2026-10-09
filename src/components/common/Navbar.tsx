// Navigation Header & Mobile Bottom Bar

import React from 'react';
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
  LogOut, 
  LogIn 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    mutualConnections, 
    currentUser, 
    isLoggedIn, 
    openAuthModal, 
    logoutUser 
  } = useApp();

  const navItems: { tab: ActiveTab; label: string; icon: any; badge?: number }[] = [
    { tab: 'discover', label: 'Discover', icon: Compass },
    { tab: 'second_chapter', label: 'Second Chapter', icon: Flower2 },
    { tab: 'matches', label: 'Matches', icon: Heart, badge: mutualConnections.length },
    { tab: 'messages', label: 'Messages', icon: MessageCircle, badge: 1 },
    { tab: 'trust', label: 'Trust Hub', icon: ShieldCheck },
    { tab: 'intelligence', label: 'Intelligence', icon: HeartHandshake },
    { tab: 'pratha', label: 'Pratha', icon: Flame },
    { tab: 'profile', label: 'My Profile', icon: User },
    { tab: 'roadmap', label: 'Ecosystem', icon: Map },
  ];

  return (
    <>
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Brand */}
          <div className="nav-brand" onClick={() => setActiveTab('home')}>
            <div className="nav-brand-logo">
              <Sparkles size={20} color="#D4AF37" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="nav-brand-title">MangalSutra</span>
                <span className="nav-brand-tag">2.0</span>
              </div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Marriage, With Trust
              </div>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.tab)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
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
          </nav>

          {/* User Auth Actions */}
          <div className="nav-actions">
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  className="btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                  onClick={() => setActiveTab('profile')}
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  className="btn-outline"
                  style={{ padding: '0.45rem', borderRadius: '50%' }}
                  onClick={logoutUser}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }} onClick={openAuthModal}>
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav-mobile" aria-label="Mobile Navigation">
        {[navItems[0], navItems[1], navItems[3], navItems[4], navItems[5]].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.tab)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bottom-nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
