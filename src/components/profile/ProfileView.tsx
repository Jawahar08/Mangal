// Module C: 5-Layer Profile Management & Readiness Gauge

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileService } from '../../services/backend/profileService';
import { 
  User, 
  Briefcase, 
  Users, 
  Heart, 
  ShieldCheck, 
  Edit3, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles, 
  Eye, 
  EyeOff, 
  Calendar,
  LogOut,
  ListChecks,
  ExternalLink 
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MangalsutraTrustProfile } from '../trust/MangalsutraTrustProfile';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    updateCurrentUser, 
    showToast, 
    deleteAccount, 
    logoutUser, 
    setActiveTab,
    openTrustProfileModal 
  } = useApp();

  const [activeLayer, setActiveLayer] = useState<'who_i_am' | 'my_life' | 'my_family' | 'my_expectations' | 'my_trust'>('who_i_am');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Editable Form fields
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editProfession, setEditProfession] = useState(currentUser.profession);
  const [editCurrentCity, setEditCurrentCity] = useState(currentUser.currentCity);
  const [editIncomePrivate, setEditIncomePrivate] = useState(currentUser.incomePrivate);
  const [editPhotosBlurred, setEditPhotosBlurred] = useState(currentUser.photosBlurred);
  const [editMarriageTimeline, setEditMarriageTimeline] = useState(currentUser.expectations.marriageTimeline || 'Ready within 12-18 months');
  const [editCareerPhilosophy, setEditCareerPhilosophy] = useState(currentUser.expectations.careerPhilosophy || 'Ambitious with mutual career encouragement');
  const [editChildrenExpectations, setEditChildrenExpectations] = useState(currentUser.expectations.childrenExpectations);
  const [editFinancialPhilosophy, setEditFinancialPhilosophy] = useState(currentUser.expectations.financialPhilosophy);

  // Page 5 Blueprint Mandate: 20+ Required Fields Readiness Engine (evaluated across 31 discrete criteria)
  const readiness = ProfileService.calculateReadiness(currentUser);

  const handleSaveProfileEdit = () => {
    updateCurrentUser({
      ...currentUser,
      bio: editBio,
      profession: editProfession,
      currentCity: editCurrentCity,
      incomePrivate: editIncomePrivate,
      photosBlurred: editPhotosBlurred,
      expectations: {
        ...currentUser.expectations,
        marriageTimeline: editMarriageTimeline,
        careerPhilosophy: editCareerPhilosophy,
        childrenExpectations: editChildrenExpectations,
        financialPhilosophy: editFinancialPhilosophy,
      },
      updatedAt: new Date().toISOString(),
    });
    setIsEditModalOpen(false);
    showToast('Profile Updated', 'Your profile layers and expectations have been saved.', 'success');
  };

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '1.5rem 1.25rem 4rem' }}>
      {/* Profile Header Hero */}
      <div className="card-heritage" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--color-gold)',
                  boxShadow: 'var(--shadow-md)',
                  filter: currentUser.photosBlurred ? 'blur(4px)' : 'none',
                }}
              />
              {currentUser.photosBlurred && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '50%' }}>
                  <Lock size={18} color="#FFFFFF" />
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 className="heading-card" style={{ fontSize: '1.75rem', color: 'var(--color-burgundy-dark)' }}>
                  {currentUser.name}
                </h1>
                <StatusBadge status="verified" customLabel="ChaanBean Verified" />
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {currentUser.age} yrs • {currentUser.height} • {currentUser.currentCity}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {currentUser.profession} • {currentUser.education}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-outline" 
              onClick={() => openTrustProfileModal(currentUser)}
              style={{ border: '1.5px solid var(--color-gold)', color: 'var(--color-burgundy-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              title="Open Separate Mangalsutra Trust Profile"
            >
              <ShieldCheck size={16} color="var(--color-burgundy)" />
              <span>🛡️ Trust Profile</span>
            </button>
            <button className="btn-secondary" onClick={() => setIsEditModalOpen(true)}>
              <Edit3 size={16} />
              <span>Edit Profile & Privacy</span>
            </button>
            <button 
              className="btn-outline" 
              onClick={logoutUser}
              style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}
              title="Sign out of account"
            >
              <LogOut size={16} color="#DC2626" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Readiness Gauge Bar (Page 5: 20+ required fields engine) */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: 'var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={17} color="var(--color-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                  Profile Readiness Gauge
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Blueprint Mandate: 20+ Required Fields across 5 Restructured Layers ({readiness.completedCount} of {readiness.totalCount} completed)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                padding: '0.2rem 0.65rem', 
                borderRadius: 'var(--radius-full)',
                background: readiness.percentage >= 90 ? '#DCFCE7' : '#FEF3C7',
                color: readiness.percentage >= 90 ? '#15803D' : '#92400E'
              }}>
                {readiness.readinessLevel}
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                {readiness.percentage}%
              </span>
              <button 
                className="btn-outline" 
                onClick={() => setIsAuditModalOpen(true)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ListChecks size={14} />
                <span>Inspect 31 Fields Audit</span>
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: '10px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${readiness.percentage}%`,
                background: 'linear-gradient(90deg, var(--color-burgundy) 0%, var(--color-gold) 100%)',
                transition: 'width 350ms ease',
                borderRadius: '9999px',
              }}
            />
          </div>

          {/* 5-Layer Progress Breakdown Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem' }}>
            {readiness.layers.map((l) => (
              <div 
                key={l.layerId}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: l.percentage === 100 ? '#F0FDF4' : 'var(--bg-secondary)',
                  border: l.percentage === 100 ? '1px solid #BBF7D0' : '1px solid var(--border-light)',
                  color: l.percentage === 100 ? '#166534' : 'var(--text-secondary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>Layer {l.layerLetter}:</span>
                <span style={{ fontWeight: 700 }}>{l.completed}/{l.total}</span>
                {l.percentage === 100 && <CheckCircle2 size={12} color="#166534" />}
              </div>
            ))}
          </div>

          {readiness.missingFields.length > 0 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#B45309', background: '#FFFBEB', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
              <strong>Recommended additions to maximize match compatibility:</strong> {readiness.missingFields.slice(0, 3).join(', ')}
              {readiness.missingFields.length > 3 && ` +${readiness.missingFields.length - 3} more`}
            </div>
          )}
        </div>
      </div>

      {/* 5 Profile Layers Navigation (Page 5 Blueprint Restructuring) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem', marginBottom: '1.75rem' }}>
        {[
          { id: 'who_i_am', letter: 'A', title: 'WHO I AM', subtitle: 'Basic identity', icon: User },
          { id: 'my_life', letter: 'B', title: 'MY LIFE', subtitle: 'Education, profession, lifestyle', icon: Briefcase },
          { id: 'my_family', letter: 'C', title: 'MY FAMILY', subtitle: 'Family structure & background', icon: Users },
          { id: 'my_expectations', letter: 'D', title: 'MY EXPECTATIONS', subtitle: 'Marriage, career, finances', icon: Heart },
          { id: 'my_trust', letter: 'E', title: 'MY TRUST PROFILE', subtitle: 'This is where ChaanBean enters', icon: ShieldCheck },
        ].map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          const layerStats = readiness.layers.find((l) => l.layerId === layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                background: isActive ? 'var(--color-burgundy)' : 'var(--bg-surface)',
                color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                border: isActive ? '1px solid var(--color-burgundy)' : 'var(--border-light)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'all 150ms ease',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: isActive ? 'var(--color-gold)' : 'rgba(197, 160, 89, 0.2)',
                    color: isActive ? '#1F2937' : 'var(--color-burgundy-dark)',
                  }}>
                    {layer.letter}
                  </span>
                  <Icon size={15} color={isActive ? '#FFFFFF' : 'var(--color-burgundy)'} />
                </div>
                {layerStats && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)'
                  }}>
                    {layerStats.completed}/{layerStats.total}
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {layer.title}
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: isActive ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {layer.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* LAYER A: WHO I AM (Basic identity) */}
      {activeLayer === 'who_i_am' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', margin: 0, fontSize: '1.3rem' }}>
                Layer A: WHO I AM
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Basic identity and statutory profile information
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy)', background: 'var(--color-gold-subtle)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Layer A Verified
            </span>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personal Narrative & About Me
            </div>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.7, background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)', fontStyle: 'italic', margin: 0 }}>
              "{currentUser.bio}"
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Statutory Age & Date of Birth</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.dateOfBirth} ({currentUser.age} yrs)</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Height</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.height}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Religion & Community</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.religion} • {currentUser.community}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Mother Tongue</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.motherTongue}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Marital Status</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem', textTransform: 'capitalize' }}>{currentUser.maritalStatus.replace(/_/g, ' ')}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Intent Mode</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem', textTransform: 'capitalize' }}>{currentUser.intent.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER B: MY LIFE (Education, profession, lifestyle, interests) */}
      {activeLayer === 'my_life' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', margin: 0, fontSize: '1.3rem' }}>
                Layer B: MY LIFE
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Education, profession, lifestyle, and personal interests
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy)', background: 'var(--color-gold-subtle)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Layer B Verified
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Highest Education</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.education}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{currentUser.educationField}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Profession & Role</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.profession}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{currentUser.companyOrIndustry}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Income Bracket</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {currentUser.incomePrivate ? '🔒 Private (Mutual connections only)' : currentUser.incomeBracket}
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Current City & Hometown</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.currentCity}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Native: {currentUser.hometown}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dietary Lifestyle</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.diet}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Drinking & Smoking Habits</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.drinking} / {currentUser.smoking}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Fitness Routine</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.fitness || 'Regular workout & active lifestyle'}</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personal Interests & Passions
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {currentUser.interests.map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'var(--color-gold-subtle)',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    color: 'var(--color-burgundy-dark)',
                    fontWeight: 600,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAYER C: MY FAMILY (Family structure, parents, siblings, cultural background) */}
      {activeLayer === 'my_family' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', margin: 0, fontSize: '1.3rem' }}>
                Layer C: MY FAMILY
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Family structure, parents, siblings, and cultural background
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy)', background: 'var(--color-gold-subtle)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Layer C Verified
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Family Structure</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.familyType} Family</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Values Orientation</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.familyValues} Values</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Father's Occupation</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.fatherOccupation}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Mother's Occupation</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.motherOccupation}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Siblings Details</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.siblings}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Native Lineage & Gotra</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.astrology.gotra || 'Not Specified'} Gotra</div>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Vedic Nakshatra & Horoscope</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{currentUser.astrology.nakshatra} ({currentUser.astrology.rashi} Rashi)</div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER D: MY EXPECTATIONS (Marriage expectations, children, location, career, lifestyle, finances etc.) */}
      {activeLayer === 'my_expectations' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', margin: 0, fontSize: '1.3rem' }}>
                Layer D: MY EXPECTATIONS
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Marriage expectations, children, location, career, lifestyle, finances etc.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy)', background: 'var(--color-gold-subtle)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Layer D Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="stat-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-burgundy)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Marriage Timeline & Readiness</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem', color: 'var(--color-burgundy-dark)' }}>
                {currentUser.expectations.marriageTimeline || 'Ready within 12–18 months'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Intent: Looking for a meaningful, long-term marital commitment</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-gold)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Career & Work-Life Orientation</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem', color: 'var(--color-burgundy-dark)' }}>
                {currentUser.expectations.careerPhilosophy || 'Balanced ambition with mutual professional support'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Encourages partner's professional independence and aspirations</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Children Aspirations</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                {currentUser.expectations.childrenExpectations.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Family planning and parenthood alignment</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Financial Philosophy & Planning</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                {currentUser.expectations.financialPhilosophy.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Approaches money management with transparency and shared goals</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Preferred Locations & Relocation</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {currentUser.expectations.partnerLocation.join(', ') || 'Open to major metropolitan hubs'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textTransform: 'capitalize' }}>
                Relocation Openness: {currentUser.expectations.relocationOpenness.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Age & Height Parameters</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {currentUser.expectations.partnerAgeMin} to {currentUser.expectations.partnerAgeMax} years
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Min Height Preference: {currentUser.expectations.partnerHeightMin}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER E: MY TRUST PROFILE (This is where ChaanBean enters) */}
      {activeLayer === 'my_trust' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          {/* Page 5 Blueprint Mandate: This is where ChaanBean enters */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 21, 56, 0.08) 0%, rgba(197, 160, 89, 0.15) 100%)', 
            border: '1.5px solid rgba(197, 160, 89, 0.4)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.5rem', 
            marginBottom: '1.75rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#FFFFFF" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '1px' }}>
                  Layer E • Institutional Trust Framework
                </span>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', fontWeight: 800 }}>
                  This is where ChaanBean enters.
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.5rem 0 1rem' }}>
              MangalSutra solves matrimony fraud and deceptive profiles with our proprietary ChaanBean protocol.
              Every credential — Government identity, degree certificates, employment records, and background checks — is authenticated under cryptographic user consent.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#15803D', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} />
                  <span>Audit Score: {currentUser.trustProfile.trustScoreLevel}</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  ChaanBean ID: #{currentUser.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <button
                className="btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setActiveTab('trust')}
              >
                <ShieldCheck size={15} />
                <span>Go to ChaanBean Trust Hub</span>
              </button>
            </div>
          </div>

          {/* Page 6 Full Separate Mangalsutra Trust Profile */}
          <MangalsutraTrustProfile 
            user={currentUser} 
            isCompact={false} 
            showActions={true} 
          />
        </div>
      )}

      {/* Profile Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile & 5-Layer Preferences"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Layer A: Personal Bio Narrative</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell prospective partners and families about your journey..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Layer B: Profession / Role</label>
              <input
                className="form-input"
                value={editProfession}
                onChange={(e) => setEditProfession(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Layer B: Current City</label>
              <input
                className="form-input"
                value={editCurrentCity}
                onChange={(e) => setEditCurrentCity(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Layer D: Marriage Timeline</label>
              <input
                className="form-input"
                value={editMarriageTimeline}
                onChange={(e) => setEditMarriageTimeline(e.target.value)}
                placeholder="e.g. Ready within 12-18 months"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Layer D: Career Philosophy</label>
              <input
                className="form-input"
                value={editCareerPhilosophy}
                onChange={(e) => setEditCareerPhilosophy(e.target.value)}
                placeholder="e.g. Ambitious, supportive of partner's career"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Layer D: Children Aspirations</label>
              <select
                className="form-select"
                value={editChildrenExpectations}
                onChange={(e) => setEditChildrenExpectations(e.target.value as any)}
              >
                <option value="wants_children">Wants Children</option>
                <option value="open_to_children">Open to Children</option>
                <option value="does_not_want_children">Does Not Want Children</option>
                <option value="has_children_wants_more">Has Children & Wants More</option>
                <option value="has_children_does_not_want_more">Has Children & Does Not Want More</option>
                <option value="undecided">Undecided</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Layer D: Financial Philosophy</label>
              <select
                className="form-select"
                value={editFinancialPhilosophy}
                onChange={(e) => setEditFinancialPhilosophy(e.target.value as any)}
              >
                <option value="joint_finances">Joint Finances & Shared Planning</option>
                <option value="hybrid_approach">Hybrid Approach (Joint + Separate)</option>
                <option value="independent_finances">Independent Finances</option>
                <option value="traditional_breadwinner">Traditional Breadwinner</option>
              </select>
            </div>
          </div>

          {/* Privacy Toggles */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
              Privacy & Visibility Controls
            </h4>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editIncomePrivate}
                onChange={(e) => setEditIncomePrivate(e.target.checked)}
              />
              <span>Keep annual income private (visible only to mutual connections)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editPhotosBlurred}
                onChange={(e) => setEditPhotosBlurred(e.target.checked)}
              />
              <span>Blur photos in public search (Require "Request Photo Access")</span>
            </label>
          </div>

          {/* Account Deletion & Data Privacy */}
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.4rem' }}>
              Account & Data Privacy
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Under our privacy charter, you can permanently delete your account and immediately purge all profile, verification, and chat records from the database.
            </p>
            <button
              type="button"
              className="btn-outline"
              style={{ color: '#DC2626', borderColor: '#FCA5A5', fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
              onClick={async () => {
                if (window.confirm('Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.')) {
                  await deleteAccount();
                }
              }}
            >
              Permanently Delete Account
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveProfileEdit}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* 20+ Required Fields Readiness Audit Modal */}
      <Modal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="Profile Readiness Audit — 20+ Required Fields Engine"
        maxWidth="740px"
      >
        <div>
          <div style={{ marginBottom: '1.25rem', padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                  Readiness Score: {readiness.percentage}%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Completed {readiness.completedCount} out of {readiness.totalCount} discrete fields evaluated across all 5 structured layers.
                </div>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: readiness.percentage >= 90 ? '#DCFCE7' : '#FEF3C7', color: readiness.percentage >= 90 ? '#15803D' : '#92400E' }}>
                {readiness.readinessLevel}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {readiness.layers.map((layer) => (
              <div key={layer.layerId} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-burgundy)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      {layer.layerLetter}
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--color-burgundy-dark)' }}>{layer.layerTitle}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({layer.layerSubtitle})</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: layer.percentage === 100 ? '#15803D' : 'var(--color-burgundy)' }}>
                    {layer.completed}/{layer.total} ({layer.percentage}%)
                  </span>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem' }}>
                  {layer.fields.map((f) => (
                    <div key={f.field} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                      {f.valid ? (
                        <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                      ) : (
                        <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0 }} />
                      )}
                      <span style={{ color: f.valid ? 'var(--text-primary)' : '#92400E', fontWeight: f.valid ? 500 : 600 }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: 'var(--border-light)' }}>
            <button className="btn-primary" onClick={() => setIsAuditModalOpen(false)}>
              Close Audit View
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
