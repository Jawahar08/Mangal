// Module F & Phase 2: Correction, Appeal & Dispute Modal

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationCheck, VerificationState } from '../../types';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { Modal } from '../common/Modal';
import { HelpCircle, AlertCircle, Send, CheckCircle2 } from 'lucide-react';

interface DisputeCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  check: VerificationCheck | null;
}

export const DisputeCorrectionModal: React.FC<DisputeCorrectionModalProps> = ({ isOpen, onClose, check }) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();
  const [disputeReason, setDisputeReason] = useState('data_error');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!check) return null;

  const handleSubmitDispute = () => {
    if (!disputeNotes.trim()) {
      showToast('Details Required', 'Please explain what needs to be reviewed or corrected.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const audit = ChaanBeanService.createAuditEntry(
        'dispute_raised',
        check.title,
        `Correction requested by user. Reason: ${disputeReason}. Notes: ${disputeNotes}`,
        check.status,
        'further_review_required'
      );

      const updatedChecks = currentUser.trustProfile.checks.map((c) => {
        if (c.id === check.id) {
          return {
            ...c,
            status: 'further_review_required' as VerificationState,
            correctionRequested: true,
            disputeNote: disputeNotes,
            sourceNote: 'Under re-examination by Senior Grievance Reviewer.',
          };
        }
        return c;
      });

      updateCurrentUser({
        ...currentUser,
        trustProfile: {
          ...currentUser.trustProfile,
          checks: updatedChecks,
          auditLogs: [audit, ...currentUser.trustProfile.auditLogs],
        },
      });

      setIsSubmitting(false);
      onClose();
      showToast(
        'Review Request Logged',
        `A senior reviewer has been assigned to re-examine ${check.title}. Status updated to Review Required.`,
        'success'
      );
    }, 900);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Correction: ${check.title}`} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          If a verification finding is inaccurate, outdated, or requires documentation update, you have the right to request a manual re-audit by our Trust & Safety team.
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Reason for Review Request</label>
          <select
            className="form-select"
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          >
            <option value="data_error">Typographical Error or Mismatched Identifier</option>
            <option value="outdated_record">Record is Outdated / Replaced by Recent Decree or Certificate</option>
            <option value="name_collision">Name Collision with Another Individual in Public Index</option>
            <option value="other">Other Dispute Regarding Document Interpretation</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Explanation & Clarification Details</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={disputeNotes}
            onChange={(e) => setDisputeNotes(e.target.value)}
            placeholder="Explain the specific discrepancy and attach any clarifications..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={isSubmitting || !disputeNotes.trim()}
            onClick={handleSubmitDispute}
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Submitting to Grievance Desk...' : 'Submit Review Request'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
