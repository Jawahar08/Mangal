// ChaanBean Trust Vault Service (Phase 2 Core Engine)
// Enforces purpose limitation, consent tracking, audit trails, and safe non-defamatory wording.

import { 
  VerificationCheck, 
  VerificationState, 
  ConsentRecord, 
  AuditLogEntry, 
  CourtScreeningResult, 
  MaritalVerificationRecord, 
  MaritalStatus, 
  BadgeVisibility 
} from '../types';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-10 10:15:00',
    action: 'consent_granted',
    checkTitle: 'Mobile Number Verification',
    actor: 'User (Self)',
    details: 'User accepted SMS OTP verification and purpose limitation policy v2.1.',
  },
  {
    id: 'log_02',
    timestamp: '2026-09-10 10:16:32',
    action: 'status_changed',
    checkTitle: 'Mobile Number Verification',
    actor: 'ChaanBean Auth Engine',
    details: 'Two-factor OTP cryptographic challenge verified successfully.',
    previousStatus: 'pending',
    newStatus: 'verified',
  },
  {
    id: 'log_03',
    timestamp: '2026-09-12 14:22:10',
    action: 'document_uploaded',
    checkTitle: 'Government Identity (Aadhaar / Passport)',
    actor: 'User (Self)',
    details: 'Encrypted document hash deposited into Trust Vault quarantine.',
    previousStatus: 'user_supplied',
    newStatus: 'pending',
  },
  {
    id: 'log_04',
    timestamp: '2026-09-12 16:40:00',
    action: 'status_changed',
    checkTitle: 'Government Identity (Aadhaar / Passport)',
    actor: 'ChaanBean Trust Reviewer #CB-409',
    details: 'Demographic match and photo verification approved. Raw document quarantined.',
    previousStatus: 'pending',
    newStatus: 'verified',
  },
  {
    id: 'log_05',
    timestamp: '2026-09-14 11:05:00',
    action: 'status_changed',
    checkTitle: 'Education Degree Authentication',
    actor: 'ChaanBean NAD Connector',
    details: 'National Academic Depository degree hash verified.',
    previousStatus: 'user_supplied',
    newStatus: 'verified',
  },
];

export const INITIAL_CONSENT_LEDGER: ConsentRecord[] = [
  {
    id: 'cst_01',
    checkId: 'chk_mob_1',
    purpose: 'Validate mobile device possession for 2FA security.',
    grantedAt: '2026-09-10 10:15:00',
    scope: 'Mobile SMS & Carrier Hash',
    version: '2.1',
    isRevoked: false,
  },
  {
    id: 'cst_02',
    checkId: 'chk_eml_1',
    purpose: 'Validate personal and work email address.',
    grantedAt: '2026-09-10 10:17:00',
    scope: 'Mailbox Domain Handshake',
    version: '2.1',
    isRevoked: false,
  },
  {
    id: 'cst_03',
    checkId: 'chk_aad_1',
    purpose: 'Verify legal age and demographic identity without exposing National ID digits.',
    grantedAt: '2026-09-12 14:20:00',
    scope: 'Aadhaar Offline XML Demographic Hash',
    version: '2.1',
    isRevoked: false,
  },
  {
    id: 'cst_04',
    checkId: 'chk_edu_1',
    purpose: 'Authenticate higher educational degrees via academic registries.',
    grantedAt: '2026-09-14 10:55:00',
    scope: 'NAD Degree Record Hash',
    version: '2.1',
    isRevoked: false,
  },
];

