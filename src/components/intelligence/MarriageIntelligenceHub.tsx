// Phase 3: Marriage Intelligence Hub
// Combines Talk Before You Marry (I), Couple Mode (J), Readiness (H), Risk Signals (K), Ask MS Trust (L), and Journey Milestones (P, Q, R).

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  INITIAL_TALK_TOPICS, 
  INITIAL_RISK_SIGNALS, 
  INITIAL_JOURNEY_MILESTONES, 
  INITIAL_HUNDRED_DAYS_PROMPTS, 
  INITIAL_ANNUAL_CHECK 
} from '../../services/intelligenceService';
import { 
  TalkBeforeMarriageTopic, 
  CoupleSpaceState, 
  JourneyMilestone, 
  HundredDaysPrompt 
} from '../../types/intelligence';
import { 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle, 
  Users, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Send, 
  Bookmark, 
  Smile, 
  Sun 
} from 'lucide-react';

export const MarriageIntelligenceHub: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'talk' | 'couple' | 'signals' | 'helper' | 'journey'>('talk');

  // Talk Before You Marry state
  const [topics, setTopics] = useState<TalkBeforeMarriageTopic[]>(INITIAL_TALK_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(INITIAL_TALK_TOPICS[0].id);

  // Couple Space state
  const [coupleState, setCoupleState] = useState<CoupleSpaceState>({
    partnerId: 'p_radhika_02',
    partnerName: 'Radhika Kulkarni',
    isCoupleModeActive: true,
    userOptIn: true,
    partnerOptIn: true,
    activatedAt: '2026-10-01',
    activeTopic: 'know_each_other',
    sharedNotes: [
      {
        id: 'note_01',
        topic: 'Money & Wealth',
        content: 'We agreed to open a joint household savings account for apartment maintenance, groceries, and our annual holiday fund, while retaining our independent salary accounts.',
        authorId: 'p_radhika_02',
        authorName: 'Radhika',
        timestamp: '2026-10-02 18:30',
      },
      {
        id: 'note_02',
        topic: 'Home & Sanctuary',
        content: 'We both envision a light-filled 3BHK in Bangalore with a dedicated music and reading corner, and a balcony garden for herbs and flowers.',
        authorId: 'usr_arjun_99',
        authorName: 'Arjun',
        timestamp: '2026-10-04 11:15',
      },
    ],
  });
  const [newNoteText, setNewNoteText] = useState('');

  // Journey milestones state
  const [milestones, setMilestones] = useState<JourneyMilestone[]>(INITIAL_JOURNEY_MILESTONES);

  // 100 Days prompts state
  const [hundredDays, setHundredDays] = useState<HundredDaysPrompt[]>(INITIAL_HUNDRED_DAYS_PROMPTS);

  // Ask MS Trust state
  const [helperQuery, setHelperQuery] = useState('');
  const [helperHistory, setHelperHistory] = useState<{ sender: 'user' | 'helper'; text: string; sources?: string[] }[]>([
    {
      sender: 'helper',
      text: `Namaste! I am **Ask MS Trust**, your confidential marriage and relationship guide.

I help you:
1. Frame delicate questions about money, family expectations, or marital history with respect.
2. Identify which documents clarify specific background details.
3. Understand when pre-marital counseling or legal consultations are helpful.

How can I assist your relationship journey today?`,
    },
  ]);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  // Toggle sharing for Talk Before You Marry
  const handleToggleSharing = (topicId: string) => {
    const updated = topics.map((t) => {
      if (t.id === topicId) {
        const nextShared = !t.isSharedWithPartner;
        showToast(
          nextShared ? 'Reflection Shared' : 'Reflection Kept Private',
          nextShared
            ? 'Your reflection is now visible to your connected partner in Couple Mode.'
            : 'Your reflection is now private to you only.',
          'info'
        );
        return {
          ...t,
          isSharedWithPartner: nextShared,
          status: (nextShared ? 'shared' : 'private_draft') as TalkBeforeMarriageTopic['status'],
        };
      }
      return t;
    });
    setTopics(updated);
  };

  const handleUpdateReflection = (text: string) => {
    const updated = topics.map((t) => {
      if (t.id === selectedTopicId) {
        return { ...t, userPrivateReflection: text };
      }
      return t;
    });
    setTopics(updated);
  };

  // Milestone completion
  const handleToggleMilestone = (mId: string) => {
    const updated = milestones.map((m) => {
      if (m.id === mId) {
        const newCompleted = !m.completedByUser;
        const isBoth = newCompleted && m.completedByPartner;
        return {
          ...m,
          completedByUser: newCompleted,
          isMutualCompleted: isBoth,
          completedAt: isBoth ? new Date().toISOString().split('T')[0] : m.completedAt,
        };
      }
      return m;
    });
    setMilestones(updated);
    showToast('Milestone Progress Updated', 'Shared milestones require mutual consent from both partners.', 'info');
  };

  // Add Shared Note in Couple Mode
  const handleAddCoupleNote = () => {
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `note_${Date.now()}`,
      topic: coupleState.activeTopic.replace(/_/g, ' '),
      content: newNoteText,
      authorId: currentUser.id,
      authorName: currentUser.name.split(' ')[0],
      timestamp: 'Just now',
    };
    setCoupleState({
      ...coupleState,
      sharedNotes: [newNote, ...coupleState.sharedNotes],
    });
    setNewNoteText('');
    showToast('Note Shared in Couple Sanctuary', 'Added to your shared relationship agreement.', 'success');
  };

  // Ask MS Trust queries
  const handleSendHelperQuery = (text?: string) => {
    const query = text || helperQuery;
    if (!query.trim()) return;

    const newHist = [...helperHistory, { sender: 'user' as const, text: query }];
    setHelperHistory(newHist);
    setHelperQuery('');

    setTimeout(() => {
      let reply = `Thank you for asking this thoughtful question.`;
      const lower = query.toLowerCase();

      if (lower.includes('money') || lower.includes('finance')) {
        reply = `**Approaching Finances in Marriage**:
• **Best Timing**: Discuss after mutual interest is established and before engagement.
• **Constructive Framing**: "I want us to feel completely relaxed about money. How did your family approach budgets, and how do you envision our day-to-day accounts?"
• **What to Clarify**: Joint expenses vs personal allowances, outstanding student/home loans, support for parents, and 3-year savings goals.`;
      } else if (lower.includes('family') || lower.includes('parents')) {
        reply = `**Family Boundaries & Cultural Duties**:
• **Key Principle**: Mutual respect for parental traditions while safeguarding couple independence.
• **Constructive Framing**: "Both our families are very important to us. How can we make sure we have dedicated couple weekends while staying close to our parents?"
• **Areas of Clarity**: Frequency of visits, festive holidays rotation, elder care planning, and conflict privacy.`;
      } else if (lower.includes('counsel') || lower.includes('therap')) {
        reply = `**Pre-Marital Relationship Counseling**:
• **When Helpful**: When couples align on love and values but find themselves stuck on recurring topics like relocation or communication styles.
• **ChaanBean Guidance**: Pre-marital counseling is a sign of wisdom, not relationship distress. We partner with licensed relationship therapists specializing in modern Indian couples.`;
      } else {
        reply = `**Grounded Advisory on "${query}"**:
• **Separate Facts from Assumptions**: Review verified ChaanBean trust badges to ground your discussions in verified reality.
• **Take an Unhurried Pace**: You do not have to resolve everything in one evening. Use our "Talk Before You Marry" cards to discuss one topic per week.
• **Maintain Privacy**: Private reflections belong to you; share them only when you feel ready and valued.`;
      }

      setHelperHistory([
        ...newHist,
        {
          sender: 'helper',
          text: reply,
          sources: ['ChaanBean Ethical Charter', 'Vedic Relational Wisdom', 'Family Systems Coaching'],
        },
      ]);
    }, 400);
  };

  return (
    <div className="container" style={{ maxWidth: '1040px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4A0E17 0%, #6B1728 50%, #831843 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5C37A', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Marriage Intelligence & Pre-Marital Preparation (Phase 3)</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            Understand. Connect. Prepare Together.
          </h1>
          <p style={{ color: '#F5EFEB', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Marriage is a life journey, not a single ceremony. Explore paced conversations, private reflections, 
            couple conversation mode, and mutual milestones without judgment, credit scores, or arbitrary predictions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Lock size={14} color="#E5C37A" />
              <span>Strict Private vs Shared Segregation</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Heart size={14} color="#E5C37A" />
              <span>Mutual Agreement for Couple Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'talk', label: 'Talk Before You Marry', icon: MessageCircle },
          { id: 'couple', label: 'Couple Sanctuary Mode', icon: Heart },
          { id: 'signals', label: 'Relationship Risk Signals', icon: AlertTriangle },
          { id: 'helper', label: 'Ask MS Trust Helper', icon: HelpCircle },
          { id: 'journey', label: 'Milestones & First 100 Days', icon: Calendar },
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
                color: isActive ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-burgundy)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TALK BEFORE YOU MARRY & READINESS (MODULES H & I) */}
      {activeTab === 'talk' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '1.5rem' }}>
          {/* Left Column: Topics List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              Paced Reflection Topics
            </div>
            {topics.map((t) => {
              const isSelected = t.id === selectedTopicId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  style={{
                    background: isSelected ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                    border: isSelected ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-burgundy-dark)' }}>
                    {t.category}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: t.status === 'shared' ? '#15803D' : 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {t.status === 'shared' ? <Eye size={12} /> : <Lock size={12} />}
                    <span>{t.status === 'shared' ? 'Shared with Partner' : 'Private Draft'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Topic Reflection Studio */}
          <div className="card-heritage" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                  {activeTopic.category}
                </span>
                <h3 className="heading-card" style={{ fontSize: '1.35rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
                  {activeTopic.prompt}
                </h3>
              </div>
              <button
                className={activeTopic.isSharedWithPartner ? 'btn-gold' : 'btn-outline'}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                onClick={() => handleToggleSharing(activeTopic.id)}
              >
                {activeTopic.isSharedWithPartner ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{activeTopic.isSharedWithPartner ? 'Shared with Partner' : 'Keep Private to Me'}</span>
              </button>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              💡 <strong>Contextual Guidance:</strong> {activeTopic.guidance}
            </div>

            {/* User Private Reflection Input */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">
                  Your Personal Reflection
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeTopic.isSharedWithPartner ? '🔓 Shared with partner' : '🔒 Completely private until shared'}
                </span>
              </div>
              <textarea
                className="form-textarea"
                rows={4}
                value={activeTopic.userPrivateReflection}
                onChange={(e) => handleUpdateReflection(e.target.value)}
                placeholder="Take a quiet moment to write your honest perspective..."
              />
            </div>

            {/* Partner Reflection (Revealed Only When Both Share) */}
            {activeTopic.isSharedWithPartner && activeTopic.partnerSharedReflection ? (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#166534' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Heart size={16} color="#15803D" />
                  <span>Partner’s Shared Reflection (Radhika)</span>
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.55, fontStyle: 'italic', color: '#14532D' }}>
                  "{activeTopic.partnerSharedReflection}"
                </p>
              </div>
            ) : activeTopic.isSharedWithPartner ? (
              <div style={{ background: 'var(--bg-primary)', border: '1px dashed var(--color-gold)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                You have shared your reflection. Partner response will appear here once they also choose to share their answers.
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: COUPLE CONVERSATION MODE (MODULE J) */}
      {activeTab === 'couple' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803D', fontSize: '0.8rem', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>Mutual Opt-In Active • Sacred Couple Sanctuary</span>
              </div>
              <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
                Shared Space with {coupleState.partnerName}
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', background: 'var(--color-gold-subtle)', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', color: 'var(--color-burgundy-dark)' }}>
              Connected since {coupleState.activatedAt}
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            This private shared room is unlocked only after explicit consent from both individuals. 
            Use it to build shared relationship milestones, write couple notes, and prepare for your joint life together.
          </p>

          {/* Couple Topics Navigation */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              { id: 'know_each_other', label: 'Know Each Other' },
              { id: 'money', label: 'Money & Wealth' },
              { id: 'family', label: 'Family & Boundaries' },
              { id: 'home', label: 'Home & Sanctuary' },
              { id: 'children', label: 'Children & Parenting' },
              { id: 'spirituality', label: 'Spirituality & Pratha' },
              { id: 'intimacy', label: 'Intimacy & Quality Time' },
              { id: 'future', label: 'Future Horizons' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setCoupleState({ ...coupleState, activeTopic: st.id as any })}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: coupleState.activeTopic === st.id ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                  color: coupleState.activeTopic === st.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* New Shared Note Input */}
          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.3)', marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Add a Joint Agreement or Vision for: {coupleState.activeTopic.replace(/_/g, ' ').toUpperCase()}
            </h4>
            <textarea
              className="form-textarea"
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. We agreed that every second Saturday will be dedicated couple time without work..."
              style={{ marginBottom: '0.75rem' }}
            />
            <div style={{ textAlign: 'right' }}>
              <button className="btn-primary" onClick={handleAddCoupleNote} disabled={!newNoteText.trim()}>
                <Heart size={14} />
                <span>Save to Shared Notes</span>
              </button>
            </div>
          </div>

          {/* Shared Notes Feed */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem' }}>
            Shared Agreement Ledger ({coupleState.sharedNotes.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {coupleState.sharedNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                    {note.topic}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Penned by {note.authorName} • {note.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                  "{note.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RELATIONSHIP RISK SIGNALS (MODULE K) */}
      {activeTab === 'signals' && (
        <div>
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', color: '#92400E', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            <strong>Objective Discussion Principle (Module K)</strong>: We never label any individual "dangerous", "unfit", or "guilty". Differences in lifestyle or financial expectations are normal. Signals highlight topics that merit thoughtful conversation before formal commitment.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {INITIAL_RISK_SIGNALS.map((sig) => (
              <div
                key={sig.id}
                className="card-heritage"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                    {sig.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: sig.level.includes('Amber') ? '#FEF3C7' : '#DCFCE7', color: sig.level.includes('Amber') ? '#B45309' : '#15803D' }}>
                    {sig.level}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  {sig.observation}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong>Source Provenance:</strong> {sig.evidenceSource}
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.25)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem' }}>
                    Thoughtful Questions to Discuss:
                  </div>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                    {sig.questionsToAsk.map((q, qIdx) => (
                      <li key={qIdx}>{q}</li>
                    ))}
                  </ul>
                  {sig.professionalSupportNote && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#1E40AF', fontStyle: 'italic' }}>
                      ℹ️ {sig.professionalSupportNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ASK MS TRUST (MODULE L) */}
      {activeTab === 'helper' && (
        <div className="card-heritage" style={{ padding: '2rem', height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem', borderBottom: 'var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)' }}>
              Ask MS Trust: Confidential Relationship Helper
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Get controlled, objective advice on sensitive relationship queries, missing documents, and professional assistance.
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
            {helperHistory.map((h, hIdx) => (
              <div
                key={hIdx}
                style={{
                  alignSelf: h.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: h.sender === 'user' ? 'var(--color-burgundy)' : 'var(--bg-primary)',
                  color: h.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: h.sender === 'user' ? 'none' : '1px solid rgba(197, 160, 89, 0.3)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {h.text}
                {h.sources && (
                  <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Referenced: {h.sources.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: 'var(--border-light)' }}>
            <input
              className="form-input"
              value={helperQuery}
              onChange={(e) => setHelperQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendHelperQuery();
              }}
              placeholder="Ask how to frame questions on money, family duties, or counseling..."
            />
            <button className="btn-primary" onClick={() => handleSendHelperQuery()} disabled={!helperQuery.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: MILESTONES & FIRST 100 DAYS (MODULES P, Q, R) */}
      {activeTab === 'journey' && (
        <div>
          {/* Mutual Milestones */}
          <div className="card-heritage" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Mutual Marriage Journey Milestones (Module P)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Milestones are cooperative reflections, never a competition. A milestone marks complete only when both partners affirm it.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {milestones.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: m.isMutualCompleted ? '#F0FDF4' : 'var(--bg-primary)',
                    border: `1px solid ${m.isMutualCompleted ? '#BBF7D0' : 'rgba(197, 160, 89, 0.25)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-burgundy-dark)' }}>
                        {m.order}. {m.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                        {m.stage}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {m.description}
                    </p>
                    {m.completedAt && (
                      <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600, marginTop: '0.2rem' }}>
                        ✓ Mutual completion achieved: {m.completedAt}
                      </div>
                    )}
                  </div>

                  <button
                    className={m.completedByUser ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                    onClick={() => handleToggleMilestone(m.id)}
                  >
                    {m.completedByUser ? 'Affirmed by You' : 'Affirm Milestone'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* First 100 Days Post-Marriage Program */}
          <div className="card-heritage" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              First 100 Days Post-Marriage Guide (Module Q)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Structured, low-pressure guide for navigating the first 100 days of marital co-living.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {hundredDays.map((hd) => (
                <div key={hd.id} style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>{hd.dayRange} • {hd.theme}</span>
                    <span style={{ fontSize: '0.72rem', color: hd.isShared ? '#15803D' : 'var(--text-muted)' }}>
                      {hd.isShared ? 'Shared with Spouse' : 'Private to You'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
                    {hd.question}
                  </h4>
                  {hd.userResponse ? (
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      "{hd.userResponse}"
                    </p>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending reflection</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Annual Health Check */}
          <div className="card-heritage" style={{ padding: '2rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Annual Marriage Health Check (Module R)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Yearly check-in to celebrate milestones and gently address communication rhythms before misunderstandings grow.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
              <div><strong>Communication Harmony:</strong> {INITIAL_ANNUAL_CHECK.communicationHarmony}</div>
              <div><strong>Financial Alignment:</strong> {INITIAL_ANNUAL_CHECK.financialStressLevel}</div>
              <div><strong>Emotional Closeness:</strong> {INITIAL_ANNUAL_CHECK.emotionalCloseness}</div>
              <div><strong>Spiritual Practice:</strong> {INITIAL_ANNUAL_CHECK.spiritualConnection}</div>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: 'var(--border-light)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Joint Horizons:</strong> "{INITIAL_ANNUAL_CHECK.jointGoals}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
