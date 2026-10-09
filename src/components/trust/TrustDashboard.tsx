// Module F: ChaanBean Trust Hub & Verification Foundation

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationCheck, VerificationState } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
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
  ExternalLink 
} from 'lucide-react';

export const TrustDashboard: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState<string>('chk_aad_1');
  const [documentType, setDocumentType] = useState('Aadhaar Card (Masked XML)');
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // Status explanations guide
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

  const handleStartUpload = (checkId: string) => {
    setSelectedCheckId(checkId);
    setFileSelected(null);
    setConsentChecked(false);
    setIsUploadModalOpen(true);
  };

  const handleSimulateFileSelect = () => {
    setFileSelected('document_scan_credential.pdf');
  };

  const handleSubmitVerification = () => {
    if (!consentChecked) {
      showToast('Consent Required', 'Please confirm your consent for ChaanBean document processing.', 'warning');
      return;
    }
    if (!fileSelected) {
      showToast('File Required', 'Please select a document file to upload.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updatedChecks = currentUser.trustProfile.checks.map((chk) => {
        if (chk.id === selectedCheckId) {
          return {
            ...chk,
            status: 'pending' as VerificationState,
            sourceNote: `Submitted document ${fileSelected} under cryptographic Trust Vault quarantine.`,
          };
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

      setIsSubmitting(false);
      setIsUploadModalOpen(false);
      showToast(
        'Document Submitted to Trust Vault',
        'Your document has been securely received into the ChaanBean Trust Vault. Status is updated to Pending Review.',
        'success'
      );
    }, 1200);
  };

  return (
    <div className="container" style={{ maxWidth: '980px', padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #14301D 0%, #15803D 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#86EFAC', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            <ShieldCheck size={18} />
            <span>ChaanBean Digital Trust Vault</span>
          </div>
          <h1 className="heading-section" style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '2.2rem' }}>
            Your Verified Credential Profile
          </h1>
          <p style={{ color: '#DCFCE7', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            ChaanBean establishes digital trust without sacrificing dignity or privacy. 
            Raw government documents, salary numbers, and national IDs are never disclosed to other members.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
            <Lock size={14} color="#86EFAC" />
            <span>Cryptographic Hashing • Purpose-Limited Consent</span>
          </div>
        </div>
      </div>

      {/* Trust Status Legend & Integrity Principles */}
      <div
        style={{
          background: 'var(--bg-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border-delicate)',
          marginBottom: '2rem',
        }}
      >
        <h3 className="heading-card" style={{ fontSize: '1.15rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem' }}>
          Status Integrity Guide
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
          We never convey trust status through color alone. Every badge carries an explicit textual label and definition:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {statusLegend.map((item) => (
            <div key={item.state} style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ marginBottom: '0.4rem' }}>
                <StatusBadge status={item.state} customLabel={item.label} />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Checks List */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="heading-card" style={{ fontSize: '1.4rem', color: 'var(--color-burgundy-dark)', marginBottom: '1rem' }}>
          Your Credential Audit Checklist
        </h2>

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
                gap: '1rem',
              }}
            >
              <div style={{ maxWidth: '560px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                    {chk.title}
                  </h4>
                  <StatusBadge status={chk.status} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {chk.description}
                </p>
                {chk.sourceNote && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    Note: {chk.sourceNote}
                  </div>
                )}
                {chk.verifiedAt && (
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600, marginTop: '0.25rem' }}>
                    ✓ Verified on: {chk.verifiedAt}
                  </div>
                )}
              </div>

              <div>
                {chk.status === 'verified' ? (
                  <span style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Active in Trust Vault</span>
                  </span>
                ) : chk.status === 'pending' ? (
                  <span style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={16} />
                    <span>Review in Progress</span>
                  </span>
                ) : (
                  <button className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }} onClick={() => handleStartUpload(chk.id)}>
                    <Upload size={14} />
                    <span>Upload Proof</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Provider Integration Transparency Box */}
      <div
        style={{
          background: 'var(--color-gold-subtle)',
          border: '1.5px solid var(--color-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-burgundy-dark)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span>Honest Provider Integration Notice (Module F & Phase 2 Roadmap)</span>
        </div>
        <p style={{ marginBottom: '0.75rem' }}>
          In accordance with our strict architectural principles, MangalSutra 2.0 never simulates external legal APIs without explicit disclosure.
        </p>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
          <li>
            <strong>DigiLocker & UIDAI</strong>: Official enterprise API access requires licensed entity status and authorized client keys.
          </li>
          <li>
            <strong>eCourts Case Information</strong>: Court screening relies on public record CNR indexes. "No matching public record identified" is never stated as proof that no dispute exists.
          </li>
          <li>
            <strong>Police / CCTNS Screening</strong>: No private company possesses unrestricted access to confidential police registers. We do not claim fabricated antecedent access.
          </li>
        </ul>
      </div>

      {/* Upload Proof & Purpose Consent Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Verification Document"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Document Category</label>
            <select className="form-select" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              <option value="Aadhaar Card (Masked XML)">Aadhaar Card (Masked XML)</option>
              <option value="Passport Copy (Biometric Page)">Passport Copy (Biometric Page)</option>
              <option value="University Degree Certificate">University Degree Certificate</option>
              <option value="Corporate Pay Slip / Offer Letter">Corporate Pay Slip / Offer Letter</option>
              <option value="Divorce Decree / Section 13B Order">Divorce Decree / Section 13B Order</option>
            </select>
          </div>

          {/* File Picker Mock */}
          <div>
            <label className="form-label">Select Document File</label>
            <div
              onClick={handleSimulateFileSelect}
              style={{
                border: '2px dashed var(--color-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: fileSelected ? '#F0FDF4' : 'var(--bg-primary)',
              }}
            >
              <Upload size={28} color="var(--color-gold-dark)" style={{ margin: '0 auto 0.5rem' }} />
              {fileSelected ? (
                <div style={{ color: '#15803D', fontWeight: 700, fontSize: '0.9rem' }}>
                  Selected: {fileSelected} (Ready for submission)
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-burgundy-dark)' }}>
                    Click to select document file
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    PDF, JPG, or PNG up to 10MB
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Purpose-Bound Consent Notice */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: '#1E3A8A' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} />
              <span>Purpose Limitation & Trust Vault Isolation Notice</span>
            </div>
            <p style={{ lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Your document will be encrypted and used strictly for identity and credential validation. Other members only see the verified badge and date.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={{ marginTop: '2px' }}
              />
              <span>I give my explicit, informed consent for ChaanBean to verify this document and agree to the cryptographic retention policy.</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn-outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmitVerification}
              disabled={isSubmitting || !fileSelected}
            >
              <span>{isSubmitting ? 'Encrypting & Submitting...' : 'Submit to Trust Vault'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