export const ALL_VERIFICATION_CHECK_DEFINITIONS: Omit<VerificationCheck, 'status' | 'visibility'>[] = [
  {
    id: 'chk_mob_1',
    category: 'identity',
    title: 'Mobile Number Verification',
    description: 'Verified via two-factor OTP SMS cryptographic handshake.',
    documentType: 'SMS 2FA Token',
    providerName: 'Telecom Gateway 2FA',
    providerType: 'digilocker',
  },
  {
    id: 'chk_eml_1',
    category: 'identity',
    title: 'Email Address Authentication',
    description: 'Cryptographic challenge link verified active mailbox domain.',
    documentType: 'Mailbox Token',
    providerName: 'Mailbox DNS Verification',
    providerType: 'corporate_hr',
  },
  {
    id: 'chk_aad_1',
    category: 'identity',
    title: 'Government Identity (Aadhaar / Passport)',
    description: 'Verified demographic hash and photo match. National ID digits kept strictly confidential.',
    documentType: 'Aadhaar Offline XML / Passport Biometric Page',
    providerName: 'ChaanBean Biometric Vault',
    providerType: 'digilocker',
  },
  {
    id: 'chk_dob_1',
    category: 'dob',
    title: 'Date of Birth & Age Verification',
    description: 'Statutory age authenticated against municipal birth register or passport hash.',
    documentType: 'Birth Certificate / Passport',
    providerName: 'Civil Registration Depository',
    providerType: 'digilocker',
  },
  {
    id: 'chk_edu_1',
    category: 'education',
    title: 'Education Degree Authentication',
    description: 'Degree credentials verified via National Academic Depository (NAD).',
    documentType: 'University Degree / Transcript',
    providerName: 'National Academic Depository (NAD)',
    providerType: 'nad',
  },
  {
    id: 'chk_emp_1',
    category: 'employment',
    title: 'Current Employment & Corporate Verification',
    description: 'Corporate email handshake and recent payroll slip audit completed.',
    documentType: 'Pay Slip / Corporate Domain Verification',
    providerName: 'Corporate HR Verifier',
    providerType: 'corporate_hr',
  },
  {
    id: 'chk_addr_1',
    category: 'address',
    title: 'Residential Address Verification',
    description: 'Current address confirmed via utility bill or Aadhaar address hash.',
    documentType: 'Electricity / Bank Statement / Passport',
    providerName: 'Address Verification Registry',
    providerType: 'digilocker',
  },
  {
    id: 'chk_mar_1',
    category: 'marital_status',
    title: 'Marital Status Declaration & Audit',
    description: 'Self-declaration affirmed under legal oath, with Registrar of Marriages registry check where available.',
    documentType: 'Signed Legal Affirmation',
    providerName: 'ChaanBean Legal Registry Desk',
    providerType: 'self_affirmed',
  },
  {
    id: 'chk_div_1',
    category: 'marital_status',
    title: 'Divorce Decree & Case Audit (If Divorced)',
    description: 'Certified copy of decree (e.g. Section 13B Hindu Marriage Act) and CNR court verification.',
    documentType: 'Certified Court Decree Copy',
    providerName: 'Family Court / eCourts CNR Desk',
    providerType: 'ecourts',
    isOptional: true,
  },
  {
    id: 'chk_crt_1',
    category: 'court',
    title: 'Public Court Record Screening',
    description: 'Search conducted on eCourts public civil and criminal litigation indexes using party name and CNR.',
    documentType: 'eCourts Public Search Query',
    providerName: 'eCourts Public Information Index',
    providerType: 'ecourts',
  },
  {
    id: 'chk_pol_1',
    category: 'police',
    title: 'Police Antecedent Clearance (NOC)',
    description: 'Manual Police Clearance Certificate (PCC) issued by local jurisdiction or Passport Seva Kendra.',
    documentType: 'Police Clearance Certificate (PCC)',
    providerName: 'Jurisdictional Police Commissionerate',
    providerType: 'manual_noc',
    isOptional: true,
  },
  {
    id: 'chk_cst_1',
    category: 'caste_community',
    title: 'Caste / Community Certificate (Optional)',
    description: 'User-controlled community certificate. Strictly private by default unless chosen to share.',
    documentType: 'Competent Authority Certificate',
    providerName: 'Revenue Department Depository',
    providerType: 'self_affirmed',
    isOptional: true,
  },
  {
    id: 'chk_inc_1',
    category: 'income',
    title: 'Income & Tax Return Verification (Optional)',
    description: 'Form 16 or ITR acknowledgment audit. Exact salary numbers are never disclosed.',
    documentType: 'ITR Acknowledgment / Form 16',
    providerName: 'Income Tax e-Filing Verification',
    providerType: 'corporate_hr',
    isOptional: true,
  },
  {
    id: 'chk_ref_1',
    category: 'references',
    title: 'Consent-Based Character References (Optional)',
    description: 'Confidential statements verified with 2 known colleagues or family elders.',
    documentType: 'Reference Contact Details',
    providerName: 'ChaanBean Community Trust Desk',
    providerType: 'self_affirmed',
    isOptional: true,
  },
];

export const ChaanBeanService = {
  // Execute public eCourts CNR search simulation with strict safe wording
  performCourtScreening(
    fullName: string,
    state: string,
    district: string,
    year: string,
    cnrNumber?: string
  ): CourtScreeningResult {
    const isMockMatch = cnrNumber?.toUpperCase().includes('DISPUTE');

    if (isMockMatch) {
      return {
        cnrNumber: cnrNumber || 'MHPU010049212024',
        state,
        district,
        year: year || '2024',
        queryName: fullName,
        searchDate: new Date().toISOString().split('T')[0],
        matchingRecordsCount: 1,
        resultSummary: '1 matching case reference identified in public court indexes.',
        caveatNote: 'Review Required: Matching record identified. Users are advised to review case details with legal counsel. ChaanBean does not draw conclusions of guilt or character.',
      };
    }

    return {
      cnrNumber: cnrNumber || 'Not Specified',
      state,
      district,
      year: year || '2026',
      queryName: fullName,
      searchDate: new Date().toISOString().split('T')[0],
      matchingRecordsCount: 0,
      resultSummary: 'No matching public court record identified in queried indexes.',
      caveatNote: 'IMPORTANT LIMITATION: "No matching public court record identified" is not conclusive proof that no legal case exists. Regional digitizations vary by jurisdiction, and name-only queries have coverage constraints.',
    };
  },

  // Generate unique audit entry
  createAuditEntry(
    action: AuditLogEntry['action'],
    checkTitle: string,
    details: string,
    previousStatus?: VerificationState,
    newStatus?: VerificationState,
    actor: string = 'User (Self)'
  ): AuditLogEntry {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: formatted,
      action,
      checkTitle,
      actor,
      details,
      previousStatus,
      newStatus,
    };
  },

  // Record Consent
  createConsentRecord(checkId: string, purpose: string, scope: string): ConsentRecord {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    return {
      id: `cst_${Date.now()}`,
      checkId,
      purpose,
      grantedAt: formatted,
      scope,
      version: '2.2',
      isRevoked: false,
    };
  },
};
