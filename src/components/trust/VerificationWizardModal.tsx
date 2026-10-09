// Module F & Phase 2: 4-Step Verification Wizard Modal
// Purpose Notice -> Informed Consent -> Evidence Submission -> Visibility Settings

import React, { useState } from 'react';
import { VerificationCheck, BadgeVisibility, VerificationState } from '../../types';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  ShieldCheck, 
  Lock, 
  Upload, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';

interface VerificationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  check: VerificationCheck | null;
}

export const VerificationWizardModal: React.FC<VerificationWizardModalProps> = ({ isOpen, onClose, check }) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [consentAffirmed, setConsentAffirmed] = useState(false);
  const [evidenceFileName, setEvidenceFileName] = useState<string | null>(null);
  const [identifierInput, setIdentifierInput] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<BadgeVisibility>('mutual_connections_only');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!check) return null;

  const handleSimulateFilePick = () => {
    setEvidenceFileName(`${check.id}_evidence_encrypted.pdf`);
  };

  const handleCompleteSubmission = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Create consent record
      const newConsent = ChaanBeanService.createConsentRecord(
        check.id,
        `Credential verification for ${check.title}`,
        `${check.documentType || 'Uploaded Evidence'} Hash`
      );

      // Create audit log
      const newAudit = ChaanBeanService.createAuditEntry(
        'document_uploaded',
        check.title,
        `Evidence ${evidenceFileName || identifierInput} submitted to Trust Vault. Visibility set to ${selectedVisibility}.`,
        check.status,
        'pending'
      );

      const updatedChecks = currentUser.trustProfile.checks.map((c) => {
        if (c.id === check.id) {
          return {
            ...c,
            status: 'pending' as VerificationState,
            visibility: selectedVisibility,
            evidenceFileName: evidenceFileName || undefined,
            evidenceHash: `sha256_${Date.now().toString(36)}`,
            sourceNote: `Submitted to ChaanBean Trust Vault. Review in progress.`,
          };
        }
        return c;
      });

      updateCurrentUser({
        ...currentUser,
        trustProfile: {
          ...currentUser.trustProfile,
          checks: updatedChecks,
          consentLedger: [...currentUser.trustProfile.consentLedger, newConsent],
          auditLogs: [newAudit, ...currentUser.trustProfile.auditLogs],
        },
      });

      setIsSubmitting(false);
      onClose();
      showToast(
        'Credential Submitted for Audit',
        `${check.title} is now Pending Review. Quarantined inside the encrypted Trust Vault.`,
        'success'
      );
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Verify: ${check.title}`} maxWidth="680px">
      <div style={{ marginBottom: '1.25rem' }}>
        {/* Wizard Steps Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          {[
            { num: 1, label: '1. Purpose' },
            { num: 2, label: '2. Consent' },
            { num: 3, label: '3. Evidence' },
            { num: 4, label: '4. Visibility' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: step === s.num ? 'var(--color-burgundy-dark)' : step > s.num ? '#15803D' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>{s.label}</span>
              {step > s.num && <CheckCircle2 size={13} color="#15803D" />}
            </div>
          ))}
        </div>

        {/* STEP 1: Purpose & Privacy Notice */}
        {step === 1 && (
          <div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', color: '#1E40AF' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={16} />
                <span>Purpose Limitation & Trust Vault Guarantee</span>
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.75rem', color: '#1E3A8A' }}>
                ChaanBean verifies your credentials without turning you into an open book. 
                Your documents are quarantined in an isolated, encrypted Trust Vault. Matchmaking profiles receive 
                <strong> only the verified status badge and date</strong> — never raw files or government ID numbers.
              </p>
              <div style={{ fontSize: '0.78rem', color: '#1D4ED8', fontStyle: 'italic' }}>
                Authoritative Provider: {check.providerName || 'Certified External Registry'} ({check.providerType})
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <strong>Requested Document</strong>: {check.documentType || 'Official Supporting Credential'}
              <p style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                {check.description}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setStep(2)}>
                <span>Proceed to Consent Notice</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Informed, Revocable Consent */}
        {step === 2 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem' }}>
              Informed Consent Agreement (Policy v2.2)
            </h4>
            <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', maxHeight: '200px', overflowY: 'auto', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                1. <strong>Purpose</strong>: You authorize ChaanBean to verify {check.title} solely for the purpose of confirming matrimonial identity, qualifications, and safety.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                2. <strong>No Third-Party Sharing</strong>: Your evidence is never sold, shared with advertisers, or published to public search engines.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                3. <strong>Revocability</strong>: You retain the legal right to revoke this consent at any time from your Trust Dashboard, triggering cryptographic purging of stored evidence.
              </p>
              <p>
                4. <strong>Audit Trail</strong>: All verification state transitions are logged in an unalterable audit ledger for accountability.
              </p>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                checked={consentAffirmed}
                onChange={(e) => setConsentAffirmed(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <span>I give my explicit, informed consent for ChaanBean to verify this credential and accept the purpose-bound retention policy.</span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                className="btn-primary"
                disabled={!consentAffirmed}
                onClick={() => setStep(3)}
              >
                <span>Accept & Provide Evidence</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Evidence Submission */}
        {step === 3 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Submit Evidence for {check.title}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Upload clear PDF, JPG, or PNG files (max 10MB).
            </p>

            <div
              onClick={handleSimulateFilePick}
              style={{
                border: '2px dashed var(--color-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: evidenceFileName ? '#F0FDF4' : 'var(--bg-primary)',
                marginBottom: '1.25rem',
              }}
            >
              <Upload size={32} color="var(--color-gold-dark)" style={{ margin: '0 auto 0.5rem' }} />
              {evidenceFileName ? (
                <div style={{ color: '#15803D', fontWeight: 700, fontSize: '0.92rem' }}>
                  ✓ Attached: {evidenceFileName}
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)', fontSize: '0.95rem' }}>
                    Click to select evidence document
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Accepts official digital copies or photo scans
                  </div>
                </>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Reference / Certificate Number (Optional)</label>
              <input
                className="form-input"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                placeholder="e.g. NAD-DEG-948120 or Roll No."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                className="btn-primary"
                disabled={!evidenceFileName && !identifierInput}
                onClick={() => setStep(4)}
              >
                <span>Set Visibility</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Visibility & Confirmation */}
        {step === 4 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Choose Who Sees This Verification Badge
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              You maintain total authority over who is allowed to view this verified credential badge.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {[
                { id: 'mutual_connections_only', label: 'Mutual Connections Only (Recommended)', desc: 'Only members with whom you have mutually accepted contact will see this badge.' },
                { id: 'verified_members_only', label: 'Verified Members Only', desc: 'Only members who themselves hold verified ChaanBean trust badges.' },
                { id: 'public', label: 'Public on Profile', desc: 'Visible to all registered members exploring your profile layers.' },
                { id: 'hidden', label: 'Hidden from Profile', desc: 'Verified internally but kept private until you explicitly enable it.' },
              ].map((vis) => (
                <div
                  key={vis.id}
                  onClick={() => setSelectedVisibility(vis.id as BadgeVisibility)}
                  style={{
                    border: selectedVisibility === vis.id ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                    background: selectedVisibility === vis.id ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Eye size={14} />
                    <span>{vis.label}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {vis.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(3)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                className="btn-primary"
                disabled={isSubmitting}
                onClick={handleCompleteSubmission}
              >
                <span>{isSubmitting ? 'Quarantining Evidence...' : 'Submit to Trust Vault'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
