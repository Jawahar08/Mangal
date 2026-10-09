// Phase 5: Pratha Spirituality & Wellbeing Hub (Module N)
// "The Inner Life of MangalSutra: Your relationship has begun. Now nurture it."

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TODAY_SANKALPA, 
  PRATHA_TEMPLES, 
  POOJA_GUIDES, 
  INITIAL_COUPLE_JOURNEY, 
  UPCOMING_FESTIVALS, 
  MEDITATION_SESSIONS 
} from '../../services/prathaService';
import { 
  SpiritualPath, 
  DailySankalpa, 
  TempleExperience, 
  PoojaGuide, 
  CoupleJourneyDay, 
  FestivalEvent, 
  MeditationSession 
} from '../../types/pratha';
import { 
  Sparkles, 
  Flower2, 
  Heart, 
  Calendar, 
  Compass, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  BookOpen, 
  Sun, 
  Flame, 
  HelpCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export const PrathaHub: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'daily' | 'temples' | 'poojas' | 'journey' | 'festivals'>('daily');
  const [selectedPath, setSelectedPath] = useState<SpiritualPath>('couple');

  // Daily meditation timer
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Selected temple for modal/details
  const [selectedTemple, setSelectedTemple] = useState<TempleExperience | null>(null);

  // Selected pooja guide
  const [selectedPoojaId, setSelectedPoojaId] = useState<string>(POOJA_GUIDES[0].id);

  // Couple journey days state
  const [journeyDays, setJourneyDays] = useState<CoupleJourneyDay[]>(INITIAL_COUPLE_JOURNEY);

  // Handle couple journey toggle
  const handleToggleJourneyDay = (dayNum: number) => {
    const updated = journeyDays.map((d) => {
      if (d.dayNumber === dayNum) {
        const nextStatus = !d.completedByUser;
        showToast(
          nextStatus ? 'Journey Step Affirmed' : 'Journey Step Reset',
          `Day ${dayNum}: ${d.title} updated in your shared journey.`,
          'info'
        );
        return { ...d, completedByUser: nextStatus };
      }
      return d;
    });
    setJourneyDays(updated);
  };

  const activePooja = POOJA_GUIDES.find((p) => p.id === selectedPoojaId) || POOJA_GUIDES[0];

  return (
    <div className="container" style={{ maxWidth: '1060px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #422006 0%, #78350F 50%, #B45309 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FDE68A', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <Flame size={16} color="#FDE68A" />
            <span>Pratha: Spirituality & Inner Wellbeing (Phase 5)</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            The Inner Life of MangalSutra.
          </h1>
          <p style={{ color: '#FEF3C7', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your relationship has begun. Now nurture it. Explore daily contemplations, sacred heritage temple darshans, 
            the profound meaning of Vedic marriage sanskaras, and a 21-day couple wellbeing journey.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Sun size={14} color="#FDE68A" />
              <span>Completely Optional & Personalized</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Heart size={14} color="#FDE68A" />
              <span>Nurtures Pre & Post Marriage Life</span>
            </div>
          </div>
        </div>
      </div>

      {/* Five Spiritual Paths Selector */}
      <div style={{ background: 'var(--bg-surface)', border: 'var(--border-delicate)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Choose Your Preferred Spiritual Journey:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Personalizes recommendations across your Pratha sanctuary
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
          {[
            { id: 'traditional', label: 'Traditional', icon: '🪔', desc: 'Temples, Poojas & Sanskaras' },
            { id: 'wellness', label: 'Wellness', icon: '🌿', desc: 'Meditation, Yoga & Ayurveda' },
            { id: 'modern_spiritual', label: 'Modern Spiritual', icon: '🧘', desc: 'Mindfulness & Gratitude' },
            { id: 'family', label: 'Family', icon: '🏡', desc: 'Festivals & Family Heritage' },
            { id: 'couple', label: 'Couple Journey', icon: '❤️', desc: '21-Day Couple Connection' },
          ].map((path) => {
            const isSelected = selectedPath === path.id;
            return (
              <div
                key={path.id}
                onClick={() => {
                  setSelectedPath(path.id as any);
                  showToast('Spiritual Path Updated', `Personalized for: ${path.label}`, 'info');
                }}
                style={{
                  background: isSelected ? 'var(--color-burgundy-subtle)' : 'var(--bg-primary)',
                  border: isSelected ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{path.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--color-burgundy-dark)' : 'var(--text-primary)' }}>
                  {path.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {path.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'daily', label: 'Daily Sankalpa & Meditation', icon: Sun },
          { id: 'temples', label: 'Heritage Temple Darshan', icon: Compass },
          { id: 'poojas', label: 'Pooja & Sanskara Guides', icon: BookOpen },
          { id: 'journey', label: '21-Day Couple Journey', icon: Heart },
          { id: 'festivals', label: 'Panchang & Festivals', icon: Calendar },
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
                color: isActive ? '#B45309' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid #B45309' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? '#B45309' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DAILY SANKALPA & MEDITATION */}
      {activeTab === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Today's Sankalpa Card */}
          <div
            className="card-heritage"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FEF9EE 100%)',
              border: '1.5px solid var(--color-gold)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🪔 {TODAY_SANKALPA.date} • Daily Vedic Contemplation
              </span>
              <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                {TODAY_SANKALPA.durationMinutes} min reflection
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.6rem' }}>
              {TODAY_SANKALPA.theme}
            </h3>

            <div style={{ fontStyle: 'italic', fontSize: '1rem', color: '#78350F', fontWeight: 600, marginBottom: '0.6rem', background: 'rgba(254, 243, 199, 0.4)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              "{TODAY_SANKALPA.slokaOrAffirmation}"
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <strong>Meaning:</strong> {TODAY_SANKALPA.meaning}
            </p>

            <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.3)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.3rem' }}>
                🌿 Today’s Micro-Practice:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {TODAY_SANKALPA.practicePrompt}
              </p>
            </div>

            {/* Micro Mindfulness 60-Second Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={18} color="#B45309" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Take a 60-Second Breath Pause Right Now:
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: '#B45309' }}>
                  {timerSeconds}s
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => {
                    setIsTimerRunning(!isTimerRunning);
                    if (!isTimerRunning && timerSeconds === 0) setTimerSeconds(60);
                  }}
                >
                  {isTimerRunning ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isTimerRunning ? 'Pause' : 'Begin 60s Breath'}</span>
                </button>
                <button
                  style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(60);
                  }}
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Guided Meditation Sessions */}
          <div>
            <h3 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '1rem' }}>
              Guided Couple & Pre-Marriage Meditation Sessions
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {MEDITATION_SESSIONS.map((med) => (
                <div
                  key={med.id}
                  className="card-heritage"
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                        {med.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ⏱️ {med.durationMinutes} mins
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
                      {med.title}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                      {med.guidanceText}
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Play size={12} color="#B45309" />
                    <span>Atmosphere: {med.audioPromptPreview}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERITAGE TEMPLE DARSHAN */}
      {activeTab === 'temples' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.4rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Sacred Matrimonial Shrines of Bharat
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Historical shrines renowned for blessing harmonious life unions, ethical abundance, and family peace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {PRATHA_TEMPLES.map((temple) => (
              <div
                key={temple.id}
                className="card-heritage"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <img
                  src={temple.imageUrl}
                  alt={temple.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      <MapPin size={13} />
                      <span>{temple.location}, {temple.state}</span>
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                      {temple.name}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Deity: {temple.deity}
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                      {temple.spiritualSignificance}
                    </p>

                    <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#92400E', lineHeight: 1.5, marginBottom: '1rem' }}>
                      <strong>Marital Blessing:</strong> {temple.marriageSignificance}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <div><strong>Recommended Seva:</strong> {temple.recommendedSeva}</div>
                      <div><strong>Dress Code:</strong> {temple.dressCode}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: 'var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600 }}>
                      ✓ Authentic Visitor Guidance
                    </span>
                    <button
                      className="btn-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        showToast(
                          'Darshan Advisory Saved',
                          `Information for ${temple.name} added to your spiritual travel planner.`,
                          'info'
                        );
                      }}
                    >
                      Save Advisory
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POOJA & SANSKARA GUIDES */}
      {activeTab === 'poojas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '1.5rem' }}>
          {/* Left Column: Poojas List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              Vedic Sanskara Guides
            </div>
            {POOJA_GUIDES.map((pg) => {
              const isSelected = pg.id === selectedPoojaId;
              return (
                <div
                  key={pg.id}
                  onClick={() => setSelectedPoojaId(pg.id)}
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
                    {pg.title.split(':')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {pg.category.replace(/_/g, ' ').toUpperCase()} • {pg.duration}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Pooja Details */}
          <div className="card-heritage" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                {activePooja.category.replace(/_/g, ' ')}
              </span>
              <h3 className="heading-card" style={{ fontSize: '1.5rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
                {activePooja.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.55 }}>
                {activePooja.purpose}
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              <strong>Inner Spiritual Meaning:</strong> {activePooja.spiritualMeaning}
            </div>

            {/* Samagri Checklist */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.6rem' }}>
                Required Samagri (Sacred Items) Checklist:
              </h4>
              <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                {activePooja.samagriList.map((item, sIdx) => (
                  <li key={sIdx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Ritual */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.6rem' }}>
                Step-by-Step Practice & Vows:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {activePooja.stepByStepRitual.map((step, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(197, 160, 89, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 21-DAY COUPLE WELLBEING JOURNEY */}
      {activeTab === 'journey' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
              Pratha Sacred Connection
            </span>
            <h2 className="heading-card" style={{ fontSize: '1.6rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              21-Day Couple Wellbeing Journey
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.35rem' }}>
              Take 5 quiet minutes each evening with your connected partner. 
              These micro-rituals build unshakeable spiritual intimacy, emotional gratitude, and gentle speech.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {journeyDays.map((jd) => (
              <div
                key={jd.dayNumber}
                style={{
                  background: jd.completedByUser ? '#F0FDF4' : 'var(--bg-primary)',
                  border: `1px solid ${jd.completedByUser ? '#BBF7D0' : 'rgba(197, 160, 89, 0.25)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-burgundy-dark)' }}>
                      Day {jd.dayNumber}: {jd.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: 'var(--color-gold-subtle)', color: 'var(--color-burgundy-dark)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {jd.theme}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                    <strong>Daily Exercise:</strong> {jd.exercise}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: '#78350F', fontStyle: 'italic', background: 'rgba(254, 243, 199, 0.5)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    💬 <strong>Couple Prompt:</strong> "{jd.sharedQuestion}"
                  </div>
                </div>

                <button
                  className={jd.completedByUser ? 'btn-gold' : 'btn-outline'}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                  onClick={() => handleToggleJourneyDay(jd.dayNumber)}
                >
                  {jd.completedByUser ? '✓ Affirmed by You' : 'Affirm Today’s Ritual'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PANCHANG & FESTIVAL CALENDAR */}
      {activeTab === 'festivals' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.4rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
              Panchang & Auspicious Festival Calendar
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Traditional Hindu lunar calendar (Tithis) with tailored guidance for couples celebrating together.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {UPCOMING_FESTIVALS.map((fest) => (
              <div
                key={fest.id}
                className="card-heritage"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>
                      {fest.date}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {fest.category}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                    {fest.name}
                  </h4>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Tithi: {fest.tithi}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
                    {fest.spiritualSignificance}
                  </p>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
                  <strong>Couple Observance:</strong> {fest.coupleRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
