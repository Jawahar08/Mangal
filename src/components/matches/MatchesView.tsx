// Module D: Matches & Mutual Connections View

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchCard } from '../discover/MatchCard';
import { ProfileDetailModal } from '../discover/ProfileDetailModal';
import { Heart, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const MatchesView: React.FC = () => {
  const { 
    discoveryProfiles, 
    mutualConnections, 
    interestsSent, 
    startChatWith, 
    activePartnerForDetail, 
    closePartnerDetail 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'mutual' | 'sent'>('mutual');

  const mutualProfiles = discoveryProfiles.filter((p) => mutualConnections.includes(p.id));
  const sentProfiles = discoveryProfiles.filter((p) => interestsSent.includes(p.id) && !mutualConnections.includes(p.id));

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* View Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-section" style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          Your Connections & Interests
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Mutual connections unlock private direct messaging, shared compatibility conversations, and detailed trust profiles.
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveSubTab('mutual')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: activeSubTab === 'mutual' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'mutual' ? '3px solid var(--color-burgundy)' : '3px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Sparkles size={16} color={activeSubTab === 'mutual' ? 'var(--color-gold-dark)' : 'var(--text-muted)'} />
          <span>Mutual Matches ({mutualProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sent')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: activeSubTab === 'sent' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'sent' ? '3px solid var(--color-burgundy)' : '3px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Heart size={16} />
          <span>Interests Sent ({sentProfiles.length})</span>
        </button>
      </div>

      {/* MUTUAL MATCHES */}
      {activeSubTab === 'mutual' && (
        <div>
          {mutualProfiles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {mutualProfiles.map((partner) => (
                <MatchCard key={partner.id} partner={partner} />
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--color-gold)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '520px', margin: '2rem auto' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Sparkles size={24} color="var(--color-gold-dark)" />
              </div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
                No Mutual Matches Yet
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                When someone reciprocates your expression of interest, they will appear here and unlock direct private conversations!
              </p>
            </div>
          )}
        </div>
      )}

      {/* SENT INTERESTS */}
      {activeSubTab === 'sent' && (
        <div>
          {sentProfiles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {sentProfiles.map((partner) => (
                <MatchCard key={partner.id} partner={partner} />
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--color-gold)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '520px', margin: '2rem auto' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Heart size={24} color="var(--color-gold-dark)" />
              </div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
                No Pending Sent Interests
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You have not expressed interest in any pending profiles yet. Explore matches to begin connecting.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        partner={activePartnerForDetail}
        onClose={closePartnerDetail}
      />
    </div>
  );
};
