// Module G & Phase 2: Marital Status & Divorce Verification Modal
// Conditional evidence paths: Never Married declaration, Divorce Decree / CNR audit, Widowed, Annulled.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaritalStatus, MaritalVerificationRecord, VerificationState } from '../../types';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { Modal } from '../common/Modal';
import { 
  FileCheck2, 
  Upload, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HeartHandshake 
} from 'lucide-react';

interface MaritalVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaritalVerificationModal: React.FC<MaritalVerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(currentUser.maritalStatus);
  const [declarationAffirmed, setDeclarationAffirmed] = useState(true);

  // Divorce specific fields
  const [decreeDate, setDecreeDate] = useState('2022-11-18');
  const [courtName, setCourtName] = useState('Principal Family Court');
  const [sectionType, setSectionType] = useState<'13B_Mutual_Consent' | 'Contested_Granted' | 'Annulled'>('13B_Mutual_Consent');
  const [cnrReference, setCnrReference] = useState('');
  const [custodyDisclosedPrivately, setCustodyDisclosedPrivately] = useState('');
  const [decreeFileAttached, setDecreeFileAttached] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateDecreeUpload = () => {
    setDecreeFileAttached('certified_divorce_decree_order.pdf');
  };

  const handleSaveMaritalVerification = () => {
    if (!declarationAffirmed) {
      showToast('Affirmation Required', 'Please affirm your declaration under oath.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let badgeLabel = 'Never Married Declared & Verified by ChaanBean Trust';
      if (maritalStatus === 'divorced') {
        badgeLabel = 'Divorce Status Verified by ChaanBean Trust';
      } else if (maritalStatus === 'widowed') {
        badgeLabel = 'Widowed Status Verified with Sensitivity by ChaanBean';
      } else if (maritalStatus === 'annulled') {
        badgeLabel = 'Annulment Decreed & Verified by ChaanBean';
      }

      const maritalRecord: MaritalVerificationRecord = {
        declaredStatus: maritalStatus,
        declarationAffirmed: true,
        declarationDate: new Date().toISOString().split('T')[0],
        decreeDate: maritalStatus === 'divorced' ? decreeDate : undefined,
        courtName: maritalStatus === 'divorced' ? courtName : undefined,
        sectionType: maritalStatus === 'divorced' ? sectionType : undefined,
        cnrReference: maritalStatus === 'divorced' ? cnrReference : undefined,
        custodyDisclosedPrivately: maritalStatus === 'divorced' ? custodyDisclosedPrivately : undefined,
        verifiedAt: new Date().toISOString().split('T')[0],
        verificationBadge: badgeLabel,
      };

      const audit = ChaanBeanService.createAuditEntry(
        'status_changed',
        'Marital Status & Divorce Verification',
        `Marital status affirmed as ${maritalStatus}. Verification badge generated.`,
        'user_supplied',
        'verified'
      );

      const updatedChecks = currentUser.trustProfile.checks.map((c) => {
        if (c.id === 'chk_mar_1' || c.id === 'chk_div_1') {
          return {
            ...c,
            status: 'verified' as VerificationState,
            verifiedAt: new Date().toISOString().split('T')[0],
            sourceNote: badgeLabel,
          };
        }
        return c;
      });

      updateCurrentUser({
        ...currentUser,
        maritalStatus,
        trustProfile: {
          ...currentUser.trustProfile,
          maritalVerification: maritalRecord,
          checks: updatedChecks,
          auditLogs: [audit, ...currentUser.trustProfile.auditLogs],
        },
      });

      setIsSubmitting(false);
      onClose();
      showToast('Marital Status Verified', badgeLabel, 'success');
    }, 1100);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Marital Status & Divorce Verification Workflow" maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Dignity and Privacy Notice */}
        <div style={{ background: '#FDF2F4', border: '1px solid #FBCFE8', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', color: '#831843', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HeartHandshake size={16} />
            <span>Dignified & Confidential Marital Record Verification (Module G)</span>
          </div>
          <p style={{ lineHeight: 1.5, color: '#9D174D' }}>
            We provide a supportive, non-stigmatizing path for all declared statuses. 
            <strong> Sensitive court decree judgments, financial alimony terms, and child custody agreements are quarantined in the Trust Vault</strong> and never disclosed to other members.
          </p>
        </div>

        {/* Declared Status Selector */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Declared Marital Status</label>
          <select
            className="form-select"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
          >
            <option value="never_married">Never Married</option>
            <option value="divorced">Divorced (Decree Absolute Granted)</option>
            <option value="widowed">Widowed</option>
            <option value="annulled">Annulled by Family Court</option>
            <option value="separated">Legally Separated</option>
          </select>
        </div>

        {/* CONDITIONAL PATH A: Never Married */}
        {maritalStatus === 'never_married' && (
          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Never Married Verification Protocol
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
              In accordance with national legal precedents, verification of unmarried status is conducted via solemn digital declaration affirmed under oath, supplemented by available state marriage registrar databases where accessible.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={declarationAffirmed}
                onChange={(e) => setDeclarationAffirmed(e.target.checked)}
                style={{ marginTop: '2px' }}
              />
              <span>I hereby solemnly affirm that I have never entered into a lawful marriage in India or overseas, and have no subsisting matrimonial union.</span>
            </label>
          </div>
        )}

        {/* CONDITIONAL PATH B: Divorced */}
        {maritalStatus === 'divorced' && (
          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.3)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
              Divorce Decree & Case Record Information
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date of Decree Absolute</label>
                <input
                  type="date"
                  className="form-input"
                  value={decreeDate}
                  onChange={(e) => setDecreeDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Family Court / Jurisdiction</label>
                <input
                  className="form-input"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g. Principal Family Court, Chennai"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nature of Decree</label>
                <select className="form-select" value={sectionType} onChange={(e) => setSectionType(e.target.value as any)}>
                  <option value="13B_Mutual_Consent">Section 13B (Mutual Consent)</option>
                  <option value="Contested_Granted">Contested Petition (Decree Granted)</option>
                  <option value="Annulled">Nullity / Annulment</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">CNR Reference Number (Optional)</label>
                <input
                  className="form-input"
                  value={cnrReference}
                  onChange={(e) => setCnrReference(e.target.value)}
                  placeholder="e.g. TNCH020084122022"
                />
              </div>
            </div>

            {/* Decree File Upload */}
            <div>
              <label className="form-label">Attach Certified Copy of Decree (Trust Vault Quarantined)</label>
              <div
                onClick={handleSimulateDecreeUpload}
                style={{
                  border: '2px dashed var(--color-gold)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: decreeFileAttached ? '#F0FDF4' : '#FFFFFF',
                }}
              >
                <Upload size={24} color="var(--color-gold-dark)" style={{ margin: '0 auto 0.4rem' }} />
                {decreeFileAttached ? (
                  <div style={{ color: '#15803D', fontWeight: 700, fontSize: '0.85rem' }}>
                    ✓ Document Attached: {decreeFileAttached}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Click to attach decree copy (PDF, max 10MB)
                  </div>
                )}
              </div>
            </div>

            {/* Voluntary Custody Disclosure */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Children & Custody Arrangement (Disclosed Privately)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={custodyDisclosedPrivately}
                onChange={(e) => setCustodyDisclosedPrivately(e.target.value)}
                placeholder="e.g. Full custody of 5-year-old child; co-parenting arrangement in place..."
              />
              <span className="form-hint">🔒 Kept completely private. Shared with prospective partners only after mutual consent.</span>
            </div>
          </div>
        )}

        {/* CONDITIONAL PATH C: Widowed */}
        {maritalStatus === 'widowed' && (
          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Widowed Verification (With Deepest Respect)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
              You may upload a copy of the municipal death certificate for confidential validation. We handle this process with maximum sensitivity.
            </p>
            <div
              onClick={() => setDecreeFileAttached('death_certificate_record.pdf')}
              style={{
                border: '2px dashed var(--color-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: decreeFileAttached ? '#F0FDF4' : '#FFFFFF',
              }}
            >
              <Upload size={22} color="var(--color-gold-dark)" style={{ margin: '0 auto 0.3rem' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {decreeFileAttached ? `✓ Attached: ${decreeFileAttached}` : 'Click to attach municipal certificate (PDF / Image)'}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={isSubmitting}
            onClick={handleSaveMaritalVerification}
          >
            <span>{isSubmitting ? 'Affirming & Encrypting...' : 'Affirm & Verify Marital Record'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
