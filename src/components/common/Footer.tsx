// Trustworthy Heritage Footer Component

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, Heart, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer style={{ background: '#24080E', color: '#FDFBF7', borderTop: 'var(--border-delicate)', marginTop: '4rem', padding: '4rem 0 2.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand Vision */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4A0E17', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#D4AF37" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#FDFBF7' }}>
                MangalSutra 2.0
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#D4C5C8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              More Than a Match. A Life Journey. Dedicated to genuine human relationships, verified trust via ChaanBean, Vedic harmony, and long-term marriage wellbeing.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#E5C37A' }}>
              <Shield size={12} />
              <span>ChaanBean Trust Vault Protected</span>
            </div>
          </div>

          {/* Connected Ecosystem */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#E5C37A', marginBottom: '1rem' }}>
              The Ecosystem
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#D4C5C8' }}>
              <li>
                <button onClick={() => setActiveTab('discover')} style={{ color: 'inherit', textAlign: 'left' }}>
                  • <strong>MangalSutra</strong>: Matchmaking & Profiles
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('trust')} style={{ color: 'inherit', textAlign: 'left' }}>
                  • <strong>ChaanBean</strong>: Trust Vault & Verification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roadmap')} style={{ color: 'inherit', textAlign: 'left' }}>
                  • <strong>Pratha</strong>: Spirituality & Rituals (Phase 5)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roadmap')} style={{ color: 'inherit', textAlign: 'left' }}>
                  • <strong>Marketplace</strong>: Wedding & Wellness (Phase 6)
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Safety */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#E5C37A', marginBottom: '1rem' }}>
              Safety & Verification
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#D4C5C8' }}>
              <li>Consent-Based Document Processing</li>
              <li>No Raw Document Disclosure</li>
              <li>Zero Fabricated Compatibility Claims</li>
              <li>Grievance Officer & Abuse Reporting</li>
              <li>Protected Private Messaging</li>
            </ul>
          </div>

          {/* Integrity Note */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#E5C37A', marginBottom: '1rem' }}>
              Ethical Integrity
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#BBA4A8', lineHeight: 1.55 }}>
              Verification checks distinguish between user-supplied assertions and independent cryptographic checks. A pending status does not imply misconduct, nor does any calculation guarantee marital success.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.2)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#A08E92' }}>
          <div>
            © 2026 MangalSutra 2.0 Technologies. All rights reserved. Built with pride for life journeys.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Trust Guidelines</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('roadmap')}>Architecture Roadmap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
