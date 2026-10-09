// Module C: 5-Layer Profile Management & Readiness Gauge

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Sparkles, 
  Eye, 
  EyeOff, 
  Calendar 
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [activeLayer, setActiveLayer] = useState<'who_i_am' | 'my_life' | 'my_family' | 'my_expectations' | 'my_trust'>('who_i_am');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Form fields
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editProfession, setEditProfession] = useState(currentUser.profession);
  const [editCurrentCity, setEditCurrentCity] = useState(currentUser.currentCity);
  const [editIncomePrivate, setEditIncomePrivate] = useState(currentUser.incomePrivate);
  const [editPhotosBlurred, setEditPhotosBlurred] = useState(currentUser.photosBlurred);

  // Compute Readiness Score
  const computeReadinessScore = (): { score: number; missing: string[] } => {
    let score = 0;
    const missing: string[] = [];

    if (currentUser.bio && currentUser.bio.length > 20) score += 20;
    else missing.push('Detailed personal bio (min 20 chars)');

    if (currentUser.education && currentUser.profession) score += 20;
    else missing.push('Education and occupation details');

    if (currentUser.familyType && currentUser.fatherOccupation) score += 20;
    else missing.push('Family background and parental details');

    if (currentUser.expectations.partnerProfession.length > 0) score += 20;
    else missing.push('Partner expectations and life preferences');

    if (currentUser.trustProfile.checks.some((c) => c.status === 'verified')) score += 20;
    else missing.push('At least one ChaanBean verified credential');

    return { score, missing };
  };

  const { score: readinessScore, missing: readinessMissing } = computeReadinessScore();

  const handleSaveProfileEdit = () => {
    updateCurrentUser({
      ...currentUser,
      bio: editBio,
      profession: editProfession,
      currentCity: editCurrentCity,
      incomePrivate: editIncomePrivate,
      photosBlurred: editPhotosBlurred,
      updatedAt: new Date().toISOString(),
    });
    setIsEditModalOpen(false);
    showToast('Profile Updated', 'Your profile layers and privacy preferences have been saved.', 'success');
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setIsEditModalOpen(true)}>
              <Edit3 size={16} />
              <span>Edit Profile & Privacy</span>
            </button>
          </div>
        </div>

        {/* Profile Readiness Gauge Bar */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: 'var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
              <Sparkles size={15} color="var(--color-gold)" />
              <span>Profile Readiness Gauge</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
              {readinessScore}% Complete
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${readinessScore}%`,
                background: 'var(--grad-burgundy)',
                transition: 'width 300ms ease',
              }}
            />
          </div>

          {readinessMissing.length > 0 && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              To reach 100%: Complete {readinessMissing.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* 5 Profile Layers Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
        {[
          { id: 'who_i_am', label: '1. Who I Am', icon: User },
          { id: 'my_life', label: '2. My Life', icon: Briefcase },
          { id: 'my_family', label: '3. My Family', icon: Users },
          { id: 'my_expectations', label: '4. My Expectations', icon: Heart },
          { id: 'my_trust', label: '5. My Trust Profile', icon: ShieldCheck },
        ].map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isActive ? 'var(--color-burgundy)' : 'var(--bg-surface)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--color-burgundy)' : 'var(--border-light)',
                transition: 'all 150ms ease',
              }}
            >
              <Icon size={16} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* LAYER 1: Who I Am */}
      {activeLayer === 'who_i_am' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1rem', color: 'var(--color-burgundy-dark)' }}>
            Layer 1: Who I Am
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1.75rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
            "{currentUser.bio}"
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date of Birth / Age</div>
              <div style={{ fontWeight: 600 }}>{currentUser.dateOfBirth} ({currentUser.age} yrs)</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Height</div>
              <div style={{ fontWeight: 600 }}>{currentUser.height}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Religion & Community</div>
              <div style={{ fontWeight: 600 }}>{currentUser.religion} • {currentUser.community}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mother Tongue</div>
              <div style={{ fontWeight: 600 }}>{currentUser.motherTongue}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marital Status</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.maritalStatus.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intent Mode</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.intent.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 2: My Life */}
      {activeLayer === 'my_life' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.25rem', color: 'var(--color-burgundy-dark)' }}>
            Layer 2: My Life, Career & Habits
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Education</div>
              <div style={{ fontWeight: 600 }}>{currentUser.education}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentUser.educationField}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Profession & Role</div>
              <div style={{ fontWeight: 600 }}>{currentUser.profession}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentUser.companyOrIndustry}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Income Disclosure</div>
              <div style={{ fontWeight: 600 }}>
                {currentUser.incomePrivate ? '🔒 Private (Visible to mutual matches only)' : currentUser.incomeBracket}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current City & Hometown</div>
              <div style={{ fontWeight: 600 }}>{currentUser.currentCity}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Native: {currentUser.hometown}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dietary Habits</div>
              <div style={{ fontWeight: 600 }}>{currentUser.diet}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drinking / Smoking</div>
              <div style={{ fontWeight: 600 }}>{currentUser.drinking} / {currentUser.smoking}</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.6rem' }}>
              Personal Interests & Activities
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {currentUser.interests.map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'var(--color-gold-subtle)',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
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

      {/* LAYER 3: My Family */}
      {activeLayer === 'my_family' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.25rem', color: 'var(--color-burgundy-dark)' }}>
            Layer 3: My Family
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Family Structure</div>
              <div style={{ fontWeight: 600 }}>{currentUser.familyType} Family</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Values Orientation</div>
              <div style={{ fontWeight: 600 }}>{currentUser.familyValues} Values</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Father's Occupation</div>
              <div style={{ fontWeight: 600 }}>{currentUser.fatherOccupation}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mother's Occupation</div>
              <div style={{ fontWeight: 600 }}>{currentUser.motherOccupation}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Siblings</div>
              <div style={{ fontWeight: 600 }}>{currentUser.siblings}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Native Lineage / Gotra</div>
              <div style={{ fontWeight: 600 }}>{currentUser.astrology.gotra} Gotra</div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 4: My Expectations */}
      {activeLayer === 'my_expectations' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.25rem', color: 'var(--color-burgundy-dark)' }}>
            Layer 4: My Expectations in a Partner
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age Preference</div>
              <div style={{ fontWeight: 600 }}>{currentUser.expectations.partnerAgeMin} to {currentUser.expectations.partnerAgeMax} years</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Children Aspirations</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.expectations.childrenExpectations.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Financial Approach</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.expectations.financialPhilosophy.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preferred Locations</div>
              <div style={{ fontWeight: 600 }}>{currentUser.expectations.partnerLocation.join(', ')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Relocation Openness</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.expectations.relocationOpenness.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 5: My Trust Profile */}
      {activeLayer === 'my_trust' && (
        <div className="card-heritage" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.25rem' }}>
                Layer 5: ChaanBean Trust Profile
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Audited credentials verified under cryptographic consent protocol.
              </p>
            </div>
            <div style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#15803D', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              Level: {currentUser.trustProfile.trustScoreLevel}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentUser.trustProfile.checks.map((check) => (
              <div
                key={check.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-burgundy-dark)' }}>
                    {check.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {check.description}
                  </div>
                  {check.verifiedAt && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Verified on: {check.verifiedAt}
                    </div>
                  )}
                </div>
                <StatusBadge status={check.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile & Privacy Settings"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Personal Bio</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profession / Role</label>
            <input
              className="form-input"
              value={editProfession}
              onChange={(e) => setEditProfession(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current City</label>
            <input
              className="form-input"
              value={editCurrentCity}
              onChange={(e) => setEditCurrentCity(e.target.value)}
            />
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveProfileEdit}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
