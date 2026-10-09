// Module T & Complete Feature Coverage: Modules A-T & Phases 1-6 Ecosystem Roadmap

import React, { useState } from 'react';
import { ROADMAP_MODULES, FeaturePhase, FeatureStatus } from '../../types/roadmap';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Layers, 
  Info 
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedLetter, setExpandedLetter] = useState<string | null>('A');

  const phases: FeaturePhase[] = [
    'Phase 1: Web Launch',
    'Phase 2: ChaanBean Trust',
    'Phase 3: Marriage Intelligence',
    'Phase 4: Second Chapter',
    'Phase 5: Pratha Spirituality',
    'Phase 6: Marketplace',
  ];

  const filteredModules = ROADMAP_MODULES.filter((m) => {
    if (selectedPhase !== 'all' && m.phase !== selectedPhase) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: FeatureStatus) => {
    switch (status) {
      case 'implemented_and_tested':
        return (
          <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <CheckCircle2 size={12} />
            <span>Implemented & Tested</span>
          </span>
        );
      case 'partial':
        return (
          <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} />
            <span>Partial (Phase 1 Slice)</span>
          </span>
        );
      case 'mocked_simulated':
        return (
          <span style={{ background: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={12} />
            <span>Simulated / Sandbox</span>
          </span>
        );
      case 'blocked_external':
        return (
          <span style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Lock size={12} />
            <span>Blocked by External API</span>
          </span>
        );
      case 'planned':
      default:
        return (
          <span style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} />
            <span>Planned Backlog</span>
          </span>
        );
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1040px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-dark)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
          <Map size={16} />
          <span>Ecosystem Roadmap & Feature Coverage Crosswalk</span>
        </div>
        <h1 className="heading-section" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Preserving All Requirements (Modules A–T)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '780px', lineHeight: 1.6 }}>
          This index serves as our architectural traceability contract. We implement Phase 1 as a polished, complete vertical slice while preserving every subsequent module in the backlog across all six phases.
        </p>
      </div>

      {/* Six Phases Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {phases.map((phase, idx) => {
          const isPhase1 = idx === 0;
          return (
            <div
              key={phase}
              onClick={() => setSelectedPhase(selectedPhase === phase ? 'all' : phase)}
              style={{
                background: isPhase1 ? 'var(--color-burgundy-subtle)' : 'var(--bg-surface)',
                border: isPhase1 ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 0.85rem',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isPhase1 ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isPhase1 ? 'var(--color-burgundy)' : 'var(--color-gold-dark)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Stage 0{idx + 1}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                {phase.split(':')[1]?.trim() || phase}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: isPhase1 ? '#15803D' : 'var(--text-muted)' }}>
                {isPhase1 ? '● Active in Phase 1' : '○ Planned Backlog'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'var(--border-delicate)', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Filter size={15} />
          <span>Filter by Phase:</span>
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', width: 'auto' }}
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="all">All Six Phases (20 Modules)</option>
            {phases.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <span>Status:</span>
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', width: 'auto' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="implemented_and_tested">Implemented & Tested</option>
            <option value="partial">Partial</option>
            <option value="planned">Planned Backlog</option>
            <option value="blocked_external">Blocked External</option>
          </select>
        </div>
      </div>

      {/* Modules List Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredModules.map((mod) => {
          const isExpanded = expandedLetter === mod.letter;

          return (
            <div
              key={mod.letter}
              className="card-heritage"
              style={{ overflow: 'hidden' }}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedLetter(isExpanded ? null : mod.letter)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-secondary)' : '#FFFFFF',
                  borderBottom: isExpanded ? 'var(--border-light)' : 'none',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-burgundy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                    {mod.letter}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                        Module {mod.letter}: {mod.title}
                      </h3>
                      {getStatusBadge(mod.status)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {mod.phase} • Ref: {mod.phasePromptRef}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-dark)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isExpanded ? 'Hide Specs' : 'View Specs'}</span>
                  <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms ease' }} />
                </div>
              </div>

              {/* Expanded Specs Body */}
              {isExpanded && (
                <div style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {mod.summary}
                  </p>

                  <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.25)', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-burgundy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Info size={14} />
                      <span>Acceptance Criteria & Traceability</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {mod.acceptanceCriteria}
                    </div>
                  </div>

                  {/* Feature Breakdown Table */}
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                    Feature Checklist for Module {mod.letter}:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mod.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          background: 'var(--bg-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          gap: '1rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--color-burgundy-dark)' }}>{feat.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{feat.note}</div>
                        </div>
                        {getStatusBadge(feat.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
