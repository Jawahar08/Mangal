// Module D: Discovery & Matchmaking View

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { MatchCard } from './MatchCard';
import { ProfileDetailModal } from './ProfileDetailModal';
import { 
  Compass, 
  Sparkles, 
  Bookmark, 
  HeartHandshake, 
  Filter, 
  Search, 
  RotateCcw, 
  ShieldCheck,
  ArrowRight 
} from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const { 
    discoveryProfiles, 
    savedProfileIds, 
    activePartnerForDetail, 
    closePartnerDetail,
    setActiveTab: setActiveAppTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'recommended' | 'new' | 'second_chapter' | 'saved'>('recommended');

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedReligion, setSelectedReligion] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [maxAge, setMaxAge] = useState<number>(36);

  // Filter Logic
  const filteredProfiles = useMemo(() => {
    return discoveryProfiles.filter((p) => {
      // Tab matching
      if (activeTab === 'saved') {
        if (!savedProfileIds.includes(p.id)) return false;
      } else if (activeTab === 'second_chapter') {
        if (p.intent !== 'remarriage' && p.maritalStatus === 'never_married') return false;
      } else if (activeTab === 'new') {
        // Just as a filter demonstration
      }

      // Keyword match
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesProf = p.profession.toLowerCase().includes(query);
        const matchesCity = p.currentCity.toLowerCase().includes(query);
        const matchesBio = p.bio.toLowerCase().includes(query);
        if (!matchesName && !matchesProf && !matchesCity && !matchesBio) return false;
      }

      // Religion filter
      if (selectedReligion !== 'all' && p.religion.toLowerCase() !== selectedReligion.toLowerCase()) {
        return false;
      }

      // Verified only
      if (verifiedOnly) {
        const hasVerifiedCheck = p.trustProfile.checks.some((c) => c.status === 'verified');
        if (!hasVerifiedCheck) return false;
      }

      // Age filter
      if (p.age > maxAge) return false;

      return true;
    });
  }, [discoveryProfiles, activeTab, savedProfileIds, searchKeyword, selectedReligion, verifiedOnly, maxAge]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedReligion('all');
    setVerifiedOnly(false);
    setMaxAge(36);
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* View Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-section" style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          Matrimonial Discovery
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Explore life partners through genuine compatibility, verified ChaanBean trust, and shared values.
        </p>
      </div>

      {/* Discovery Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'recommended', label: 'Recommended Matches', icon: Sparkles },
          { id: 'new', label: 'New Matches', icon: Compass },
          { id: 'second_chapter', label: 'Second Chapter (Remarriage)', icon: HeartHandshake },
          { id: 'saved', label: `Saved Profiles (${savedProfileIds.length})`, icon: Bookmark },
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
                color: isActive ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-burgundy)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border-delicate)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Keyword Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              <Search size={13} />
              <span>Keyword Search</span>
            </label>
            <input
              className="form-input"
              style={{ padding: '0.55rem 0.85rem' }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Profession, city, hobby..."
            />
          </div>

          {/* Religion */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Religion / Faith</label>
            <select
              className="form-select"
              style={{ padding: '0.55rem 0.85rem' }}
              value={selectedReligion}
              onChange={(e) => setSelectedReligion(e.target.value)}
            >
              <option value="all">All Faiths</option>
              <option value="hindu">Hindu</option>
              <option value="jain">Jain</option>
              <option value="sikh">Sikh</option>
            </select>
          </div>

          {/* Age slider */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Age: {maxAge} yrs</label>
            <input
              type="range"
              min={24}
              max={45}
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-burgundy)' }}
            />
          </div>

          {/* Verified toggle & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: '#15803D' }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <ShieldCheck size={16} />
              <span>ChaanBean Only</span>
            </label>

            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 'auto' }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Chapter Dedicated Banner */}
      {activeTab === 'second_chapter' && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🌿 Second Chapter Remarriage Ecosystem</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#15803D', marginTop: '0.2rem' }}>
              Access your dedicated Rebuild Profile, Children & Custody safeguards, and the 7-Pillar recovery resources.
            </div>
          </div>
          <button className="btn-primary" style={{ background: '#15803D', borderColor: '#15803D', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }} onClick={() => setActiveAppTab('second_chapter')}>
            <span>Open Second Chapter Hub</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Match Results Grid */}
      <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        Showing <strong>{filteredProfiles.length}</strong> matching candidate profiles
      </div>

      {filteredProfiles.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {filteredProfiles.map((partner) => (
            <MatchCard key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '2rem auto',
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Filter size={26} color="var(--color-gold-dark)" />
          </div>
          <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
            No Matching Profiles in this Category
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            We could not find candidate profiles matching all selected filter constraints. Try expanding the age range or clearing active filters.
          </p>
          <button className="btn-secondary" onClick={handleResetFilters}>
            Reset Filter Constraints
          </button>
        </div>
      )}

      {/* Deep Profile Detail Modal */}
      <ProfileDetailModal
        partner={activePartnerForDetail}
        onClose={closePartnerDetail}
      />
    </div>
  );
};
