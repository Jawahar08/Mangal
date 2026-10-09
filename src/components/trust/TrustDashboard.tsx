// Module F & Module G: Comprehensive ChaanBean Trust Hub & Verification Engine (Phase 2)
// Evidence-based, consent-led, auditable, with safe non-defamatory court and divorce workflows.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationCheck, VerificationState, BadgeVisibility } from '../../types';
import { StatusBadge } from '../common/Badge';
import { VerificationWizardModal } from './VerificationWizardModal';
import { CourtScreeningModal } from './CourtScreeningModal';
import { MaritalVerificationModal } from './MaritalVerificationModal';
import { ConsentRevocationModal } from './ConsentRevocationModal';
import { DisputeCorrectionModal } from './DisputeCorrectionModal';
import { ALL_VERIFICATION_CHECK_DEFINITIONS } from '../../services/chaanbeanVault';
import { 
  ShieldCheck, 
  Lock, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Scale, 
  HeartHandshake, 
  FileCheck2, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw, 
  History 
} from 'lucide-react';

export const TrustDashboard: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'credentials' | 'marital' | 'court' | 'audit'>('credentials');

  // Modal State
  const [selectedCheckForWizard, setSelectedCheckForWizard] = useState<VerificationCheck | null>(null);
  const [selectedCheckForRevoke, setSelectedCheckForRevoke] = useState<VerificationCheck | null>(null);
  const [selectedCheckForDispute, setSelectedCheckForDispute] = useState<VerificationCheck | null>(null);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isMaritalModalOpen, setIsMaritalModalOpen] = useState(false);

  // Status definitions
  const statusLegend = [
    {
      state: 'verified' as VerificationState,
      label: 'Verified by ChaanBean',
      desc: 'Authenticated by institutional database or cryptographic token. Zero raw data exposed.',
    },
    {
      state: 'pending' as VerificationState,
      label: 'Pending Review',
      desc: 'Document submitted to Trust Vault; verification queue is currently evaluating validity.',
    },
    {
      state: 'further_review_required' as VerificationState,
      label: 'Review Required / Dispute',
      desc: 'Under active re-examination by a Senior Grievance Reviewer.',
    },
    {
      state: 'user_supplied' as VerificationState,
      label: 'User Supplied (Unverified)',
      desc: 'Declared directly by the user without independent external verification.',
    },
    {
      state: 'unavailable' as VerificationState,
      label: 'Verification Unavailable',
      desc: 'Registry unavailable in region or jurisdiction; no negative inference is implied.',
    },
  ];

  // Quick visibility toggle
  const handleToggleVisibility = (checkId: string) => {
    const updatedChecks = currentUser.trustProfile.checks.map((chk) => {
      if (chk.id === checkId) {
        const nextVis: BadgeVisibility = 
          chk.visibility === 'mutual_connections_only'
            ? 'verified_members_only'
            : chk.visibility === 'verified_members_only'
            ? 'public'
            : chk.visibility === 'public'
            ? 'hidden'
            : 'mutual_connections_only';

        showToast('Badge Visibility Updated', `${chk.title} is now visible to: ${nextVis.replace(/_/g, ' ')}`, 'info');
        return { ...chk, visibility: nextVis };
      }
      return chk;
    });

    updateCurrentUser({
      ...currentUser,
      trustProfile: {
        ...currentUser.trustProfile,
        checks: updatedChecks,
      },
    });
  };

  return (
    <div className="container" style={{ maxWidth: '1040px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #14301D 0%, #15803D 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#86EFAC', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <ShieldCheck size={18} />
            <span>ChaanBean Digital Trust Vault (Phase 2 Live)</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            Evidence-Based Trust & Verification
          </h1>
          <p style={{ color: '#DCFCE7', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            ChaanBean establishes digital trust without sacrificing dignity, confidentiality, or privacy. 
            Raw government documents, salary slips, and court judgments remain quarantined in the Trust Vault.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <Lock size={14} color="#86EFAC" />
              <span>Isolated Trust Vault Quarantine</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
              <History size={14} color="#86EFAC" />
              <span>Tamper-Evident Audit Ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Hub Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'credentials', label: `My Credentials (${currentUser.trustProfile.checks.length})`, icon: ShieldCheck },
          { id: 'marital', label: 'Marital & Divorce Audit', icon: HeartHandshake },
          { id: 'court', label: 'Court Screening (eCourts)', icon: Scale },
          { id: 'audit', label: `Audit Trail & Consents (${currentUser.trustProfile.auditLogs.length})`, icon: History },
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

      {/* TAB 1: CREDENTIALS CHECKLIST */}
      {activeTab === 'credentials' && (
        <div>
          {/* Status Integrity Guide Banner */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: 'var(--border-delicate)', marginBottom: '1.75rem' }}>
            <h3 className="heading-card" style={{ fontSize: '1.1rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Status Definitions (No Meaning Conveyed by Color Alone)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {statusLegend.map((item) => (
                <div key={item.state} style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                  <div style={{ marginBottom: '0.3rem' }}>
                    <StatusBadge status={item.state} customLabel={item.label} size="sm" />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentUser.trustProfile.checks.map((chk) => (
              <div
                key={chk.id}
                className="card-heritage"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                }}
              >
                <div style={{ maxWidth: '580px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                      {chk.title}
                    </h4>
                    <StatusBadge status={chk.status} />
                    <button
                      onClick={() => handleToggleVisibility(chk.id)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-secondary)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                      title="Click to change audience visibility"
                    >
                      <Eye size={12} />
                      <span>Visible: {chk.visibility.replace(/_/g, ' ')}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {chk.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {chk.providerName && (
                      <div><strong>Provider:</strong> {chk.providerName}</div>
                    )}
                    {chk.verifiedAt && (
                      <div style={{ color: '#15803D', fontWeight: 600 }}>✓ Verified on: {chk.verifiedAt}</div>
                    )}
                    {chk.sourceNote && (
                      <div style={{ fontStyle: 'italic' }}>Note: {chk.sourceNote}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {chk.status === 'verified' ? (
                    <>
                      <button
                        className="btn-outline"
                        style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}
                        onClick={() => setSelectedCheckForDispute(chk)}
                        title="Request correction or appeal finding"
                      >
                        <RefreshCw size={13} />
                        <span>Appeal</span>
                      </button>
                      <button
                        className="btn-outline"
                        style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem', color: 'var(--color-danger)' }}
                        onClick={() => setSelectedCheckForRevoke(chk)}
                        title="Revoke consent and delete evidence"
                      >
                        <Trash2 size={13} />
                        <span>Revoke</span>
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => setSelectedCheckForWizard(chk)}
                    >
                      <Upload size={14} />
                      <span>{chk.status === 'pending' ? 'Update Evidence' : 'Verify Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MARITAL & DIVORCE VERIFICATION */}
      {activeTab === 'marital' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
                Marital Status & Divorce Verification (Module G)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Dignified, conditional verification workflows for never married, divorced, widowed, and annulled members.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setIsMaritalModalOpen(true)}>
              <HeartHandshake size={16} />
              <span>Configure Marital Verification</span>
            </button>
          </div>

          {currentUser.trustProfile.maritalVerification ? (
            <div style={{ background: 'var(--bg-primary)', border: '1.5px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={20} color="#15803D" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                  {currentUser.trustProfile.maritalVerification.verificationBadge}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div><strong>Declared Status:</strong> {currentUser.trustProfile.maritalVerification.declaredStatus.replace(/_/g, ' ')}</div>
                <div><strong>Affirmation Date:</strong> {currentUser.trustProfile.maritalVerification.declarationDate}</div>
                {currentUser.trustProfile.maritalVerification.courtName && (
                  <div><strong>Court Jurisdiction:</strong> {currentUser.trustProfile.maritalVerification.courtName}</div>
                )}
                {currentUser.trustProfile.maritalVerification.decreeDate && (
                  <div><strong>Decree Date:</strong> {currentUser.trustProfile.maritalVerification.decreeDate}</div>
                )}
              </div>

              {currentUser.trustProfile.maritalVerification.custodyDisclosedPrivately && (
                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: 'var(--border-light)', fontSize: '0.82rem', color: 'var(--color-burgundy-dark)' }}>
                  <strong>🔒 Protected Custody Disclosure (Visible only after mutual consent):</strong>
                  <p style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>
                    "{currentUser.trustProfile.maritalVerification.custodyDisclosedPrivately}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                You have not affirmed your marital status declaration yet.
              </p>
              <button className="btn-secondary" onClick={() => setIsMaritalModalOpen(true)}>
                Begin Marital Verification
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COURT SCREENING */}
      {activeTab === 'court' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
                eCourts Public Litigation Index Screening
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Public civil and criminal court screening with strict non-defamatory safe wording.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setIsCourtModalOpen(true)}>
              <Scale size={16} />
              <span>Query Public Court Index</span>
            </button>
          </div>

          {currentUser.trustProfile.courtScreening ? (
            <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="#15803D" />
                  <span>{currentUser.trustProfile.courtScreening.resultSummary}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Queried on: {currentUser.trustProfile.courtScreening.searchDate}
                </span>
              </div>

              <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#92400E', lineHeight: 1.5, marginBottom: '1rem' }}>
                <strong>Provenance Caveat:</strong> {currentUser.trustProfile.courtScreening.caveatNote}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div><strong>Queried Name:</strong> {currentUser.trustProfile.courtScreening.queryName}</div>
                <div><strong>CNR Searched:</strong> {currentUser.trustProfile.courtScreening.cnrNumber}</div>
                <div><strong>Jurisdiction:</strong> {currentUser.trustProfile.courtScreening.district}, {currentUser.trustProfile.courtScreening.state}</div>
                <div><strong>Matches Identified:</strong> {currentUser.trustProfile.courtScreening.matchingRecordsCount}</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No active court screening record saved. Conduct an eCourts lookup to establish public index transparency.
              </p>
              <button className="btn-secondary" onClick={() => setIsCourtModalOpen(true)}>
                Conduct Court Lookup
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & CONSENT LEDGER */}
      {activeTab === 'audit' && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h2 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
            Tamper-Evident Audit Ledger & Consent Records
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            Every consent grant, document submission, and verification status transition is recorded with timestamped provenance.
          </p>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
            Active Consent Records ({currentUser.trustProfile.consentLedger.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
            {currentUser.trustProfile.consentLedger.map((cst) => (
              <div
                key={cst.id}
                style={{
                  background: 'var(--bg-primary)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>{cst.purpose}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Scope: {cst.scope} • Policy Version: {cst.version} • Granted: {cst.grantedAt}
                  </div>
                </div>
                <div>
                  {cst.isRevoked ? (
                    <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.75rem' }}>Revoked ({cst.revokedAt})</span>
                  ) : (
                    <span style={{ color: '#15803D', fontWeight: 700, fontSize: '0.75rem' }}>Active Consent</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
            Verification Activity Logs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {currentUser.trustProfile.auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: '#FFFFFF',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>{log.checkTitle}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{log.details}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Actor: {log.actor} • Action: {log.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      <VerificationWizardModal
        isOpen={!!selectedCheckForWizard}
        onClose={() => setSelectedCheckForWizard(null)}
        check={selectedCheckForWizard}
      />

      {/* Court Modal */}
      <CourtScreeningModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
      />

      {/* Marital Modal */}
      <MaritalVerificationModal
        isOpen={isMaritalModalOpen}
        onClose={() => setIsMaritalModalOpen(false)}
      />

      {/* Revoke Modal */}
      <ConsentRevocationModal
        isOpen={!!selectedCheckForRevoke}
        onClose={() => setSelectedCheckForRevoke(null)}
        check={selectedCheckForRevoke}
      />

      {/* Dispute Modal */}
      <DisputeCorrectionModal
        isOpen={!!selectedCheckForDispute}
        onClose={() => setSelectedCheckForDispute(null)}
        check={selectedCheckForDispute}
      />
    </div>
  );
};
