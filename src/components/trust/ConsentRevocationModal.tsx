// Module F & Phase 2: Consent Revocation & Data Purging Modal

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationCheck, VerificationState } from '../../types';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { VerificationLifecycleService } from '../../services/backend/lifecycle/verificationLifecycleService';
import { Modal } from '../common/Modal';
import { AlertTriangle, Trash2, ShieldOff, CheckCircle2 } from 'lucide-react';

interface ConsentRevocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  check: VerificationCheck | null;
}

export const ConsentRevocationModal: React.FC<ConsentRevocationModalProps> = ({ isOpen, onClose, check }) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();
  const [purgeConfirmed, setPurgeConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!check) return null;

  const handleRevokeConsent = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Execute statutory DPDP Section 6(4) revocation and cryptographic key purging
      const { updatedUser, message } = VerificationLifecycleService.revokeConsentAndDowngradeBadge(
        currentUser,
        check.id
      );

      updateCurrentUser(updatedUser);
      setIsProcessing(false);
      onClose();
      showToast('Consent Revoked & Evidence Purged', message, 'info');
    }, 800);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Revoke Consent: ${check.title}`} maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#991B1B' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} />
            <span>Right to Revoke & Evidence Deletion</span>
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#7F1D1D' }}>
            Under ChaanBean’s privacy-first charter, revoking consent immediately purges your encrypted evidence from the Trust Vault. 
            The corresponding <em>Verified</em> badge will be removed from your profile and will no longer be visible to any members.
          </p>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={purgeConfirmed}
            onChange={(e) => setPurgeConfirmed(e.target.checked)}
            style={{ marginTop: '3px' }}
          />
          <span>I confirm that I wish to revoke consent, delete the vault record, and revert this credential to User Supplied.</span>
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{ background: 'var(--color-danger)' }}
            disabled={!purgeConfirmed || isProcessing}
            onClick={handleRevokeConsent}
          >
            <Trash2 size={16} />
            <span>{isProcessing ? 'Purging Evidence...' : 'Confirm Revocation & Delete'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
