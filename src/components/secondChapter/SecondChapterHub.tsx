// Phase 4: Second Chapter Remarriage Ecosystem Hub (Module M)
// Dedicated, dignified experience for Divorced, Widowed, Separated, Single Parents & Remarriage Seekers.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  INITIAL_USER_SECOND_CHAPTER, 
  SECOND_CHAPTER_RESOURCES, 
  ADDITIONAL_SECOND_CHAPTER_PROFILES 
} from '../../services/secondChapterService';
import { 
  SecondChapterProfileDetails, 
  RebuildPriority, 
  EcosystemPillar 
} from '../../types/secondChapter';
import { UserProfile } from '../../types';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Lock, 
  Eye, 
  CheckCircle2, 
  Compass, 
  Users, 
  Calendar, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  MessageCircle, 
  AlertCircle,
  Plus,
  Trash2,
  Bookmark
} from 'lucide-react';
import { MatchCard } from '../discover/MatchCard';
import { ProfileDetailModal } from '../discover/ProfileDetailModal';

export const SecondChapterHub: React.FC = () => {
  const { 
    currentUser, 
    discoveryProfiles, 
    activePartnerForDetail, 
    openPartnerDetail, 
    closePartnerDetail, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'discovery' | 'rebuild' | 'children' | 'readiness' | 'ecosystem'>('discovery');
  
  // Non-segregation discovery filter
  const [discoveryScope, setDiscoveryScope] = useState<'second_chapter_only' | 'all_members'>('second_chapter_only');

  // Second Chapter Profile State
  const [scProfile, setScProfile] = useState<SecondChapterProfileDetails>(INITIAL_USER_SECOND_CHAPTER);

  // Ecosystem Filter
  const [selectedPillar, setSelectedPillar] = useState<EcosystemPillar | 'ALL'>('ALL');
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);

  // New Child entry state
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newChildGender, setNewChildGender] = useState<'son' | 'daughter'>('daughter');

  // Combined profiles for discovery
  const allSecondChapterProfiles: UserProfile[] = [
    ...discoveryProfiles.filter((p) => p.maritalStatus !== 'never_married' || p.intent === 'remarriage'),
    ...ADDITIONAL_SECOND_CHAPTER_PROFILES,
  ];

  const displayedProfiles = discoveryScope === 'second_chapter_only'
    ? allSecondChapterProfiles
    : [...allSecondChapterProfiles, ...discoveryProfiles.filter((p) => p.maritalStatus === 'never_married')];

  // Rebuild priorities available
  const availablePriorities: RebuildPriority[] = [
    'Emotional Stability',
    'Mutual Respect & Equality',
    'Financial Transparency',
    'Peaceful & Gentle Home',
    'Healthy Co-Parenting Harmony',
    'Intellectual & Spiritual Connection',
    'Independent Career Space',
    'Shared Laughter & Companionship',
  ];

  const togglePriority = (p: RebuildPriority) => {
    if (scProfile.myPriorities.includes(p)) {
      setScProfile({
        ...scProfile,
        myPriorities: scProfile.myPriorities.filter((item) => item !== p),
      });
    } else {
      setScProfile({
        ...scProfile,
        myPriorities: [...scProfile.myPriorities, p],
      });
    }
  };

  const handleSaveRebuildProfile = () => {
    showToast(
      'Rebuild Profile Updated',
      'Your reflections and relationship priorities have been updated in your profile.',
      'success'
    );
  };

  const handleSaveChildrenSettings = () => {
    showToast(
      'Family & Custody Disclosures Updated',
      `Custody visibility set to: ${scProfile.custodyPrivacy.replace(/_/g, ' ')}.`,
      'success'
    );
  };

  const handleAddChild = () => {
    const newChild = {
      id: `child_${Date.now()}`,
      age: newChildAge,
      gender: newChildGender,
      livingWithParent: 'Full-time' as const,
    };
    setScProfile({
      ...scProfile,
      hasChildren: true,
      childrenCount: scProfile.childrenCount + 1,
      childrenDetails: [...scProfile.childrenDetails, newChild],
    });
    showToast('Child Information Added', 'Stored securely under your protected family layer.', 'info');
  };

  const handleRemoveChild = (id: string) => {
    const updated = scProfile.childrenDetails.filter((c) => c.id !== id);
    setScProfile({
      ...scProfile,
      hasChildren: updated.length > 0,
      childrenCount: updated.length,
      childrenDetails: updated,
    });
  };

  const filteredResources = selectedPillar === 'ALL'
    ? SECOND_CHAPTER_RESOURCES
    : SECOND_CHAPTER_RESOURCES.filter((r) => r.pillar === selectedPillar);

  return (
    <div className="container" style={{ maxWidth: '1060px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C3325 0%, #2D4F38 50%, #40684C 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '740px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A7F3D0', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Second Chapter Remarriage Ecosystem (Module M)</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            A Second Chapter Deserves a Different Journey.
          </h1>
          <p style={{ color: '#ECFDF5', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Dignified, stigma-free matchmaking for divorced, widowed, separated, and single parents. 
            Celebrate what you have learned, define what you want now, and rebuild your life with clarity, 
            peace, and high self-worth.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} color="#A7F3D0" />
              <span>No Stigma • Zero Segregation</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Lock size={14} color="#A7F3D0" />
              <span>Protected Custody & Children Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'discovery', label: 'Second Chapter Matches', icon: Compass },
          { id: 'rebuild', label: 'My Rebuild Profile', icon: FileText },
          { id: 'children', label: 'Children & Family Sanctuary', icon: Users },
          { id: 'readiness', label: 'Emotional Readiness', icon: Heart },
          { id: 'ecosystem', label: 'Rebuilding & Recovery (7 Pillars)', icon: Sparkles },
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
                color: isActive ? '#15803D' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid #15803D' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? '#15803D' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SECOND CHAPTER DISCOVERY POOL */}
      {activeTab === 'discovery' && (
        <div>
          {/* Scope Toggle (Non-Segregation Rule) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Discovery Pool:</strong> Showing {displayedProfiles.length} verified members
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setDiscoveryScope('second_chapter_only')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: discoveryScope === 'second_chapter_only' ? '#15803D' : '#FFFFFF',
                  color: discoveryScope === 'second_chapter_only' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid rgba(21, 128, 61, 0.4)',
                }}
              >
                🌿 Second Chapter Only ({allSecondChapterProfiles.length})
              </button>
              <button
                onClick={() => setDiscoveryScope('all_members')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: discoveryScope === 'all_members' ? 'var(--color-burgundy)' : '#FFFFFF',
                  color: discoveryScope === 'all_members' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid rgba(107, 23, 40, 0.4)',
                }}
              >
                🌐 All Eligible Members ({discoveryProfiles.length + ADDITIONAL_SECOND_CHAPTER_PROFILES.length})
              </button>
            </div>
          </div>

          {/* Profiles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {displayedProfiles.map((partner) => (
              <div key={partner.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <MatchCard partner={partner} />
                
                {/* Second Chapter Highlights snippet */}
                {partner.secondChapterLearnings && (
                  <div style={{ marginTop: '-0.5rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
                    <strong>🌱 What I Learned:</strong> "{partner.secondChapterLearnings.slice(0, 110)}..."
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY REBUILD PROFILE (MODULE M CORE) */}
      {activeTab === 'rebuild' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
              Self-Definition & Evolution
            </span>
            <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              My Rebuild Profile Dimensions
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.35rem' }}>
              Unlike first marriages where people often match on generic credentials, a second marriage succeeds on emotional clarity. 
              Articulate what you have learned and what you seek with open honesty.
            </p>
          </div>

          {/* 1. What I Learned */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
              1. What I Learned From My Past Journey
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Share constructive reflections without bitterness toward your previous partner. Focus on your growth.
            </p>
            <textarea
              className="form-textarea"
              rows={3}
              value={scProfile.whatILearned}
              onChange={(e) => setScProfile({ ...scProfile, whatILearned: e.target.value })}
            />
          </div>

          {/* 2. What I Want Now */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
              2. What I Want Now in a Life Partner
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Specific emotional qualities, communication habits, and day-to-day rhythm you value.
            </p>
            <textarea
              className="form-textarea"
              rows={3}
              value={scProfile.whatIWantNow}
              onChange={(e) => setScProfile({ ...scProfile, whatIWantNow: e.target.value })}
            />
          </div>

          {/* 3. What Has Changed */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
              3. How My Priorities & Worldview Have Changed
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              How have your definitions of success, peace, and family evolved?
            </p>
            <textarea
              className="form-textarea"
              rows={3}
              value={scProfile.whatHasChanged}
              onChange={(e) => setScProfile({ ...scProfile, whatHasChanged: e.target.value })}
            />
          </div>

          {/* 4. What I Do Not Want Again */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
              4. Healthy Boundaries & Non-Negotiables (What I Do Not Want Again)
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Healthy relationship boundaries that protect your peace.
            </p>
            <textarea
              className="form-textarea"
              rows={3}
              value={scProfile.whatIDoNotWantAgain}
              onChange={(e) => setScProfile({ ...scProfile, whatIDoNotWantAgain: e.target.value })}
            />
          </div>

          {/* 5. My Top Priorities Today */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.6rem' }}>
              5. My Core Rebuild Priorities Today (Select all that resonate)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availablePriorities.map((priority) => {
                const isSelected = scProfile.myPriorities.includes(priority);
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => togglePriority(priority)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: isSelected ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      border: isSelected ? '1px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'right', borderTop: 'var(--border-light)', paddingTop: '1.5rem' }}>
            <button className="btn-primary" onClick={handleSaveRebuildProfile}>
              <CheckCircle2 size={16} />
              <span>Save & Publish Rebuild Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CHILDREN & FAMILY SANCTUARY */}
      {activeTab === 'children' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803D', fontSize: '0.8rem', fontWeight: 700 }}>
              <Lock size={15} />
              <span>Confidential Family Layer • Child Safeguarding Protected</span>
            </div>
            <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              Children, Custody & Blended Family Harmony
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.35rem' }}>
              Details about minor children are treated with the highest data protection. Control exactly who can view your children’s 
              ages and custody terms.
            </p>
          </div>

          {/* Privacy Level Control */}
          <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              🔒 Child & Custody Information Visibility
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {[
                { value: 'mutual_connections_only', label: 'Mutual Matches Only', desc: 'Unlocked only after both express mutual interest' },
                { value: 'verified_only', label: 'Verified Members Only', desc: 'Visible to ChaanBean ID verified members' },
                { value: 'on_request', label: 'Private Upon Request', desc: 'Requires explicit photo & family grant permission' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setScProfile({ ...scProfile, custodyPrivacy: opt.value as any })}
                  style={{
                    background: scProfile.custodyPrivacy === opt.value ? '#EFF6FF' : '#FFFFFF',
                    border: scProfile.custodyPrivacy === opt.value ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1E3A8A' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Children List */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem' }}>
              Children Information ({scProfile.childrenCount})
            </h4>

            {scProfile.childrenDetails.length === 0 ? (
              <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No minor children registered. If you have children, add them below to configure sensitive custody options.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {scProfile.childrenDetails.map((child) => (
                  <div
                    key={child.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(197, 160, 89, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {child.gender === 'daughter' ? '👧 Daughter' : '👦 Son'}, {child.age} years old
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                        Living status: {child.livingWithParent}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveChild(child.id)}
                      style={{ color: '#B91C1C', padding: '0.3rem', borderRadius: '4px' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Child Form */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Gender:</span>
                <select
                  className="form-input"
                  style={{ width: '130px', padding: '0.35rem 0.65rem' }}
                  value={newChildGender}
                  onChange={(e) => setNewChildGender(e.target.value as any)}
                >
                  <option value="daughter">Daughter</option>
                  <option value="son">Son</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Age:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  className="form-input"
                  style={{ width: '80px', padding: '0.35rem 0.65rem' }}
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(parseInt(e.target.value) || 0)}
                />
              </div>
              <button className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }} onClick={handleAddChild}>
                <Plus size={14} />
                <span>Add Child Entry</span>
              </button>
            </div>
          </div>

          {/* Custody Arrangement & Co-Parenting */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Legal Custody Arrangement</label>
              <select
                className="form-input"
                value={scProfile.custodyArrangement}
                onChange={(e) => setScProfile({ ...scProfile, custodyArrangement: e.target.value as any })}
              >
                <option value="No Children">No Children</option>
                <option value="Sole Physical Custody">Sole Physical Custody</option>
                <option value="Shared Joint 50-50">Shared Joint 50-50</option>
                <option value="Visiting Rights">Visiting Rights Only</option>
                <option value="Adult / Independent">Adult / Independent Children</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Co-Parenting Dynamic with Former Spouse</label>
              <select
                className="form-input"
                value={scProfile.coParentingDynamic}
                onChange={(e) => setScProfile({ ...scProfile, coParentingDynamic: e.target.value as any })}
              >
                <option value="Harmonious & Cooperative">Harmonious & Cooperative</option>
                <option value="Independent parallel parenting">Independent Parallel Parenting</option>
                <option value="Courteous with clear boundaries">Courteous with Clear Boundaries</option>
                <option value="Not applicable">Not Applicable</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'right', borderTop: 'var(--border-light)', paddingTop: '1.5rem' }}>
            <button className="btn-primary" onClick={handleSaveChildrenSettings}>
              <CheckCircle2 size={16} />
              <span>Save Family & Custody Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: EMOTIONAL READINESS SELF-ASSESSMENT */}
      {activeTab === 'readiness' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
              Private Reflection • Non-Diagnostic
            </span>
            <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              Second Chapter Emotional Readiness
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.35rem' }}>
              This private reflection is for your eyes only. It never gives a score, passes judgment, or ranks your readiness. 
              Its purpose is to help you check in with your own heart before investing in a new lifelong commitment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Question 1 */}
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                1. How do you feel when you reflect on your past marriage today?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', marginTop: '0.6rem' }}>
                {[
                  { value: 'Healed & Grounded', label: 'Grounded & At Peace', desc: 'I have processed the grief and look forward with hope' },
                  { value: 'Constructive Progress', label: 'Healthy Progress', desc: 'Mostly peaceful, with occasional memories that I handle gently' },
                  { value: 'Taking Quiet Time', label: 'Taking Quiet Time', desc: 'Still processing certain emotions and taking things slowly' },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setScProfile({ ...scProfile, griefClosureState: opt.value as any })}
                    style={{
                      background: scProfile.griefClosureState === opt.value ? '#FEF3C7' : '#FFFFFF',
                      border: scProfile.griefClosureState === opt.value ? '2px solid #D97706' : '1px solid #E5E7EB',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#92400E' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                2. What is your relationship with your independent emotional life?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', marginTop: '0.6rem' }}>
                {[
                  { value: 'High Sovereignty & Joy', label: 'Full & Content on My Own', desc: 'I am happy living my life and want a partner to share joy, not to fix me' },
                  { value: 'Balanced with desire for partnership', label: 'Seeking Companionship', desc: 'I value companionship and feel ready to open my heart again' },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setScProfile({ ...scProfile, emotionalIndependence: opt.value as any })}
                    style={{
                      background: scProfile.emotionalIndependence === opt.value ? '#FEF3C7' : '#FFFFFF',
                      border: scProfile.emotionalIndependence === opt.value ? '2px solid #D97706' : '1px solid #E5E7EB',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#92400E' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Note */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Your Private Healing Reflection</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={scProfile.readinessReflectionNote}
                onChange={(e) => setScProfile({ ...scProfile, readinessReflectionNote: e.target.value })}
                placeholder="Write a private affirmation to yourself..."
              />
            </div>
          </div>

          {/* Supportive Reflection Output */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.5rem', borderRadius: 'var(--radius-md)', color: '#166534' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={18} color="#15803D" />
              <span>Grounded Growth Perspective</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#14532D' }}>
              You are approaching remarriage with intentionality and deep self-knowledge. Entering a partnership after 
              reflection means you are seeking genuine emotional alignment, mutual respect, and tranquility. 
              Trust your pace.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: REBUILDING & RECOVERY ECOSYSTEM (7 PILLARS) */}
      {activeTab === 'ecosystem' && (
        <div>
          {/* Pillar Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.75rem' }}>
            <button
              onClick={() => setSelectedPillar('ALL')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: selectedPillar === 'ALL' ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                color: selectedPillar === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              All 7 Pillars ({SECOND_CHAPTER_RESOURCES.length})
            </button>
            {[
              { id: 'RESET', label: '🌱 RESET (Wellbeing)' },
              { id: 'UNDERSTAND', label: '🧠 UNDERSTAND (Wisdom)' },
              { id: 'REBUILD', label: '⚖️ REBUILD (Legal/Decree)' },
              { id: 'RESTART', label: '💰 RESTART (Finances)' },
              { id: 'FAMILY', label: '👨‍👩‍👧 FAMILY (Co-Parenting)' },
              { id: 'RECONNECT', label: '❤️ RECONNECT (Dating)' },
              { id: 'HEAL', label: '🧘 HEAL (Pratha)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id as any)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: selectedPillar === p.id ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                  color: selectedPillar === p.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Resources List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredResources.map((res) => {
              const isExpanded = expandedResourceId === res.id;
              return (
                <div
                  key={res.id}
                  className="card-heritage"
                  style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-burgundy)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{res.pillarIcon}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                        {res.pillar} • {res.pillarTitle}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ⏱️ {res.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
                    {res.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {res.summary}
                  </p>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedResourceId(isExpanded ? null : res.id)}
                    style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: isExpanded ? '1rem' : '0' }}
                  >
                    <span>{isExpanded ? 'Hide Detailed Guide & Checklist ▲' : 'Read Key Takeaways & Actionable Checklist ▼'}</span>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: 'var(--border-light)', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 200ms ease-out' }}>
                      
                      {/* Key Takeaways */}
                      <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                          Key Takeaways:
                        </div>
                        <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                          {res.keyTakeaways.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Actionable Checklist */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.4rem' }}>
                          Actionable Checklist:
                        </div>
                        <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, listStyle: 'none' }}>
                          {res.actionableChecklist.map((check, cIdx) => (
                            <li key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                              <CheckCircle2 size={14} color="#15803D" />
                              <span>{check}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Legal / FAQ notes if present */}
                      {res.faqOrLegalNotes && (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#92400E', lineHeight: 1.5 }}>
                          <strong>Legal Clarity Note:</strong>
                          <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem' }}>
                            {res.faqOrLegalNotes.map((f, fIdx) => (
                              <li key={fIdx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Professional Support Reference */}
                      {res.professionalAssistanceNote && (
                        <div style={{ fontSize: '0.78rem', color: '#1E40AF', fontStyle: 'italic' }}>
                          ℹ️ {res.professionalAssistanceNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile Detail Modal if partner clicked */}
      {activePartnerForDetail && (
        <ProfileDetailModal partner={activePartnerForDetail} onClose={closePartnerDetail} />
      )}
    </div>
  );
};
