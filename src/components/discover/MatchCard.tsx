// Module D: Match Card Component

import React from 'react';
import { UserProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { computeComprehensiveCompatibility } from '../../services/compatibilityEngine';
import { 
  Heart, 
  Bookmark, 
  Sparkles, 
  Lock, 
  Unlock, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  MessageCircle 
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';

interface MatchCardProps {
  partner: UserProfile;
}

export const MatchCard: React.FC<MatchCardProps> = ({ partner }) => {
  const { 
    currentUser, 
    savedProfileIds, 
    toggleSaveProfile, 
    interestsSent, 
    mutualConnections, 
    photoUnlockedIds, 
    sendInterest, 
    requestPhotoAccess, 
    openPartnerDetail,
    startChatWith 
  } = useApp();

  const isSaved = savedProfileIds.includes(partner.id);
  const isInterestSent = interestsSent.includes(partner.id);
  const isMutual = mutualConnections.includes(partner.id);
  const isPhotoUnlocked = photoUnlockedIds.includes(partner.id);

  // Compute real compatibility
  const compatibility = computeComprehensiveCompatibility(currentUser, partner);

  const isBlurred = partner.photosBlurred && !isPhotoUnlocked;

  return (
    <div className="card-heritage" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Photo Header */}
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden', background: '#2B0A11' }}>
        <img
          src={partner.photoUrl}
          alt={partner.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isBlurred ? 'blur(12px)' : 'none',
            transform: isBlurred ? 'scale(1.08)' : 'none',
            transition: 'filter 250ms ease',
          }}
        />

        {/* Blurred Photo Privacy Overlay */}
        {isBlurred && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(43, 10, 17, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <Lock size={24} color="#D4AF37" style={{ marginBottom: '0.4rem' }} />
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem' }}>Photos Private</div>
            <p style={{ color: '#EBE1D7', fontSize: '0.72rem', maxWidth: '200px', margin: '0.25rem 0 0.75rem' }}>
              Member prefers privacy until mutual comfort or verified photo request.
            </p>
            <button
              className="btn-gold"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
              onClick={() => requestPhotoAccess(partner.id)}
            >
              <Unlock size={12} />
              <span>Request Photo Access</span>
            </button>
          </div>
        )}

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
          <StatusBadge status="verified" customLabel="ChaanBean" size="sm" />
          {partner.intent === 'remarriage' && (
            <span style={{ background: '#831843', color: '#FFF', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
              Second Chapter
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveProfile(partner.id)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSaved ? 'var(--color-burgundy)' : 'var(--text-secondary)',
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label={isSaved ? 'Remove from saved' : 'Save profile'}
        >
          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Bottom Card Image Overlay with 36 Guna preview */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(43, 10, 17, 0.9) 100%)',
            padding: '1.25rem 1rem 0.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.15rem' }}>
              {partner.name}, {partner.age}
            </div>
            <div style={{ color: '#E5C37A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={12} />
              <span>{partner.currentCity}</span>
            </div>
          </div>

          {/* Real Deterministic Guna Badge */}
          <div
            style={{
              background: 'rgba(197, 160, 89, 0.25)',
              border: '1px solid #D4AF37',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div style={{ fontSize: '0.62rem', color: '#FFF8E7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              36 Guna
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFD700', lineHeight: 1 }}>
              {compatibility.gunaScore} / 36
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Key Attributes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={14} color="var(--color-gold-dark)" />
              <span style={{ fontWeight: 600 }}>{partner.profession}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={14} color="var(--color-gold-dark)" />
              <span>{partner.educationField || partner.education}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} color="var(--color-gold-dark)" />
              <span>{partner.religion} • {partner.community} • Gotra: {partner.astrology.gotra}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            "{partner.bio}"
          </p>
        </div>

        {/* Card Actions */}
        <div style={{ paddingTop: '0.75rem', borderTop: 'var(--border-light)', display: 'flex', gap: '0.6rem' }}>
          <button
            className="btn-outline"
            style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
            onClick={() => openPartnerDetail(partner)}
          >
            View 5 Layers
          </button>

          {isMutual ? (
            <button
              className="btn-gold"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              onClick={() => startChatWith(partner.id)}
            >
              <MessageCircle size={14} />
              <span>Chat Now</span>
            </button>
          ) : isInterestSent ? (
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', background: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }}
              disabled
            >
              <CheckCircle2 size={14} />
              <span>Interest Sent</span>
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              onClick={() => sendInterest(partner.id)}
            >
              <Heart size={14} />
              <span>Express Interest</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
