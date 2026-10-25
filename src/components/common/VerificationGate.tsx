// VerificationGate.tsx
// High-Trust Gate Screen for Unregistered / Unverified Visitors

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  HeartHandshake, 
  CheckCircle2, 
  KeyRound, 
  Compass, 
  ShieldAlert 
} from 'lucide-react';

interface VerificationGateProps {
  featureName?: string;
  description?: string;
}

export const VerificationGate: React.FC<VerificationGateProps> = ({
  featureName = 'Candidate Discovery & Matches',
  description = 'Candidate profiles, 36 Guna astrological compatibility, and private messaging are strictly guarded under the ChaanBean Trust Protocol.',
}) => {
  const { startOnboarding, openAuthModal, loginUser } = useApp();

  return (
    <div className="container" style={{ maxWidth: '820px', padding: '2.5rem 1.25rem 5rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* Hero Container */}
      <div className="card-heritage" style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background decorative watermark */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '-40px', 
            right: '-40px', 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            background: 'rgba(197, 160, 89, 0.08)', 
            pointerEvents: 'none' 
          }} 
        />

        {/* Lock Trust Badge */}
        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'var(--color-burgundy-subtle)', 
            border: '2px solid var(--color-gold)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 16px rgba(74, 14, 23, 0.1)'
          }}
        >
          <Lock size={28} color="var(--color-burgundy)" />
        </div>

        {/* Section Pill */}
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'var(--color-gold-subtle)', 
            border: '1px solid rgba(197, 160, 89, 0.4)', 
            padding: '0.35rem 0.95rem', 
            borderRadius: 'var(--radius-full)', 
            color: 'var(--color-burgundy-dark)', 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            letterSpacing: '0.5px', 
            textTransform: 'uppercase', 
            marginBottom: '1rem' 
          }}
        >
          <ShieldCheck size={14} color="var(--color-gold-dark)" />
          <span>ChaanBean Trust Shield • Account Required</span>
        </div>

        <h1 className="heading-section" style={{ fontSize: '2.1rem', marginBottom: '0.75rem', color: 'var(--color-burgundy-dark)' }}>
          {featureName} is Protected
        </h1>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '640px', margin: '0 auto 2rem' }}>
          {description} To safeguard our members from fake profiles and protect genuine marital intent, 
          candidates and mutual matches become active <strong>only after completing your profile & verification</strong>.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={startOnboarding}
          >
            <UserPlus size={18} />
            <span>Create Account & Get Verified</span>
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn-secondary" 
            style={{ padding: '0.9rem 1.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={openAuthModal}
          >
            <LogIn size={18} />
            <span>Sign In to Existing Account</span>
          </button>
        </div>

        {/* Quick Demo Preview Option */}
        <div style={{ background: 'var(--bg-primary)', border: '1px dashed var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', maxWidth: '560px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-burgundy-dark)', fontWeight: 700, marginBottom: '0.35rem' }}>
            Evaluating or Testing MangalSutra?
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            You can instantly load a pre-verified sample member account to preview discovery, 36 Guna scores, and messaging.
          </p>
          <button
            type="button"
            className="btn-gold"
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.82rem' }}
            onClick={() => loginUser('arjun.sharma@example.com')}
          >
            <Sparkles size={14} />
            <span>Explore as Verified Member (Demo Arjun Sharma)</span>
          </button>
        </div>

        {/* 3 Pillars of Safety Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', textAlign: 'left', borderTop: 'var(--border-light)', paddingTop: '2rem' }}>
          
          <div style={{ padding: '1rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803D', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <CheckCircle2 size={16} />
              <span>1. Verified Credentials</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Phone OTP, Government ID hash, and degree verification prevent fraudulent impersonation.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-burgundy)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <Lock size={16} />
              <span>2. Mutual Privacy First</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Private photos and phone numbers remain shielded until both parties mutually agree to connect.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-dark)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <Sparkles size={16} />
              <span>3. Authentic Intent</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Talk Before You Marry discussion guides and 36 Guna alignment ensure long-term harmony.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
