// Phase 4: Go-Live Diagnostics, Fuzzy Name Matching & Verification Lifecycle UI
// Provides interactive tools for fuzzy Indian naming reconciliation, statutory age enforcement,
// DPDP Section 6(4) consent downgrade lifecycle, and full profile health diagnostics.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FuzzyNameMatcher, 
  FuzzyNameMatchResult 
} from '../../services/backend/lifecycle/fuzzyNameMatcher';
import { 
  VerificationLifecycleService, 
  ProfileDiagnosticReport 
} from '../../services/backend/lifecycle/verificationLifecycleService';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Scale, 
  UserCheck, 
  RefreshCw, 
  Play, 
  Info, 
  ArrowRight, 
  Lock, 
  Sliders, 
  Activity,
  Award,
  BookOpen
} from 'lucide-react';

export const VerificationDiagnosticsPanel: React.FC = () => {
  const { currentUser, showToast } = useApp();

  // 1. Fuzzy Name Matching State
  const [profileNameInput, setProfileNameInput] = useState('Dr. Ananya Sen');
  const [docNameInput, setDocNameInput] = useState('Ananya S.');
  const [matchResult, setMatchResult] = useState<FuzzyNameMatchResult>(() =>
    FuzzyNameMatcher.matchNames('Dr. Ananya Sen', 'Ananya S.')
  );

  // 2. Statutory Legal Age State
  const [testDob, setTestDob] = useState('1998-05-15');
  const [testGender, setTestGender] = useState<'male' | 'female'>('male');
  const [ageCheckResult, setAgeCheckResult] = useState(() =>
    VerificationLifecycleService.validateVerifiedAadhaarAge('1998-05-15', 'male')
  );

  // 3. Profile Diagnostic Report State
  const [diagnosticReport, setDiagnosticReport] = useState<ProfileDiagnosticReport>(() =>
    VerificationLifecycleService.runProfileDiagnostics(currentUser)
  );
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Legal Charter Tab
  const legalDisclaimers = VerificationLifecycleService.getStatutoryLegalDisclaimers();

  // Handle Name Match Change
  const handleCalculateMatch = (pName: string, dName: string) => {
    setProfileNameInput(pName);
    setDocNameInput(dName);
    const res = FuzzyNameMatcher.matchNames(pName, dName);
    setMatchResult(res);
  };

  // Preset Name Scenarios
  const handleApplyNamePreset = (pName: string, dName: string) => {
    handleCalculateMatch(pName, dName);
    showToast('Name Preset Applied', `Comparing "${pName}" against "${dName}"`, 'info');
  };

  // Handle Age Check Change
  const handleCalculateAge = (dob: string, gender: 'male' | 'female') => {
    setTestDob(dob);
    setTestGender(gender);
    const res = VerificationLifecycleService.validateVerifiedAadhaarAge(dob, gender);
    setAgeCheckResult(res);
  };

  // Run Fresh Diagnostics
  const handleRunFullDiagnostics = () => {
    setIsRunningDiagnostics(true);
    setTimeout(() => {
      const report = VerificationLifecycleService.runProfileDiagnostics(currentUser);
      setDiagnosticReport(report);
      setIsRunningDiagnostics(false);
      showToast('Profile Diagnostics Complete', `Go-Live Health Score: ${report.overallHealthScore}% (${report.checksPassed}/${report.checksTotal} passed)`, 'success');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2E1065 0%, #4C1D95 100%)',
          border: '1px solid #6D28D9',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#DDD6FE', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          <Activity size={16} color="#A78BFA" />
          <span>ChaanBean Trust Engine • Phase 4 Production Go-Live & Verification Diagnostics</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.6rem' }}>
          Identity Reconciliation, Fuzzy Matcher & Consent Lifecycle
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#E9D5FF', lineHeight: 1.6, maxWidth: '840px', marginBottom: '1.25rem' }}>
          In India, citizen names often carry honorifics (<em>Dr.</em>, <em>Adv.</em>, <em>CA</em>) or initials across DigiLocker, PAN, and passport registries. 
          Phase 4 provides automated fuzzy reconciliation, statutory age enforcement under the Hindu & Special Marriage Acts, 
          and DPDP Section 6(4) instant badge downgrade lifecycle management.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#FFFFFF' }}>
            <Sparkles size={14} color="#C4B5FD" />
            <span>Indian Honorific & Initials Stripping</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#FFFFFF' }}>
            <Scale size={14} color="#C4B5FD" />
            <span>Statutory Marriage Age Enforcement (18F / 21M)</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#FFFFFF' }}>
            <ShieldCheck size={14} color="#C4B5FD" />
            <span>Section 79 IT Act Safe Harbor Disclaimers</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE FUZZY NAME MATCHING BENCH */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#7C3AED" />
              <span>Fuzzy Indian Name Reconciliation Bench</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Test how the engine reconciles candidate profile names against official government IDs (Aadhaar, Passport, Medical Council).
            </p>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              onClick={() => handleApplyNamePreset('Dr. Ananya Sen', 'Ananya Sen')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
            >
              Preset: Honorific (Dr.)
            </button>
            <button
              onClick={() => handleApplyNamePreset('Dr. Ananya Sen', 'Ananya S.')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
            >
              Preset: Initial Expansion (S.)
            </button>
            <button
              onClick={() => handleApplyNamePreset('Rohan Deshmukh', 'Deshmukh Rohan')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
            >
              Preset: Transposed Order
            </button>
            <button
              onClick={() => handleApplyNamePreset('Vikram Malhotra', 'Rahul Verma')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', borderColor: '#FCA5A5', color: '#DC2626' }}
            >
              Preset: Mismatch
            </button>
          </div>
        </div>

        {/* Input Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Candidate Matrimonial Profile Name
            </label>
            <input
              type="text"
              className="input-field"
              value={profileNameInput}
              onChange={(e) => handleCalculateMatch(e.target.value, docNameInput)}
              placeholder="e.g. Dr. Ananya Sen"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Verified Government Document / Registry Name
            </label>
            <input
              type="text"
              className="input-field"
              value={docNameInput}
              onChange={(e) => handleCalculateMatch(profileNameInput, e.target.value)}
              placeholder="e.g. Ananya S."
            />
          </div>
        </div>

        {/* Results Card */}
        <div
          style={{
            background: matchResult.tier === 'exact' ? '#F0FDF4' : matchResult.tier === 'high_confidence' ? '#F5F3FF' : matchResult.tier === 'manual_review_required' ? '#FFFBEB' : '#FEF2F2',
            border: `1px solid ${matchResult.tier === 'exact' ? '#BBF7D0' : matchResult.tier === 'high_confidence' ? '#DDD6FE' : matchResult.tier === 'manual_review_required' ? '#FDE68A' : '#FECACA'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {matchResult.tier === 'exact' || matchResult.tier === 'high_confidence' ? (
                <CheckCircle2 size={22} color={matchResult.tier === 'exact' ? '#16A34A' : '#7C3AED'} />
              ) : matchResult.tier === 'manual_review_required' ? (
                <AlertTriangle size={22} color="#D97706" />
              ) : (
                <XCircle size={22} color="#DC2626" />
              )}
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    background: matchResult.tier === 'exact' ? '#DCFCE7' : matchResult.tier === 'high_confidence' ? '#EDE9FE' : matchResult.tier === 'manual_review_required' ? '#FEF3C7' : '#FEE2E2',
                    color: matchResult.tier === 'exact' ? '#15803D' : matchResult.tier === 'high_confidence' ? '#6D28D9' : matchResult.tier === 'manual_review_required' ? '#B45309' : '#B91C1C',
                  }}
                >
                  {matchResult.tier.replace(/_/g, ' ')} ({matchResult.score}% SIMILARITY)
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                  {matchResult.isAcceptableForAutoVerification ? 'Approved for Auto-Badge' : 'Flagged for Review / Rejection'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Normalized: <strong>"{matchResult.normalizedProfileName}"</strong> vs <strong>"{matchResult.normalizedDocumentName}"</strong>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {matchResult.diagnostics}
          </p>

          {matchResult.extractedHonorifics.length > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#6D28D9', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info size={14} />
              <span>Stripped honorific token(s): <strong>{matchResult.extractedHonorifics.join(', ')}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: STATUTORY MARRIAGE AGE POLICY ENFORCEMENT */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Scale size={18} color="#059669" />
          <span>Statutory Marriage Age Policy Simulator</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Indian marriage laws (Hindu Marriage Act 1955, Special Marriage Act 1954, Prohibition of Child Marriage Act 2006) strictly mandate minimum age eligibility.
        </p>

        {/* Age Test Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Verified Date of Birth
            </label>
            <input
              type="date"
              className="input-field"
              value={testDob}
              onChange={(e) => handleCalculateAge(e.target.value, testGender)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Candidate Gender
            </label>
            <select
              className="input-field"
              value={testGender}
              onChange={(e) => handleCalculateAge(testDob, e.target.value as 'male' | 'female')}
            >
              <option value="female">Female (Statutory Minimum: 18 Years)</option>
              <option value="male">Male (Statutory Minimum: 21 Years)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={() => handleCalculateAge('2010-01-01', 'female')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.45rem 0.6rem' }}
            >
              Preset: Minor (16)
            </button>
            <button
              onClick={() => handleCalculateAge('2006-03-15', 'male')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.45rem 0.6rem' }}
            >
              Preset: Male 20 (Underage)
            </button>
            <button
              onClick={() => handleCalculateAge('1998-05-15', 'female')}
              className="btn btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.45rem 0.6rem', borderColor: '#15803D', color: '#15803D' }}
            >
              Preset: Eligible (28)
            </button>
          </div>
        </div>

        {/* Age Result */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            background: ageCheckResult.isEligible ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${ageCheckResult.isEligible ? '#86EFAC' : '#FCA5A5'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          {ageCheckResult.isEligible ? (
            <CheckCircle2 size={20} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <XCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: ageCheckResult.isEligible ? '#166534' : '#991B1B' }}>
              {ageCheckResult.isEligible ? 'STATUTORILY ELIGIBLE FOR MATRIMONIAL DISCOVERY' : 'STATUTORY ELIGIBILITY REJECTED'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Calculated Age: <strong>{ageCheckResult.calculatedAge} years</strong> • Statutory Threshold: <strong>{ageCheckResult.statutoryThreshold} years ({testGender})</strong>
            </div>
            {!ageCheckResult.isEligible && (
              <div style={{ fontSize: '0.78rem', color: '#B91C1C', marginTop: '0.35rem' }}>
                {ageCheckResult.rejectionReason}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: FULL PROFILE GO-LIVE DIAGNOSTIC SUITE */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#D97706" />
              <span>Candidate Discovery Readiness Diagnostics</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Real-time audit across legal age, cryptographic vault health, DPDP consent tokens, and non-defamatory judicial disclaimers.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: diagnosticReport.isDiscoveryReady ? '#DCFCE7' : '#FEF3C7',
                color: diagnosticReport.isDiscoveryReady ? '#166534' : '#92400E',
                border: `1px solid ${diagnosticReport.isDiscoveryReady ? '#86EFAC' : '#FDE68A'}`,
              }}
            >
              Overall Score: {diagnosticReport.overallHealthScore}% ({diagnosticReport.checksPassed}/{diagnosticReport.checksTotal} Passed)
            </div>

            <button
              onClick={handleRunFullDiagnostics}
              disabled={isRunningDiagnostics}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={14} className={isRunningDiagnostics ? 'spin' : ''} />
              <span>Rerun Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.9rem' }}>
          {diagnosticReport.diagnostics.map((item) => {
            const isPassed = item.status === 'passed';
            return (
              <div
                key={item.id}
                style={{
                  border: isPassed ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                  background: isPassed ? '#F8FCF9' : '#FFFDF7',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-burgundy-dark)' }}>
                      {item.title}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 size={16} color="#16A34A" />
                    ) : (
                      <AlertTriangle size={16} color="#D97706" />
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                    {item.details}
                  </p>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.03)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
                  {item.evidence}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: STATUTORY LEGAL CHARTER & SAFE HARBOR CAVEATS */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <BookOpen size={18} color="#2563EB" />
          <span>DPDP Act 2023 & Section 79 IT Act Statutory Legal Charter</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Mandatory compliance terms governing consent, purpose limitation, right to erasure, and intermediary safe harbor.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--color-burgundy-dark)' }}>Section 5 Notice & Purpose Limitation:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{legalDisclaimers.purposeNoticeSection5}</p>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--color-burgundy-dark)' }}>Section 6 Affirmative Consent & Revocation:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{legalDisclaimers.consentNoticeSection6}</p>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--color-burgundy-dark)' }}>Section 12 Right to Erasure & Decryption Key Purging:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{legalDisclaimers.erasureNoticeSection12}</p>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--color-burgundy-dark)' }}>Section 79 IT Act 2000 Safe Harbor Intermediary Protection:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{legalDisclaimers.itActSection79SafeHarbor}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
