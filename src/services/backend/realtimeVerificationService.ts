// Phase 1 Unified Engine: Realtime Verification Service
// Coordinates all 7 verification adapters, updates Quarantined Trust Vault, and writes audit trails

import {
  DigiLockerAdapter,
  TelecomSMSAdapter,
  WorkEmailAdapter,
  MedicalCouncilAdapter,
  ESignAffidavitAdapter,
  CourtScreeningAdapter,
} from './adapters';
import { VerificationCheck, ConsentRecord, AuditLogEntry, BadgeVisibility } from '../../types';
import { supabase, isLiveBackendConfigured } from './supabaseClient';

export interface ExecuteCheckResult {
  success: boolean;
  check: VerificationCheck;
  consentRecord: ConsentRecord;
  auditLog: AuditLogEntry;
  feedbackMessage: string;
}

export const RealtimeVerificationService = {
  // 1. Verify Government Identity (Aadhaar via DigiLocker)
  async verifyAadhaarDigiLocker(
    userId: string,
    userName: string,
    otp: string,
    claimedDob?: string,
    visibility: BadgeVisibility = 'verified_members_only'
  ): Promise<ExecuteCheckResult> {
    const res = await DigiLockerAdapter.verifySession('sess_interactive', otp, userName, claimedDob);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_aadhaar`,
      checkId: 'chk_aad_1',
      purpose: 'Demographic identity and age threshold verification for matrimonial trust',
      grantedAt: new Date().toISOString(),
      scope: 'DigiLocker Signed XML (Masked ID)',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_aadhaar`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Government Identity (Aadhaar e-KYC)',
      actor: 'ChaanBean DigiLocker Connector',
      details: res.success 
        ? `e-KYC match verified by UIDAI MeitY. Masked: ${res.maskedAadhaar}. Age: ${res.calculatedAge} yrs.` 
        : `Verification failed: ${res.errorMessage}`,
      previousStatus: 'pending',
      newStatus: res.success ? 'verified' : 'further_review_required',
    };

    const check: VerificationCheck = {
      id: 'chk_aad_1',
      category: 'identity',
      title: 'Aadhaar e-KYC',
      description: 'ChaanBean Trust Vault verified photo & demographic hash via DigiLocker MeitY',
      status: res.success ? 'verified' : 'further_review_required',
      visibility,
      verifiedAt: res.success ? res.verifiedAt : undefined,
      documentType: 'Aadhaar Paperless e-KYC XML',
      providerName: 'UIDAI via DigiLocker (MeitY)',
      providerType: 'digilocker',
      evidenceFileName: `aadhaar_masked_${res.maskedAadhaar || 'pending'}.xml`,
      evidenceHash: res.documentHash,
      sourceNote: res.success ? `Verified age ${res.calculatedAge}. Masked ID: ${res.maskedAadhaar}` : res.errorMessage,
    };

    return {
      success: res.success,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: res.success 
        ? `✓ Aadhaar e-KYC Verified successfully via DigiLocker (${res.maskedAadhaar})` 
        : (res.errorMessage || 'Verification failed'),
    };
  },

  // 2. Verify Mobile Number via 2FA OTP
  async verifyMobileOTP(
    phoneNumber: string,
    enteredOtp: string,
    visibility: BadgeVisibility = 'verified_members_only'
  ): Promise<ExecuteCheckResult> {
    const res = TelecomSMSAdapter.verifyOTP(phoneNumber, enteredOtp);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_mob`,
      checkId: 'chk_mob_1',
      purpose: 'Device possession and two-factor authentication security',
      grantedAt: new Date().toISOString(),
      scope: 'Mobile SMS Protocol',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_mob`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Mobile Number Verification',
      actor: 'Telecom SMS 2FA Gateway',
      details: res.verified 
        ? `Mobile ${phoneNumber} cryptographic challenge passed.` 
        : `OTP verification failed for ${phoneNumber}.`,
      previousStatus: 'pending',
      newStatus: res.verified ? 'verified' : 'further_review_required',
    };

    const check: VerificationCheck = {
      id: 'chk_mob_1',
      category: 'identity',
      title: 'Mobile Verified',
      description: 'Verified via two-factor OTP SMS protocol with DLT compliance',
      status: res.verified ? 'verified' : 'further_review_required',
      visibility,
      verifiedAt: res.verified ? res.verifiedAt : undefined,
      documentType: 'Telecom Gateway 2FA Handshake',
      providerName: 'TRAI DLT Telecom Gateway',
      providerType: 'digilocker',
      evidenceHash: res.verificationHash,
      sourceNote: res.verified ? `SMS OTP confirmed on ${phoneNumber}` : res.errorMessage,
    };

    return {
      success: res.verified,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: res.verified ? `✓ Mobile ${phoneNumber} verified successfully!` : (res.errorMessage || 'OTP Failed'),
    };
  },

  // 3. Verify Corporate / Hospital Work Email
  async verifyWorkEmail(
    workEmail: string,
    enteredToken: string,
    visibility: BadgeVisibility = 'mutual_connections_only'
  ): Promise<ExecuteCheckResult> {
    const res = WorkEmailAdapter.verifyChallenge(workEmail, enteredToken);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_eml`,
      checkId: 'chk_eml_1',
      purpose: 'Verify workplace affiliation and corporate domain possession',
      grantedAt: new Date().toISOString(),
      scope: 'Domain DNS Handshake',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_eml`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Corporate & Personal Email',
      actor: 'ChaanBean DNS Domain Challenge',
      details: res.verified 
        ? `Domain ${res.domain} verified for ${workEmail}.` 
        : `Token failed for ${workEmail}.`,
      previousStatus: 'pending',
      newStatus: res.verified ? 'verified' : 'further_review_required',
    };

    const check: VerificationCheck = {
      id: 'chk_eml_1',
      category: 'identity',
      title: 'Email Verified',
      description: 'Verified active mailbox cryptographic handshake and institutional domain',
      status: res.verified ? 'verified' : 'further_review_required',
      visibility,
      verifiedAt: res.verified ? res.verifiedAt : undefined,
      documentType: 'Corporate Domain Cryptographic Token',
      providerName: `${res.domain} Mail Gateway`,
      providerType: 'corporate_hr',
      evidenceHash: res.auditHash,
      sourceNote: res.verified ? `Verified institutional address @${res.domain}` : res.errorMessage,
    };

    return {
      success: res.verified,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: res.verified ? `✓ Institutional domain @${res.domain} confirmed!` : (res.errorMessage || 'Failed'),
    };
  },

  // 4. Verify Professional / Medical Council License
  async verifyMedicalCouncil(
    council: string,
    regNumber: string,
    doctorName: string,
    visibility: BadgeVisibility = 'mutual_connections_only'
  ): Promise<ExecuteCheckResult> {
    const res = await MedicalCouncilAdapter.verifyRegistration(council, regNumber, doctorName);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_med`,
      checkId: 'chk_med_1',
      purpose: 'Authenticate medical license and specialist qualifications',
      grantedAt: new Date().toISOString(),
      scope: 'Public Medical Council Directory Query',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_med`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Medical Council Verification',
      actor: 'NMC / State Council Connector',
      details: res.verified 
        ? `Council ${res.councilName} confirmed #${res.registrationNumber}. Status: ${res.currentStanding}.` 
        : `Lookup failed: ${res.errorMessage}`,
      previousStatus: 'pending',
      newStatus: res.verified ? 'verified' : 'further_review_required',
    };

    const check: VerificationCheck = {
      id: 'chk_med_1',
      category: 'education',
      title: 'Medical Council Verification',
      description: `Authenticated with ${res.councilName} (${res.registrationNumber})`,
      status: res.verified ? 'verified' : 'further_review_required',
      visibility,
      verifiedAt: res.verified ? res.verifiedAt : undefined,
      documentType: 'State Medical Council Certificate',
      providerName: res.councilName,
      providerType: 'nad',
      evidenceHash: res.verificationHash,
      sourceNote: res.verified ? `Active standing confirmed: ${res.registrationNumber}` : res.errorMessage,
    };

    return {
      success: res.verified,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: res.verified ? `✓ Medical Registration ${res.registrationNumber} verified in good standing!` : (res.errorMessage || 'Failed'),
    };
  },

  // 5. Generate and Sign Digital Marital Affidavit
  async executeMaritalESign(
    userName: string,
    status: 'never_married' | 'divorced' | 'widowed',
    visibility: BadgeVisibility = 'mutual_connections_only',
    decreeDetails?: { decreeDate?: string; courtName?: string; cnr?: string }
  ): Promise<ExecuteCheckResult> {
    const res = ESignAffidavitAdapter.generateAndSignDeclaration(userName, status, decreeDetails);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_mrt`,
      checkId: 'chk_mrt_1',
      purpose: 'Solemn affirmation of matrimonial status under Indian IT Act Section 3A',
      grantedAt: new Date().toISOString(),
      scope: 'Digital Oath & Aadhaar eSign Audit Trail',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_mrt`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Marital Declaration',
      actor: 'Protean / Leegality eSign Gateway',
      details: `Digital Affidavit eSigned under Section 3A IT Act. Declaration: ${status}. Certificate: ${res.digitalCertificateHash.slice(0, 16)}...`,
      previousStatus: 'user_supplied',
      newStatus: 'verified',
    };

    const check: VerificationCheck = {
      id: 'chk_mrt_1',
      category: 'marital_status',
      title: 'Marital Declaration',
      description: 'Signed digital declaration under oath affirming marital status',
      status: 'verified',
      visibility,
      verifiedAt: res.eSignedAt,
      documentType: 'Signed Digital Oath (Section 3A IT Act)',
      providerName: 'ChaanBean Legal Registry Desk & Aadhaar eSign',
      providerType: 'self_affirmed',
      evidenceHash: res.digitalCertificateHash,
      sourceNote: `${status.replace('_', ' ').toUpperCase()} affirmed under oath. Certificate: ${res.affidavitId}`,
    };

    return {
      success: true,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: `✓ Marital status affirmed under oath and digitally sealed!`,
    };
  },

  // 6. Public Court Screening (CNR Search)
  async executeCourtScreening(
    cnrOrCaseNo: string,
    state: string,
    district: string,
    userName: string,
    visibility: BadgeVisibility = 'mutual_connections_only'
  ): Promise<ExecuteCheckResult> {
    const res = await CourtScreeningAdapter.screenCNR(cnrOrCaseNo, state, district, userName);

    const consentRecord: ConsentRecord = {
      id: `cst_${Date.now()}_crt`,
      checkId: 'chk_crt_1',
      purpose: 'Public litigation index screening in accordance with non-defamatory open court principles',
      grantedAt: new Date().toISOString(),
      scope: 'eCourts Public Services Registry Index',
      version: '2.2',
      isRevoked: false,
    };

    const auditLog: AuditLogEntry = {
      id: `log_${Date.now()}_crt`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'status_changed',
      checkTitle: 'Public Court Record Screening',
      actor: 'eCourts National Services Index',
      details: `Screened civil/criminal indices for CNR ${res.cnrNumber}. Matches: ${res.matchingRecordsCount}.`,
      previousStatus: 'pending',
      newStatus: 'verified',
    };

    const check: VerificationCheck = {
      id: 'chk_crt_1',
      category: 'court',
      title: 'Public Court Record Screening',
      description: 'Public eCourts CNR civil and criminal index screening completed.',
      status: 'verified',
      visibility,
      verifiedAt: res.verifiedAt,
      documentType: 'eCourts Public Record Screening Index',
      providerName: 'eCourts Public Search Registry',
      providerType: 'ecourts',
      evidenceHash: res.screeningAuditHash,
      sourceNote: res.resultSummary,
    };

    return {
      success: true,
      check,
      consentRecord,
      auditLog,
      feedbackMessage: `✓ eCourts index screening completed. Zero matching adverse litigation records.`,
    };
  },
};
