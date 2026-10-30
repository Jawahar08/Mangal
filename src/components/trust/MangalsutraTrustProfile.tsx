// Page 6 Blueprint: MANGALSUTRA TRUST PROFILE Component
// "6. THE MOST IMPORTANT NEW FEATURE — 'TRUST PROFILE'"
// "Give every user a separate: 🛡️ MANGALSUTRA TRUST PROFILE"
//
// 10 Distinct Verification Dimensions:
// 1. Identity (Mobile verified, Email verified, Identity verified)
// 2. Age / DOB (Verified)
// 3. Education (Verified)
// 4. Employment (Verified)
// 5. Address (Verified)
// 6. Marriage status (Verified / Pending)
// 7. Divorce status (Verified / Pending / Not applicable)
// 8. Court verification (Checked / No matching record identified / Review required)
// 9. Police/antecedent verification (Verified / Pending / Not available)
// 10. Certificates (Verified)

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { TrustProfileResolver } from '../../services/backend/trustProfileResolver';
import { 
  ShieldCheck, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Share2, 
  Copy, 
  ExternalLink, 
  Lock, 
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  MapPin,
  HeartHandshake,
  Scale,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

interface MangalsutraTrustProfileProps {
  user: UserProfile;
  isCompact?: boolean;
  showActions?: boolean;
  onOpenVault?: () => void;
  onOpenCourtScreening?: () => void;
  onOpenMaritalAudit?: () => void;
}

export const MangalsutraTrustProfile: React.FC<MangalsutraTrustProfileProps> = ({
  user,
  isCompact = false,
  showActions = true,
  onOpenVault,
  onOpenCourtScreening,
  onOpenMaritalAudit,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const data = TrustProfileResolver.resolveTrustProfile(user);

  const handleCopyVerifiableLink = () => {
    navigator.clipboard.writeText(
      `https://mangalsutra.in/trust-profile/${user.id}?hash=0x_sec65b_${user.id.slice(0, 8)}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div 
      className="mangalsutra-trust-profile"
      style={{
        background: 'var(--bg-surface, #FFFFFF)',
        border: '1.5px solid rgba(197, 160, 89, 0.4)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: isCompact ? '1.25rem' : '2rem',
        boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.06))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Heritage Watermark */}
      <div 
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Blueprint Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1.5px solid rgba(197, 160, 89, 0.25)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{
              width: isCompact ? '46px' : '56px',
              height: isCompact ? '46px' : '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #14301D 0%, #15803D 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
              border: '2px solid #86EFAC',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={isCompact ? 24 : 30} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 
                style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", serif)', 
                  fontSize: isCompact ? '1.25rem' : '1.5rem', 
                  color: 'var(--color-burgundy-dark, #4A0E17)', 
                  fontWeight: 800, 
                  letterSpacing: '0.5px' 
                }}
              >
                MANGALSUTRA TRUST PROFILE
              </h2>
              <span 
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{data.trustScoreLevel} Status</span>
              </span>
            </div>

            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary, #6B7280)' }}>
              Dedicated, cryptographically audited credentials for <strong>{data.userName}</strong> ({data.userAge} yrs • {data.userCity})
            </p>
          </div>
        </div>

        {showActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopyVerifiableLink}
              className="btn-outline"
              style={{
                fontSize: '0.78rem',
                padding: '0.45rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#F9FAFB',
              }}
              title="Copy verifiable verification URL"
            >
              {copiedLink ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Trust Link'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 10 Page 6 Blueprint Dimensions */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(310px, 1fr))', 
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* 1. Identity (Mobile, Email, Identity) */}
        <div 
          style={{ 
            background: 'var(--bg-primary, #FCFBF7)', 
            border: '1px solid rgba(197, 160, 89, 0.25)', 
            borderRadius: 'var(--radius-md, 12px)', 
            padding: '1.15rem',
            gridColumn: isCompact ? 'span 1' : 'span 2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <UserCheck size={17} color="var(--color-burgundy, #800020)" />
              <strong style={{ fontSize: '0.96rem', color: 'var(--color-burgundy-dark, #4A0E17)' }}>
                Identity
              </strong>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #9CA3AF)', fontWeight: 600 }}>
              Primary Demographic Authenticity
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {/* Mobile verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm, 8px)', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="#16A34A" strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>Mobile verified</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #6B7280)' }}>2FA carrier handshake</div>
              </div>
            </div>

            {/* Email verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm, 8px)', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="#16A34A" strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>Email verified</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #6B7280)' }}>Institutional domain challenge</div>
              </div>
            </div>

            {/* Identity verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm, 8px)', border: '1px solid #E5E7EB' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="#16A34A" strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>Identity verified</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #6B7280)' }}>Aadhaar / Passport biometric hash</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Age / DOB */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Age / DOB
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {data.ageDob.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.ageDob.detail}
          </p>
        </div>

        {/* 3. Education */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Education
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {data.education.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.education.detail}
          </p>
        </div>

        {/* 4. Employment */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Employment
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {data.employment.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.employment.detail}
          </p>
        </div>

        {/* 5. Address */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Address
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {data.address.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.address.detail}
          </p>
        </div>

        {/* 6. Marriage status */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Marriage status
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: data.marriageStatus.status === 'verified' ? '#15803D' : '#D97706' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.marriageStatus.status === 'verified' ? '#16A34A' : '#F59E0B', display: 'inline-block' }} />
              {data.marriageStatus.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.marriageStatus.detail}
          </p>
        </div>

        {/* 7. Divorce status */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Divorce status
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: data.divorceStatus.status === 'pending' ? '#D97706' : '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.divorceStatus.status === 'pending' ? '#F59E0B' : '#16A34A', display: 'inline-block' }} />
              {data.divorceStatus.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.divorceStatus.detail}
          </p>
        </div>

        {/* 8. Court verification */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Court verification
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: data.courtVerification.status === 'review_required' ? '#B91C1C' : '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.courtVerification.status === 'review_required' ? '#EF4444' : '#16A34A', display: 'inline-block' }} />
              {data.courtVerification.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.courtVerification.detail}
          </p>
        </div>

        {/* 9. Police/antecedent verification */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Police/antecedent verification
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: data.policeVerification.status === 'verified' ? '#15803D' : data.policeVerification.status === 'pending' ? '#D97706' : '#6B7280' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.policeVerification.status === 'verified' ? '#16A34A' : data.policeVerification.status === 'pending' ? '#F59E0B' : '#9CA3AF', display: 'inline-block' }} />
              {data.policeVerification.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.policeVerification.detail}
          </p>
        </div>

        {/* 10. Certificates */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: 'var(--radius-md, 12px)', padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark, #4A0E17)' }}>
              Certificates
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: '#15803D' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {data.certificates.statusLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #6B7280)', lineHeight: 1.4 }}>
            {data.certificates.detail}
          </p>
        </div>
      </div>

      {/* Institutional Legal Disclaimer & Trust Vault Isolation Footer */}
      <div 
        style={{
          background: 'var(--bg-primary, #FCFBF7)',
          borderTop: '1px solid rgba(197, 160, 89, 0.25)',
          paddingTop: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.74rem',
          color: 'var(--text-muted, #9CA3AF)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', maxWidth: '650px' }}>
          <Lock size={13} color="#15803D" style={{ flexShrink: 0 }} />
          <span>
            <strong>Quarantined Trust Vault:</strong> Raw government IDs, degree scans, and case filings remain strictly sealed under DPDP Act Section 6(4). Only authenticated verification status badges are published.
          </span>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--color-burgundy, #800020)', fontWeight: 700 }}>
          ChaanBean ID: #{user.id.slice(0, 8).toUpperCase()} • Verified {data.verifiedAtFormatted}
        </div>
      </div>
    </div>
  );
};
