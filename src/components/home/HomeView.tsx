// Module A: Public Homepage & Hero Experience

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Heart, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Users, 
  Flower2, 
  ShoppingBag, 
  HelpCircle,
  FileCheck2,
  CalendarCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const HomeView: React.FC = () => {
  const { setActiveTab, startOnboarding } = useApp();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFEB 100%)', 
        borderBottom: 'var(--border-delicate)', 
        padding: '3.5rem 0 4.5rem' 
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '940px' }}>
          {/* Sacred motif badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-gold-subtle)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-burgundy-dark)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} color="#C5A059" />
            <span>MANGALSUTRA 2.0 — MORE THAN A MATCH. A LIFE JOURNEY.</span>
          </div>

          <h1 className="heading-hero" style={{ marginBottom: '1.25rem' }}>
            Find Your Life Partner With More Confidence.
          </h1>

          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.65rem)',
            color: 'var(--color-gold-dark)',
            fontWeight: 600,
            marginBottom: '1.5rem',
            letterSpacing: '0.5px'
          }}>
            Compatibility. Verification. Wisdom. Wellbeing.
          </p>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Move beyond superficial bio-cards. MangalSutra unites authentic Vedic compatibility, 
            ChaanBean consent-based credential verification, and thoughtful relationship preparation 
            into one dignified, trustworthy sanctuary.
          </p>

          {/* Primary Call to Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
              onClick={startOnboarding}
            >
              <span>Begin Conversational Onboarding</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
              onClick={() => setActiveTab('discover')}
            >
              <Compass size={18} />
              <span>Explore Profiles</span>
            </button>
          </div>

          {/* Four Core Actions Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left'
          }}>
            {/* 1. Find a Match */}
            <div 
              className="card-heritage" 
              style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '3px solid var(--color-burgundy)' }}
              onClick={() => setActiveTab('discover')}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-burgundy-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Heart size={22} color="var(--color-burgundy)" />
              </div>
              <h3 className="heading-card" style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-burgundy-dark)' }}>
                1. Find a Match
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Discover deeply compatible life partners through multi-layered values and Vedic harmony.
              </p>
            </div>

            {/* 2. Verify a Profile */}
            <div 
              className="card-heritage" 
              style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '3px solid #15803D' }}
              onClick={() => setActiveTab('trust')}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} color="#15803D" />
              </div>
              <h3 className="heading-card" style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#15803D' }}>
                2. Verify a Profile
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Verify identity, education, and credentials with consent via ChaanBean Trust Vault.
              </p>
            </div>

            {/* 3. Prepare for Marriage */}
            <div 
              className="card-heritage" 
              style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '3px solid var(--color-gold-dark)' }}
              onClick={() => setActiveTab('discover')}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={22} color="var(--color-gold-dark)" />
              </div>
              <h3 className="heading-card" style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-gold-dark)' }}>
                3. Prepare for Marriage
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                12 modern dimensions, 36 Guna analysis, and paced "Talk Before You Marry" discussions.
              </p>
            </div>

            {/* 4. Live a Better Marriage */}
            <div 
              className="card-heritage" 
              style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '3px solid #8E2036' }}
              onClick={() => setActiveTab('roadmap')}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Flower2 size={22} color="#8E2036" />
              </div>
              <h3 className="heading-card" style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#8E2036' }}>
                4. Live Better
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Nurture your union with Pratha spiritual rituals, First 100 Days guide, and couple wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 8-Stage Life Journey Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              The Philosophy
            </span>
            <h2 className="heading-section" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              From First Discovery to Lifelong Union
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Conventional matchmaking stops when the wedding occurs. MangalSutra guides you across the entire continuum of companionship.
            </p>
          </div>

          {/* Journey Steps Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Discover', desc: 'AI-assisted, values-first discovery across authentic community and lifestyle filters.' },
              { num: '02', title: 'Understand', desc: 'Deep 5-layer profile: Who I Am, My Life, My Family, My Expectations, Trust Profile.' },
              { num: '03', title: 'Verify', desc: 'Cryptographic credential verification via ChaanBean with zero raw document exposure.' },
              { num: '04', title: 'Assess', desc: 'Deterministic 36 Guna, Gotra analysis, and 12 modern relationship compatibility dimensions.' },
              { num: '05', title: 'Connect', desc: 'Mutual connection activation, private messaging, and consent-based photo unlocking.' },
              { num: '06', title: 'Prepare', desc: 'Paced Talk Before You Marry prompts covering money, parents, kids, and career.' },
              { num: '07', title: 'Marry', desc: 'Dignified celebration, transparent wedding services, and sacred traditional harmony.' },
              { num: '08', title: 'Nurture', desc: 'Pratha spiritual routines, First 100 Days post-marriage guidance, and annual health checks.' },
            ].map((step) => (
              <div 
                key={step.num}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  position: 'relative'
                }}
              >
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold)', lineHeight: 1, marginBottom: '0.75rem' }}>
                  {step.num}
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connected Platforms Breakdown */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: 'var(--border-delicate)', borderBottom: 'var(--border-delicate)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              The Four Connected Pillars
            </span>
            <h2 className="heading-section" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              An Integrated Ecosystem for Life
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              MangalSutra provides an uncompromised ecosystem where trust, compatibility, and spirituality operate harmoniously.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {/* MangalSutra */}
            <div className="card-heritage" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={20} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy-dark)' }}>MangalSutra</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 700 }}>CORE MATCHMAKING</span>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Values-based matrimonial discovery, 5-layer profile structure, deterministic 36 Guna Ashta Kuta matching, and Second Chapter remarriage paths.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} />
                <span>Phase 1 Core Active</span>
              </div>
            </div>

            {/* ChaanBean */}
            <div className="card-heritage" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#15803D' }}>ChaanBean</h3>
                  <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>TRUST & VERIFICATION ENGINE</span>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Independent trust engine. Verifies mobile, email, government ID, education degrees, and marital status declarations without exposing documents.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} />
                <span>Phase 1 Foundation Live / Phase 2 Deep</span>
              </div>
            </div>

            {/* Pratha */}
            <div className="card-heritage" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flower2 size={20} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#92400E' }}>Pratha</h3>
                  <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>SPIRITUALITY & WELLBEING</span>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Optional spiritual layer. Temple rituals, daily meditation, pooja bookings, festival calendar, and 21-day couple spiritual journeys.
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                • Phase 5 Backlog Item
              </div>
            </div>

            {/* Marketplace */}
            <div className="card-heritage" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#4A0E17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={20} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy-dark)' }}>Marketplace</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 700 }}>WEDDINGS & COMMERCE</span>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Carefully curated wedding vendors, jewellery, sustainable bridal wear, couple wellness retreats, and home rituals.
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                • Phase 6 Backlog Item
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Trust & Privacy Explainer */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FAF6F0 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-gold)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Lock size={26} color="var(--color-burgundy)" />
              <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)' }}>
                Our Privacy & Verification Pledge
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  🔒 No Raw Document Exposure
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Your Aadhaar, passport, degrees, or pay slips are processed inside the encrypted ChaanBean Trust Vault. Other members only see a verified badge and check date.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  ⚖️ Clear Status Integrity
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  We explicitly distinguish between <em>Verified</em>, <em>Pending</em>, and <em>User Supplied</em>. A pending check is never an indication of wrongdoing.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  🌿 Dignified Second Chapter
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Divorced, widowed, and single parents have a supportive, stigma-free environment with sensitive controls over custody disclosures.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  💎 Transparent Commercial Model
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Paying for a membership never buys a verified badge or alters compatibility algorithms. Trust cannot be purchased.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: 'var(--border-light)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Interested in our proposed membership tiers and entitlements?
              </div>
              <button className="btn-secondary" onClick={() => setIsPricingModalOpen(true)}>
                <span>View Proposed Commercial Tiers</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Modal */}
      <Modal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        title="Proposed Commercial Tiers & Entitlements"
        maxWidth="750px"
      >
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#92400E', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
            <strong>Transparent Transparency Notice (Module S)</strong>: These tiers and entitlements are proposed product designs under evaluation. Payment is never required to verify basic identity, nor does subscription status ever imply safety, compatibility, or guaranteed marriage.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: '#FAF7F2' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-burgundy-dark)' }}>Free Tier</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Essential Matchmaking</p>
              <ul style={{ fontSize: '0.8rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Basic profile creation</li>
                <li>✓ Standard discovery & filters</li>
                <li>✓ Core 36 Guna preview</li>
                <li>✓ Express interest</li>
              </ul>
            </div>

            <div style={{ border: '2px solid var(--color-burgundy)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: '#FFFFFF', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '12px', background: 'var(--color-burgundy)', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>POPULAR</span>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-burgundy-dark)' }}>Verified Tier</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>ChaanBean Trust Hub</p>
              <ul style={{ fontSize: '0.8rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Everything in Free</li>
                <li>✓ ChaanBean ID & Age badge</li>
                <li>✓ Education authentication</li>
                <li>✓ Mutual connection chat</li>
                <li>✓ Astra AI discussion guide</li>
              </ul>
            </div>

            <div style={{ border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: '#FAF7F2' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-burgundy-dark)' }}>Couple Tier</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Pre & Post Marriage</p>
              <ul style={{ fontSize: '0.8rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Everything in Verified</li>
                <li>✓ Talk Before You Marry prompts</li>
                <li>✓ Couple Conversation Mode</li>
                <li>✓ First 100 Days guide</li>
                <li>✓ Pratha couple spiritual sessions</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn-primary" onClick={() => setIsPricingModalOpen(false)}>
            Close Overview
          </button>
        </div>
      </Modal>
    </div>
  );
};
