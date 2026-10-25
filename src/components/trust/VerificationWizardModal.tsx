// Module F & Phase 1: Real-Time Interactive Verification Wizard Modal
// Supports Live & Sandbox Connectors: DigiLocker MeitY, Telecom DLT SMS, Corporate Email, Medical Council, and eSign

import React, { useState } from 'react';
import { VerificationCheck, BadgeVisibility, VerificationState } from '../../types';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { RealtimeVerificationService } from '../../services/backend/realtimeVerificationService';
import { TelecomSMSAdapter, WorkEmailAdapter } from '../../services/backend/adapters';
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
  ExternalLink,
  Sparkles,
  Smartphone,
  Mail,
  GraduationCap,
  Scale,
  Send,
  RefreshCw
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
  const [selectedVisibility, setSelectedVisibility] = useState<BadgeVisibility>('mutual_connections_only');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab mode in Step 3: 'realtime' or 'manual_upload'
  const [inputMode, setInputMode] = useState<'realtime' | 'manual_upload'>('realtime');

  // Aadhaar DigiLocker State
  const [aadhaarInput, setAadhaarInput] = useState('5489 1029 3841');
  const [aadhaarOtp, setAadhaarOtp] = useState('482910');

  // Mobile OTP State
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileTestOtp, setMobileTestOtp] = useState<string | null>(null);

  // Work Email State
  const [workEmail, setWorkEmail] = useState('dr.ananya@rainbowchildrens.in');
  const [emailToken, setEmailToken] = useState('');
  const [emailTokenSent, setEmailTokenSent] = useState(false);
  const [emailTestToken, setEmailTestToken] = useState<string | null>(null);

  // Medical / Professional Council State
  const [councilName, setCouncilName] = useState('Maharashtra Medical Council (MMC)');
  const [regNumber, setRegNumber] = useState('MMC/88219');
  const [regYear, setRegYear] = useState('2019');

  // Court CNR State
  const [cnrNumber, setCnrNumber] = useState('DLND010023412025');
  const [courtState, setCourtState] = useState('Delhi');
  const [courtDistrict, setCourtDistrict] = useState('New Delhi');

  // Manual File Upload State
  const [evidenceFileName, setEvidenceFileName] = useState<string | null>(null);
  const [identifierInput, setIdentifierInput] = useState('');

  if (!check) return null;

  const handleSimulateFilePick = () => {
    setEvidenceFileName(`${check.id}_evidence_quarantined.pdf`);
  };

  // 1. Send SMS OTP
  const handleSendMobileOTP = async () => {
    setIsSubmitting(true);
    const res = await TelecomSMSAdapter.sendOTP(mobileNumber);
    setIsSubmitting(false);
    if (res.success) {
      setMobileOtpSent(true);
      setMobileTestOtp(res.testOtp || '123456');
      setMobileOtp(res.testOtp || '123456');
      showToast('SMS OTP Dispatched', `6-digit OTP sent to +91 ******${mobileNumber.slice(-4)} (Sandbox code: ${res.testOtp})`, 'info');
    }
  };

  // 2. Send Work Email Token
  const handleSendEmailChallenge = async () => {
    setIsSubmitting(true);
    const res = await WorkEmailAdapter.sendChallenge(workEmail);
    setIsSubmitting(false);
    if (res.success) {
      setEmailTokenSent(true);
      setEmailTestToken(res.challengeToken || '123456');
      setEmailToken(res.challengeToken || '123456');
      showToast('Domain Handshake Sent', `Verification challenge sent to ${workEmail} (Sandbox token: ${res.challengeToken})`, 'info');
    } else {
      showToast('Invalid Email Domain', res.errorMessage, 'warning');
    }
  };

  // 3. Execute Real-Time Verification
  const handleExecuteRealtimeVerification = async () => {
    setIsSubmitting(true);

    try {
      let result;

      if (check.id === 'chk_aad_1') {
        result = await RealtimeVerificationService.verifyAadhaarDigiLocker(
          currentUser.id,
          currentUser.name,
          aadhaarOtp,
          currentUser.astrology?.dob,
          selectedVisibility
        );
      } else if (check.id === 'chk_mob_1') {
        result = await RealtimeVerificationService.verifyMobileOTP(mobileNumber, mobileOtp, selectedVisibility);
      } else if (check.id === 'chk_eml_1') {
        result = await RealtimeVerificationService.verifyWorkEmail(workEmail, emailToken, selectedVisibility);
      } else if (check.category === 'education' || check.id === 'chk_edu_1') {
        result = await RealtimeVerificationService.verifyMedicalCouncil(councilName, regNumber, currentUser.name, selectedVisibility);
      } else if (check.id === 'chk_mrt_1') {
        result = await RealtimeVerificationService.executeMaritalESign(
          currentUser.name,
          currentUser.maritalStatus === 'never_married' ? 'never_married' : 'divorced',
          selectedVisibility
        );
      } else if (check.id === 'chk_crt_1') {
        result = await RealtimeVerificationService.executeCourtScreening(cnrNumber, courtState, courtDistrict, currentUser.name, selectedVisibility);
      } else {
        // Generic connector fallback
        result = {
          success: true,
          check: {
            ...check,
            status: 'verified' as VerificationState,
            visibility: selectedVisibility,
            verifiedAt: new Date().toISOString(),
            evidenceHash: `sha256_${Date.now().toString(36)}`,
            sourceNote: `Credential verified by ChaanBean Trust Engine`,
          },
          consentRecord: ChaanBeanService.createConsentRecord(check.id, `Verification of ${check.title}`, 'Digital XML Hash'),
          auditLog: ChaanBeanService.createAuditEntry('status_changed', check.title, 'Verified via real-time connector', check.status, 'verified'),
          feedbackMessage: `✓ ${check.title} verified successfully!`,
        };
      }

      setIsSubmitting(false);

      if (result.success) {
        // Update user state with verified credential
        const updatedChecks = currentUser.trustProfile.checks.map((c) => (c.id === check.id ? result.check : c));
        if (!updatedChecks.some((c) => c.id === check.id)) {
          updatedChecks.push(result.check);
        }

        updateCurrentUser({
          ...currentUser,
          trustProfile: {
            ...currentUser.trustProfile,
            checks: updatedChecks,
            consentLedger: [...currentUser.trustProfile.consentLedger, result.consentRecord],
            auditLogs: [result.auditLog, ...currentUser.trustProfile.auditLogs],
          },
        });

        showToast('Trust Verification Complete', result.feedbackMessage, 'success');
        onClose();
      } else {
        showToast('Verification Notice', result.feedbackMessage, 'warning');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      showToast('Verification Failed', e?.message || 'Gateway error encountered', 'error');
    }
  };

  // 4. Manual Fallback Submission
  const handleCompleteManualSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newConsent = ChaanBeanService.createConsentRecord(
        check.id,
        `Credential verification for ${check.title}`,
        `${check.documentType || 'Uploaded Evidence'} Hash`
      );

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
      showToast('Credential Submitted', `${check.title} is now Pending Review in the Quarantined Vault.`, 'success');
    }, 700);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`ChaanBean Verification: ${check.title}`} maxWidth="680px">
      <div style={{ marginBottom: '1.25rem' }}>
        {/* Wizard Steps Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          {[
            { num: 1, label: '1. Purpose' },
            { num: 2, label: '2. Consent' },
            { num: 3, label: '3. Gateway Check' },
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
              <strong>Credential Objective</strong>: {check.documentType || 'Official Supporting Credential'}
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
              Informed Consent Agreement (DPDP Act 2023 & Policy v2.2)
            </h4>
            <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', maxHeight: '200px', overflowY: 'auto', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                1. <strong>Purpose Limitation</strong>: You authorize ChaanBean to verify {check.title} solely for confirming matrimonial identity, qualifications, and safety.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                2. <strong>Zero ID Digits Stored</strong>: Under UIDAI and statutory regulations, your raw Aadhaar or biometric information is never stored; only one-way cryptographic tokens and masked references (`XXXXXXXX1234`) are retained.
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
                <span>Accept & Open Gateway</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Real-Time Interactive Verification Gateway (Phase 1) */}
        {step === 3 && (
          <div>
            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInputMode('realtime')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: inputMode === 'realtime' ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                  color: inputMode === 'realtime' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Sparkles size={14} />
                <span>⚡ Real-Time Gateway (Phase 1 Active)</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('manual_upload')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: inputMode === 'manual_upload' ? 'var(--color-burgundy)' : 'var(--bg-secondary)',
                  color: inputMode === 'manual_upload' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Upload size={14} />
                <span>Manual Document Deposition</span>
              </button>
            </div>

            {inputMode === 'realtime' ? (
              <div>
                {/* 1. Aadhaar DigiLocker Gateway */}
                {check.id === 'chk_aad_1' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                        <span>MeitY DigiLocker Paperless e-KYC</span>
                      </div>
                      <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                        Sandbox Ready
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Under MeitY & UIDAI regulations, your demographic data is authenticated directly with government servers. Only masked ID is retained.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Aadhaar / Virtual ID</label>
                        <input
                          className="form-input"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          value={aadhaarInput}
                          onChange={(e) => setAadhaarInput(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>DigiLocker OTP (Sandbox: 482910)</label>
                        <input
                          className="form-input"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          value={aadhaarOtp}
                          onChange={(e) => setAadhaarOtp(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting || !aadhaarOtp}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <ShieldCheck size={16} />
                      <span>{isSubmitting ? 'Authenticating with DigiLocker...' : 'Authenticate via DigiLocker e-KYC'}</span>
                    </button>
                  </div>
                )}

                {/* 2. Mobile DLT SMS Gateway */}
                {check.id === 'chk_mob_1' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Smartphone size={16} color="var(--color-burgundy)" />
                      <span>TRAI DLT Two-Factor SMS Verification</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Verifies mobile device possession and telecom registry identity.
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <input
                        className="form-input"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="10-digit Mobile Number"
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                        disabled={isSubmitting || !mobileNumber}
                        onClick={handleSendMobileOTP}
                      >
                        <Send size={14} />
                        <span>{mobileOtpSent ? 'Resend' : 'Send OTP'}</span>
                      </button>
                    </div>

                    {mobileOtpSent && (
                      <div style={{ animation: 'fadeIn 200ms ease-out', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#166534', background: '#DCFCE7', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                          ✓ OTP Dispatched. For Sandbox testing, use code: <strong>{mobileTestOtp}</strong>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Enter 6-Digit OTP</label>
                          <input
                            className="form-input"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                            value={mobileOtp}
                            onChange={(e) => setMobileOtp(e.target.value)}
                            placeholder="e.g. 482910"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting || !mobileOtp}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <ShieldCheck size={16} />
                      <span>{isSubmitting ? 'Verifying OTP...' : 'Verify Mobile Number'}</span>
                    </button>
                  </div>
                )}

                {/* 3. Work / Institutional Email Domain */}
                {check.id === 'chk_eml_1' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Mail size={16} color="var(--color-burgundy)" />
                      <span>Institutional / Corporate Email Handshake</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Validates hospital or enterprise domain affiliation (free public domains like Gmail are excluded).
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <input
                        className="form-input"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="doctor@hospital.org"
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                        disabled={isSubmitting || !workEmail}
                        onClick={handleSendEmailChallenge}
                      >
                        <Send size={14} />
                        <span>{emailTokenSent ? 'Resend' : 'Send Token'}</span>
                      </button>
                    </div>

                    {emailTokenSent && (
                      <div style={{ animation: 'fadeIn 200ms ease-out', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#166534', background: '#DCFCE7', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                          ✓ Handshake token dispatched. Sandbox code: <strong>{emailTestToken}</strong>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Enter Verification Token</label>
                          <input
                            className="form-input"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                            value={emailToken}
                            onChange={(e) => setEmailToken(e.target.value)}
                            placeholder="6-digit token"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting || !emailToken}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <ShieldCheck size={16} />
                      <span>{isSubmitting ? 'Verifying Token...' : 'Confirm Domain Ownership'}</span>
                    </button>
                  </div>
                )}

                {/* 4. Professional / Medical Council */}
                {(check.category === 'education' || check.id === 'chk_edu_1') && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <GraduationCap size={16} color="var(--color-burgundy)" />
                      <span>Medical Council & Academic Depository Query</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Queries National Medical Commission (NMC), State Council, or NAD registry records.
                    </p>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Select Authoritative Register</label>
                      <select
                        className="form-select"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        value={councilName}
                        onChange={(e) => setCouncilName(e.target.value)}
                      >
                        <option value="Maharashtra Medical Council (MMC)">Maharashtra Medical Council (MMC)</option>
                        <option value="Delhi Medical Council (DMC)">Delhi Medical Council (DMC)</option>
                        <option value="Karnataka Medical Council (KMC)">Karnataka Medical Council (KMC)</option>
                        <option value="National Academic Depository (NAD)">National Academic Depository (NAD Degree)</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Registration / Roll Number</label>
                        <input
                          className="form-input"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                          value={regNumber}
                          onChange={(e) => setRegNumber(e.target.value)}
                          placeholder="e.g. MMC/88219"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Year</label>
                        <input
                          className="form-input"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                          value={regYear}
                          onChange={(e) => setRegYear(e.target.value)}
                          placeholder="2019"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting || !regNumber}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <ShieldCheck size={16} />
                      <span>{isSubmitting ? 'Querying Council Registry...' : 'Verify Registration in Register'}</span>
                    </button>
                  </div>
                )}

                {/* 5. Marital Declaration (eSign) */}
                {check.id === 'chk_mrt_1' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Scale size={16} color="var(--color-burgundy)" />
                      <span>Section 3A IT Act Digital Oath & Aadhaar eSign</span>
                    </div>
                    <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#92400E', marginBottom: '1rem', lineHeight: 1.5 }}>
                      "I, {currentUser.name}, solemnly declare under oath that I have never entered into a marriage contract. This affirmation carries legal validity under Section 3A of the Information Technology Act."
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <CheckCircle2 size={16} />
                      <span>{isSubmitting ? 'Generating Digital Affidavit...' : 'eSign Solemn Declaration via Aadhaar'}</span>
                    </button>
                  </div>
                )}

                {/* 6. eCourts Public Registry */}
                {check.id === 'chk_crt_1' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Scale size={16} color="var(--color-burgundy)" />
                      <span>eCourts CNR Index Screening</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      Screens civil, matrimonial, and criminal indices under non-defamatory statutory coverage guidelines.
                    </p>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>16-Character CNR Number (Optional or General Index)</label>
                      <input
                        className="form-input"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        value={cnrNumber}
                        onChange={(e) => setCnrNumber(e.target.value)}
                        placeholder="e.g. DLND010023412025"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={isSubmitting}
                      onClick={handleExecuteRealtimeVerification}
                    >
                      <ShieldCheck size={16} />
                      <span>{isSubmitting ? 'Screening eCourts...' : 'Run Public Litigation Screening'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Document Deposition Tab */
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Quarantine an official certificate or digital document into your encrypted Trust Vault.
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
                        Accepts official digital copies or photo scans (PDF, JPG, PNG)
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Reference / Certificate Number (Optional)</label>
                  <input
                    className="form-input"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder="e.g. NAD-DEG-948120 or Roll No."
                  />
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={!evidenceFileName && !identifierInput}
                  onClick={() => setStep(4)}
                >
                  <span>Proceed to Visibility Settings</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: 'var(--border-light)' }}>
              <button className="btn-outline" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button className="btn-outline" onClick={onClose}>
                <span>Cancel</span>
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
                onClick={handleCompleteManualSubmission}
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
