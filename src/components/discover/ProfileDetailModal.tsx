// Module D & E: Comprehensive Profile & Compatibility Modal

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { computeComprehensiveCompatibility } from '../../services/compatibilityEngine';
import { getAstraResponse, generateAstraInitialSummary } from '../../services/astraAI';
import { 
  Heart, 
  Bookmark, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  User, 
  Briefcase, 
  Users, 
  Compass, 
  Layers 
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ProfileDetailModalProps {
  partner: UserProfile | null;
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ partner, onClose }) => {
  const { 
    currentUser, 
    savedProfileIds, 
    toggleSaveProfile, 
    interestsSent, 
    mutualConnections, 
    sendInterest, 
    startChatWith 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'layers' | 'astrology' | 'modern' | 'astra'>('layers');
  const [activeLayer, setActiveLayer] = useState<'who_i_am' | 'my_life' | 'my_family' | 'my_expectations' | 'my_trust'>('who_i_am');

  // Astra AI State
  const [userQuestion, setUserQuestion] = useState('');
  const [astraChatHistory, setAstraChatHistory] = useState<{ sender: 'user' | 'astra'; text: string; questions?: string[] }[]>([]);

  if (!partner) return null;

  const isSaved = savedProfileIds.includes(partner.id);
  const isInterestSent = interestsSent.includes(partner.id);
  const isMutual = mutualConnections.includes(partner.id);

  const scores = computeComprehensiveCompatibility(currentUser, partner);

  // Initialize Astra greeting if empty
  const handleOpenAstraTab = () => {
    setActiveTab('astra');
    if (astraChatHistory.length === 0) {
      setAstraChatHistory([
        {
          sender: 'astra',
          text: generateAstraInitialSummary(currentUser, partner, scores),
          questions: [
            'What questions should we ask about finances?',
            'Explain our 36 Guna score in detail',
            'How should we approach family boundaries?'
          ],
        },
      ]);
    }
  };

  const handleSendAstraQuery = (queryText?: string) => {
    const textToSend = queryText || userQuestion;
    if (!textToSend.trim()) return;

    const newHistory = [...astraChatHistory, { sender: 'user' as const, text: textToSend }];
    setAstraChatHistory(newHistory);
    setUserQuestion('');

    setTimeout(() => {
      const astraResult = getAstraResponse(textToSend, currentUser, partner, scores);
      setAstraChatHistory((prev) => [
        ...prev,
        {
          sender: 'astra',
          text: astraResult.response,
          questions: astraResult.suggestedQuestions,
        },
      ]);
    }, 400);
  };

  return (
    <Modal isOpen={!!partner} onClose={onClose} maxWidth="880px">
      {/* Modal Profile Banner Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: 'var(--border-light)' }}>
        <img
          src={partner.photoUrl}
          alt={partner.name}
          style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)' }}>
              {partner.name}
            </h2>
            <StatusBadge status="verified" customLabel="ChaanBean Verified" />
            {partner.intent === 'remarriage' && (
              <span style={{ background: '#831843', color: '#FFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                Second Chapter
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {partner.age} yrs • {partner.height} • {partner.currentCity}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {partner.profession} • {partner.religion} ({partner.community})
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className="btn-outline"
            style={{ padding: '0.5rem 0.85rem' }}
            onClick={() => toggleSaveProfile(partner.id)}
            aria-label={isSaved ? 'Remove from saved' : 'Save profile'}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {isMutual ? (
            <button
              className="btn-gold"
              style={{ padding: '0.5rem 1rem' }}
              onClick={() => {
                onClose();
                startChatWith(partner.id);
              }}
            >
              <MessageCircle size={16} />
              <span>Chat Now</span>
            </button>
          ) : isInterestSent ? (
            <button
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', background: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }}
              disabled
            >
              <CheckCircle2 size={16} />
              <span>Interest Sent</span>
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 1.25rem' }}
              onClick={() => sendInterest(partner.id)}
            >
              <Heart size={16} />
              <span>Express Interest</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '2px solid var(--border-light)', marginBottom: '1.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'layers', label: '5 Layers of Profile', icon: Layers },
          { id: 'astrology', label: `36 Guna & Vedic (${scores.gunaScore}/36)`, icon: Sparkles },
          { id: 'modern', label: '12 Modern Dimensions', icon: Compass },
          { id: 'astra', label: 'Astra AI Assistant', icon: MessageCircle, onClick: handleOpenAstraTab },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.onClick) tab.onClick();
                else setActiveTab(tab.id as any);
              }}
              style={{
                padding: '0.65rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: isActive ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-burgundy)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 5 LAYERS OF PROFILE */}
      {activeTab === 'layers' && (
        <div>
          {/* Sub-layers selector */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
            {[
              { id: 'who_i_am', label: '1. Who I Am' },
              { id: 'my_life', label: '2. My Life' },
              { id: 'my_family', label: '3. My Family' },
              { id: 'my_expectations', label: '4. Expectations' },
              { id: 'my_trust', label: '5. Trust Profile' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveLayer(sub.id as any)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: activeLayer === sub.id ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                  color: activeLayer === sub.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {activeLayer === 'who_i_am' && (
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <p style={{ fontSize: '0.92rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                "{partner.bio}"
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div><strong>Height:</strong> {partner.height}</div>
                <div><strong>Mother Tongue:</strong> {partner.motherTongue}</div>
                <div><strong>Religion / Community:</strong> {partner.religion} ({partner.community})</div>
                <div><strong>Marital Status:</strong> {partner.maritalStatus.replace(/_/g, ' ')}</div>
              </div>
            </div>
          )}

          {activeLayer === 'my_life' && (
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div><strong>Education:</strong> {partner.education} ({partner.educationField})</div>
                <div><strong>Profession:</strong> {partner.profession}</div>
                <div><strong>Company / Field:</strong> {partner.companyOrIndustry}</div>
                <div><strong>Dietary Lifestyle:</strong> {partner.diet}</div>
                <div><strong>Drinking / Smoking:</strong> {partner.drinking} / {partner.smoking}</div>
                <div><strong>Fitness:</strong> {partner.fitness}</div>
              </div>
              <div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--color-burgundy)' }}>Interests:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {partner.interests.map((i) => (
                    <span key={i} style={{ background: '#FFF', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeLayer === 'my_family' && (
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div><strong>Family Structure:</strong> {partner.familyType} Family</div>
                <div><strong>Family Values:</strong> {partner.familyValues} Values</div>
                <div><strong>Father's Role:</strong> {partner.fatherOccupation}</div>
                <div><strong>Mother's Role:</strong> {partner.motherOccupation}</div>
                <div><strong>Siblings:</strong> {partner.siblings}</div>
                <div><strong>Ancestral Roots:</strong> {partner.hometown}</div>
              </div>
              {partner.intent === 'remarriage' && partner.secondChapterLearnings && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: 'var(--border-light)', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.25rem' }}>Second Chapter Reflections:</div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{partner.secondChapterLearnings}"</p>
                </div>
              )}
            </div>
          )}

          {activeLayer === 'my_expectations' && (
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div><strong>Preferred Age:</strong> {partner.expectations.partnerAgeMin} to {partner.expectations.partnerAgeMax} yrs</div>
                <div><strong>Children Aspirations:</strong> {partner.expectations.childrenExpectations.replace(/_/g, ' ')}</div>
                <div><strong>Financial Philosophy:</strong> {partner.expectations.financialPhilosophy.replace(/_/g, ' ')}</div>
                <div><strong>Preferred Cities:</strong> {partner.expectations.partnerLocation.join(', ')}</div>
              </div>
            </div>
          )}

          {activeLayer === 'my_trust' && (
            <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
                ChaanBean Trust Checks
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {partner.trustProfile.checks.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description}</div>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VEDIC 36 GUNA REPORT */}
      {activeTab === 'astrology' && (
        <div>
          {/* Top Score Banner */}
          <div style={{ background: 'linear-gradient(135deg, #4A0E17 0%, #6B1728 100%)', color: '#FFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#E5C37A', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Ashta Kuta Vedic Compatibility
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#FFF8E7' }}>
                {scores.gunaScore} out of 36 Gunas
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#F1E9EA', maxWidth: '440px', marginTop: '0.25rem' }}>
                {scores.overallAssessment}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: 'rgba(197, 160, 89, 0.2)', border: '1px solid #D4AF37', borderRadius: 'var(--radius-sm)', padding: '0.5rem 1rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#E5C37A' }}>Traditional Benchmark</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFD700' }}>18+ Auspicious</div>
              </div>
            </div>
          </div>

          {/* Gotra & Manglik Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: scores.gotraStatus === 'compatible' ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${scores.gotraStatus === 'compatible' ? '#BBF7D0' : '#FCD34D'}`, padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: scores.gotraStatus === 'compatible' ? '#166534' : '#92400E', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>Gotra Lineage Analysis</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {scores.gotraNote}
              </p>
            </div>

            <div style={{ background: scores.manglikCompatibility === 'compatible' ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${scores.manglikCompatibility === 'compatible' ? '#BBF7D0' : '#FCD34D'}`, padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: scores.manglikCompatibility === 'compatible' ? '#166534' : '#92400E', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} />
                <span>Manglik Harmony Assessment</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {scores.manglikNote}
              </p>
            </div>
          </div>

          {/* 8 Kutas Breakdown Table */}
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem' }}>
            Deterministic Breakdown of the 8 Kutas (Max 36 Points)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {scores.gunaCategories.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cat.significance}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: cat.score === cat.maxScore ? '#15803D' : 'var(--color-burgundy)' }}>
                  {cat.score} / {cat.maxScore} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 12 MODERN COMPATIBILITY DIMENSIONS */}
      {activeTab === 'modern' && (
        <div>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Authentic Alignment Principle</strong>: We categorize dimensions honestly as <em>Strong</em>, <em>Needs discussion</em>, or <em>Important conversation required</em>. We never invent arbitrary scores or clinical diagnoses.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {scores.modernDimensions.map((dim) => {
              const isStrong = dim.rating === 'Strong';
              const isImportant = dim.rating === 'Important conversation required';

              return (
                <div
                  key={dim.dimension}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(197, 160, 89, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-burgundy-dark)' }}>
                      {dim.dimension}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: isStrong ? '#DCFCE7' : isImportant ? '#FEE2E2' : '#FEF3C7',
                        color: isStrong ? '#15803D' : isImportant ? '#991B1B' : '#B45309',
                      }}
                    >
                      {dim.rating}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', lineHeight: 1.5 }}>
                    <strong>Insight:</strong> {dim.advice}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ASTRA AI ASSISTANT */}
      {activeTab === 'astra' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {astraChatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? 'var(--color-burgundy)' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(197, 160, 89, 0.3)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {msg.sender === 'astra' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-dark)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                    <Sparkles size={14} />
                    <span>Astra Relationship Intelligence</span>
                  </div>
                )}
                {msg.text}

                {/* Suggested prompt chips */}
                {msg.questions && msg.questions.length > 0 && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Suggested Questions:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {msg.questions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendAstraQuery(q)}
                          style={{
                            background: 'var(--color-gold-subtle)',
                            border: '1px solid rgba(197, 160, 89, 0.4)',
                            color: 'var(--color-burgundy-dark)',
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User query input */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendAstraQuery();
              }}
              placeholder="Ask Astra for questions to ask, financial alignment advice..."
            />
            <button className="btn-primary" onClick={() => handleSendAstraQuery()} style={{ padding: '0.75rem 1.25rem' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
