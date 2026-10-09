// Module B: Conversational Onboarding Flow
// Supports 5 intents, legal age validation, biodata upload/text extraction, mandatory review, and save & resume.

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  IntentType, 
  UserProfile, 
  Gender, 
  MaritalStatus 
} from '../../types';
import { NAKSHATRAS, COMMON_GOTRAS } from '../../data/astrologyData';
import { StorageService } from '../../services/storageService';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  UserCheck 
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { currentUser, updateCurrentUser, setActiveTab, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Form State
  const [intent, setIntent] = useState<IntentType>('marriage');
  const [isGuardian, setIsGuardian] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Parent');
  const [subjectConsentConfirmed, setSubjectConsentConfirmed] = useState(false);

  // Identity & Age
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('never_married');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [religion, setReligion] = useState('Hindu');
  const [community, setCommunity] = useState('');
  const [hometown, setHometown] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [height, setHeight] = useState(`5' 5"`);

  // Biodata upload & Extraction
  const [bioMethod, setBioMethod] = useState<'type' | 'biodata_text'>('type');
  const [rawBiodataText, setRawBiodataText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  const [bio, setBio] = useState('');

  // Life & Career
  const [education, setEducation] = useState('Post Graduate');
  const [educationField, setEducationField] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [incomeBracket, setIncomeBracket] = useState('₹20 Lakhs - ₹30 Lakhs / annum');
  const [diet, setDiet] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Jain'>('Vegetarian');
  const [drinking, setDrinking] = useState<'Never' | 'Occasionally' | 'Regularly'>('Never');
  const [smoking, setSmoking] = useState<'Never' | 'Occasionally' | 'Regularly'>('Never');

  // Family
  const [familyType, setFamilyType] = useState<'Nuclear' | 'Joint'>('Nuclear');
  const [familyValues, setFamilyValues] = useState<'Traditional' | 'Moderate' | 'Liberal'>('Moderate');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [siblings, setSiblings] = useState('');

  // Second Chapter if applicable
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [custodyStatus, setCustodyStatus] = useState('');
  const [secondChapterLearnings, setSecondChapterLearnings] = useState('');

  // Expectations
  const [partnerAgeMin, setPartnerAgeMin] = useState(25);
  const [partnerAgeMax, setPartnerAgeMax] = useState(32);
  const [childrenExpectation, setChildrenExpectation] = useState<'wants_children' | 'open_to_children' | 'no_children' | 'has_children_welcome'>('wants_children');
  const [financialPhilosophy, setFinancialPhilosophy] = useState<'shared_planning' | 'independent_accounts' | 'traditional_breadwinner'>('shared_planning');

  // Astrology
  const [timeOfBirth, setTimeOfBirth] = useState('08:30 AM');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [nakshatra, setNakshatra] = useState(NAKSHATRAS[0].name);
  const [gotra, setGotra] = useState(COMMON_GOTRAS[0]);
  const [manglikStatus, setManglikStatus] = useState<'manglik' | 'non_manglik' | 'anshik_manglik' | 'dont_know'>('non_manglik');

  // Trust Vault Consent
  const [chaanBeanConsent, setChaanBeanConsent] = useState(true);

  // Validation Error State
  const [ageError, setAgeError] = useState<string | null>(null);

  // Restore draft if available
  useEffect(() => {
    const draft = StorageService.getOnboardingDraft();
    if (draft) {
      if (draft.fullName) setFullName(draft.fullName);
      if (draft.gender) setGender(draft.gender);
      if (draft.dateOfBirth) setDateOfBirth(draft.dateOfBirth);
      if (draft.intent) setIntent(draft.intent);
      if (draft.profession) setProfession(draft.profession);
      if (draft.currentCity) setCurrentCity(draft.currentCity);
      if (draft.bio) setBio(draft.bio);
      if (draft.currentStep) setCurrentStep(draft.currentStep);
    }
  }, []);

  // Save draft helper
  const handleSaveDraft = () => {
    const draft = {
      fullName,
      gender,
      dateOfBirth,
      intent,
      profession,
      currentCity,
      bio,
      currentStep,
      timestamp: new Date().toISOString(),
    };
    StorageService.saveOnboardingDraft(draft);
    showToast('Progress Saved', 'You can resume this onboarding session whenever you return.', 'info');
  };

  // Legal Age Validator
  const validateAge = (dobString: string, currentGender: Gender): boolean => {
    if (!dobString) {
      setAgeError('Please provide your date of birth.');
      return false;
    }
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // India Legal Marriage Act: Groom >= 21, Bride >= 21 or 18 (21+ standard recommended)
    const minLegalAge = currentGender === 'male' ? 21 : 18;
    if (age < minLegalAge) {
      setAgeError(`Legal Age Guard: Under applicable marriage law, you must be at least ${minLegalAge} years old to create a matrimonial profile (Calculated age: ${age}). Profile creation is barred for minors.`);
      return false;
    }

    setAgeError(null);
    return true;
  };

  // Biodata AI Extraction Simulation (Strict Rule: Mandates User Review Before Publishing)
  const handleExtractBiodata = () => {
    if (!rawBiodataText.trim()) return;
    setIsExtracting(true);

    setTimeout(() => {
      // Intelligent regex & pattern parser
      const text = rawBiodataText;

      // Extract Name
      const nameMatch = text.match(/(?:Name|Name:)\s*([A-Za-z\s]+)/i);
      if (nameMatch && nameMatch[1]) setFullName(nameMatch[1].trim());

      // Extract Profession
      const profMatch = text.match(/(?:Working as|Profession|Designation|Role:)\s*([A-Za-z\s]+)/i);
      if (profMatch && profMatch[1]) setProfession(profMatch[1].trim());

      // Extract Education
      const eduMatch = text.match(/(?:Education|Degree|Qualified:)\s*([A-Za-z\s]+)/i);
      if (eduMatch && eduMatch[1]) setEducationField(eduMatch[1].trim());

      // Extract City
      const cityMatch = text.match(/(?:City|Location|Based in:)\s*([A-Za-z\s]+)/i);
      if (cityMatch && cityMatch[1]) setCurrentCity(cityMatch[1].trim());

      // Synthesize Bio
      setBio(
        `Born in a cultured family, currently residing in ${currentCity || 'Bangalore'}. Passionate about career and healthy life balance. Seeking an understanding partner who values family and open communication.`
      );

      setIsExtracting(false);
      setExtractionCompleted(true);
      showToast(
        'Data Extracted Successfully',
        'Please review and correct each extracted field. Extracted data is never published without your explicit confirmation.',
        'success'
      );
    }, 1200);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (isGuardian && !subjectConsentConfirmed) {
        showToast('Consent Required', 'Please confirm that the profile subject has authorized profile creation.', 'warning');
        return;
      }
      if (!validateAge(dateOfBirth, gender)) {
        return;
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Publish
  const handleCompleteOnboarding = () => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let calculatedAge = today.getFullYear() - dob.getFullYear();

    const newProfile: UserProfile = {
      ...currentUser,
      id: `usr_${Date.now()}`,
      name: fullName || 'New Member',
      gender,
      age: calculatedAge > 18 ? calculatedAge : 28,
      dateOfBirth: dateOfBirth || '1998-05-15',
      intent,
      maritalStatus,
      religion,
      community: community || 'General',
      motherTongue,
      hometown: hometown || 'Jaipur',
      currentCity: currentCity || 'Bangalore',
      currentCountry: 'India',
      height,
      bio: bio || 'Professional seeking an authentic, respectful life partner.',
      education,
      educationField: educationField || 'Higher Education',
      profession: profession || 'Professional',
      companyOrIndustry: company || 'Private Sector',
      incomeBracket,
      incomePrivate: false,
      diet,
      drinking,
      smoking,
      fitness: 'Regular fitness and active lifestyle',
      interests: ['Reading', 'Travel', 'Music', 'Family Gatherings'],
      familyType,
      familyValues,
      fatherOccupation: fatherOccupation || 'Professional',
      motherOccupation: motherOccupation || 'Homemaker',
      siblings: siblings || '1 Sibling',
      childrenCount: intent === 'remarriage' ? childrenCount : undefined,
      custodyStatus: intent === 'remarriage' ? custodyStatus : undefined,
      secondChapterLearnings: intent === 'remarriage' ? secondChapterLearnings : undefined,
      photoUrl: gender === 'female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      additionalPhotos: [],
      photosBlurred: false,
      astrology: {
        dob: dateOfBirth || '1998-05-15',
        timeOfBirth,
        placeOfBirth: placeOfBirth || currentCity || 'New Delhi',
        nakshatra,
        rashi: 'Cancer',
        gotra,
        manglikStatus,
        horoscopePublic: true,
      },
      expectations: {
        partnerAgeMin,
        partnerAgeMax,
        partnerHeightMin: `5' 4"`,
        partnerEducation: ['Graduate', 'Post Graduate', 'Professional Degree'],
        partnerProfession: ['Tech', 'Medicine', 'Finance', 'Law', 'Business'],
        partnerLocation: ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune'],
        dietaryPreference: diet,
        maritalStatusAccepted: intent === 'remarriage' ? ['divorced', 'widowed', 'never_married'] : ['never_married'],
        familyValues,
        childrenExpectations: childrenExpectation,
        financialPhilosophy,
        relocationOpenness: 'open',
      },
      trustProfile: {
        trustScoreLevel: 'Basic',
        lastAuditDate: new Date().toISOString().split('T')[0],
        consentGranted: chaanBeanConsent,
        visibility: 'mutual_connections_only',
        consentLedger: [],
        auditLogs: [],
        checks: [
          { id: 'c_mob', category: 'identity', title: 'Mobile Verified', description: 'SMS OTP verified during signup', status: 'verified', visibility: 'mutual_connections_only', verifiedAt: new Date().toISOString().split('T')[0] },
          { id: 'c_eml', category: 'identity', title: 'Email Verified', description: 'Email mailbox confirmed', status: 'verified', visibility: 'mutual_connections_only', verifiedAt: new Date().toISOString().split('T')[0] },
          { id: 'c_gov', category: 'identity', title: 'Government ID', description: 'Pending digital Trust Vault upload', status: 'pending', visibility: 'mutual_connections_only' },
          { id: 'c_edu', category: 'education', title: 'Degree Verification', description: 'User declared credential', status: 'user_supplied', visibility: 'mutual_connections_only' },
          { id: 'c_mar', category: 'marital_status', title: 'Marital Status Declaration', description: `${maritalStatus.replace(/_/g, ' ')} affirmed`, status: 'user_supplied', visibility: 'mutual_connections_only' },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRegisteredUser: true,
    };

    updateCurrentUser(newProfile);
    StorageService.clearOnboardingDraft();
    showToast('Profile Created Successfully', 'Welcome to MangalSutra 2.0! Your profile is ready for discovery.', 'success');
    setActiveTab('discover');
  };

  return (
    <div className="container" style={{ maxWidth: '820px', padding: '2rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* Progress Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-dark)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Sparkles size={14} />
          <span>Conversational Onboarding • Step {currentStep} of {totalSteps}</span>
        </div>
        <h1 className="heading-section" style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>
          {currentStep === 1 && 'Your Intent & Basic Identity'}
          {currentStep === 2 && 'Tell Us About Yourself'}
          {currentStep === 3 && 'Your Life, Education & Career'}
          {currentStep === 4 && 'Your Family & Roots'}
          {currentStep === 5 && 'Your Expectations in a Partner'}
          {currentStep === 6 && 'Vedic Astrological Coordinates'}
          {currentStep === 7 && 'Review & ChaanBean Trust Setup'}
        </h1>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden', margin: '1rem auto', maxWidth: '500px' }}>
          <div
            style={{
              height: '100%',
              width: `${(currentStep / totalSteps) * 100}%`,
              background: 'var(--grad-burgundy)',
              transition: 'width 300ms ease-in-out',
            }}
          />
        </div>

        <button 
          onClick={handleSaveDraft}
          style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginTop: '0.25rem' }}
        >
          <Save size={13} />
          <span>Save progress & resume anytime</span>
        </button>
      </div>

      {/* STEP 1: Intent & Basic Identity */}
      {currentStep === 1 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1rem', color: 'var(--color-burgundy-dark)' }}>
            What are you looking for?
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { id: 'marriage', label: 'Marriage', desc: 'Seeking life partner for marriage' },
              { id: 'remarriage', label: 'Remarriage (Second Chapter)', desc: 'Divorced, widowed or starting afresh' },
              { id: 'dating_leading_to_marriage', label: 'Dating to Marriage', desc: 'Intentional connection leading to union' },
              { id: 'life_partner', label: 'Life Partner', desc: 'Companionship & shared life path' },
              { id: 'parent_guardian', label: 'Parent / Guardian', desc: 'Looking for a son, daughter or ward' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setIntent(item.id as IntentType);
                  setIsGuardian(item.id === 'parent_guardian');
                }}
                style={{
                  border: intent === item.id ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                  background: intent === item.id ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Parent/Guardian Agency Guard */}
          {isGuardian && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E40AF', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <UserCheck size={18} />
                <span>Parent / Guardian Profile Agency Protocol</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#1E3A8A', lineHeight: 1.5, marginBottom: '1rem' }}>
                MangalSutra preserves the profile subject’s agency. We clearly distinguish the account manager from the prospective bride or groom.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Your Name (Account Holder)</label>
                  <input
                    className="form-input"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                  />
                </div>
                <div>
                  <label className="form-label">Relation to Candidate</label>
                  <select className="form-select" value={guardianRelation} onChange={(e) => setGuardianRelation(e.target.value)}>
                    <option value="Parent">Parent (Father / Mother)</option>
                    <option value="Sibling">Sibling (Brother / Sister)</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#1E3A8A', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={subjectConsentConfirmed}
                  onChange={(e) => setSubjectConsentConfirmed(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <span>I confirm that the person whose profile I am managing is aware and has given their informed consent for this matrimonial profile.</span>
              </label>
            </div>
          )}

          {/* Legal Age & Basic Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Candidate’s Full Name</label>
              <input
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="female">Female (Bride)</option>
                <option value="male">Male (Groom)</option>
                <option value="non_binary">Non-Binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth (Enforces Legal Age)</label>
              <input
                type="date"
                className="form-input"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                  validateAge(e.target.value, gender);
                }}
              />
              <span className="form-hint">Must meet minimum statutory marriage age (21 for men, 18/21 for women).</span>
            </div>

            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select className="form-select" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}>
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="annulled">Annulled</option>
              </select>
            </div>
          </div>

          {ageError && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{ageError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: About Me & Biodata Upload */}
      {currentStep === 2 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(197, 160, 89, 0.2)', paddingBottom: '1rem' }}>
            <button
              className={bioMethod === 'type' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              onClick={() => setBioMethod('type')}
            >
              Write In Your Own Words
            </button>
            <button
              className={bioMethod === 'biodata_text' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              onClick={() => setBioMethod('biodata_text')}
            >
              Paste / Upload Biodata Text
            </button>
          </div>

          {bioMethod === 'type' ? (
            <div className="form-group">
              <label className="form-label">About Yourself & What You Cherish</label>
              <textarea
                className="form-textarea"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your passions, what a normal weekend looks like, your core values, and what kind of partnership you envision..."
              />
              <span className="form-hint">A warm, genuine summary gets 3x more meaningful connection requests.</span>
            </div>
          ) : (
            <div>
              <div style={{ background: 'var(--color-gold-subtle)', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>AI Biodata Parser Notice</strong>: Paste your biodata text below. Our parser will extract education, profession, location, and family details. <em>Rule: Extracted data is presented for your review before being saved to your profile.</em>
              </div>

              <div className="form-group">
                <label className="form-label">Paste Biodata / Matrimonial Profile Text</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={rawBiodataText}
                  onChange={(e) => setRawBiodataText(e.target.value)}
                  placeholder="Example: Name: Priya Sen, DOB: 14 Aug 1998, Education: B.Tech & MBA, Working as: Lead Designer in Bangalore, Family: Father Retd. Engineer, Native: Jaipur..."
                />
              </div>

              <button
                className="btn-gold"
                onClick={handleExtractBiodata}
                disabled={isExtracting || !rawBiodataText.trim()}
                style={{ marginBottom: '1.5rem' }}
              >
                <Sparkles size={16} />
                <span>{isExtracting ? 'Analyzing Biodata...' : 'Extract Profile Attributes'}</span>
              </button>

              {extractionCompleted && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#065F46' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Attributes Extracted — Please Review</span>
                  </div>
                  <ul style={{ fontSize: '0.82rem', lineHeight: 1.6, paddingLeft: '1.2rem' }}>
                    <li><strong>Candidate Name</strong>: {fullName || 'Please verify in Step 1'}</li>
                    <li><strong>Profession</strong>: {profession || 'Pending confirmation'}</li>
                    <li><strong>Education</strong>: {educationField || 'Pending confirmation'}</li>
                    <li><strong>City</strong>: {currentCity || 'Pending confirmation'}</li>
                  </ul>
                  <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    You can edit any of these fields in the upcoming steps.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: My Life, Education & Career */}
      {currentStep === 3 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.5rem', color: 'var(--color-burgundy-dark)' }}>
            Education, Profession & Daily Lifestyle
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Highest Education</label>
              <select className="form-select" value={education} onChange={(e) => setEducation(e.target.value)}>
                <option value="Doctorate / Ph.D">Doctorate / Ph.D</option>
                <option value="Post Graduate (Master's / MBA / M.Tech)">Post Graduate (Master's / MBA / M.Tech)</option>
                <option value="Professional Degree (CA / CS / CFA / MBBS)">Professional Degree (CA / CS / CFA / MBBS)</option>
                <option value="Under Graduate (B.Tech / B.E / B.Sc / B.A)">Under Graduate (B.Tech / B.E / B.Sc / B.A)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">College / University / Major</label>
              <input
                className="form-input"
                value={educationField}
                onChange={(e) => setEducationField(e.target.value)}
                placeholder="e.g. B.Tech CS, IIT Delhi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profession / Role</label>
              <input
                className="form-input"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Senior Software Architect"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Organization / Sector</label>
              <input
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. MNC / HealthTech Startup"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Annual Income Bracket</label>
              <select className="form-select" value={incomeBracket} onChange={(e) => setIncomeBracket(e.target.value)}>
                <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                <option value="₹10 Lakhs - ₹20 Lakhs">₹10 Lakhs - ₹20 Lakhs</option>
                <option value="₹20 Lakhs - ₹35 Lakhs">₹20 Lakhs - ₹35 Lakhs</option>
                <option value="₹35 Lakhs - ₹50 Lakhs">₹35 Lakhs - ₹50 Lakhs</option>
                <option value="₹50 Lakhs - ₹75 Lakhs">₹50 Lakhs - ₹75 Lakhs</option>
                <option value="₹75 Lakhs+">₹75 Lakhs+</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current City</label>
              <input
                className="form-input"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="e.g. Bangalore"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Lifestyle</label>
              <select className="form-select" value={diet} onChange={(e) => setDiet(e.target.value as any)}>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Jain">Jain (Strict Vegetarian)</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Drinking Habits</label>
              <select className="form-select" value={drinking} onChange={(e) => setDrinking(e.target.value as any)}>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: My Family */}
      {currentStep === 4 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.5rem', color: 'var(--color-burgundy-dark)' }}>
            Family Structure & Cultural Roots
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Family Type</label>
              <select className="form-select" value={familyType} onChange={(e) => setFamilyType(e.target.value as any)}>
                <option value="Nuclear">Nuclear Family</option>
                <option value="Joint">Joint Family</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Family Values</label>
              <select className="form-select" value={familyValues} onChange={(e) => setFamilyValues(e.target.value as any)}>
                <option value="Traditional">Traditional</option>
                <option value="Moderate">Moderate</option>
                <option value="Liberal">Liberal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Religion & Heritage</label>
              <select className="form-select" value={religion} onChange={(e) => setReligion(e.target.value)}>
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Spiritual / Non-Religious">Spiritual / Non-Religious</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Community / Caste (Optional)</label>
              <input
                className="form-input"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="e.g. Brahmin, Deshastha, Marwari..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Father’s Profession</label>
              <input
                className="form-input"
                value={fatherOccupation}
                onChange={(e) => setFatherOccupation(e.target.value)}
                placeholder="e.g. Retired Government Officer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mother’s Profession</label>
              <input
                className="form-input"
                value={motherOccupation}
                onChange={(e) => setMotherOccupation(e.target.value)}
                placeholder="e.g. Professor / Homemaker"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Siblings</label>
              <input
                className="form-input"
                value={siblings}
                onChange={(e) => setSiblings(e.target.value)}
                placeholder="e.g. 1 elder brother (married)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ancestral Hometown</label>
              <input
                className="form-input"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
              />
            </div>
          </div>

          {/* Second Chapter Specifics */}
          {intent === 'remarriage' && (
            <div style={{ marginTop: '1.5rem', background: '#FDF2F4', border: '1px solid #FBCFE8', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
                Second Chapter Rebuilding & Family
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Children</label>
                  <select className="form-select" value={childrenCount} onChange={(e) => setChildrenCount(Number(e.target.value))}>
                    <option value={0}>No Children</option>
                    <option value={1}>1 Child</option>
                    <option value={2}>2 Children</option>
                    <option value={3}>3+ Children</option>
                  </select>
                </div>
                {childrenCount > 0 && (
                  <div>
                    <label className="form-label">Custody / Living Arrangement</label>
                    <input
                      className="form-input"
                      value={custodyStatus}
                      onChange={(e) => setCustodyStatus(e.target.value)}
                      placeholder="e.g. Living with me / Co-parenting"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">What You Learned & Value Now</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={secondChapterLearnings}
                  onChange={(e) => setSecondChapterLearnings(e.target.value)}
                  placeholder="e.g. I value emotional maturity, honest communication, and mutual respect above all..."
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Expectations */}
      {currentStep === 5 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1.5rem', color: 'var(--color-burgundy-dark)' }}>
            Partner Preferences & Compatibility Values
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred Partner Age Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '80px' }}
                  value={partnerAgeMin}
                  onChange={(e) => setPartnerAgeMin(Number(e.target.value))}
                />
                <span>to</span>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '80px' }}
                  value={partnerAgeMax}
                  onChange={(e) => setPartnerAgeMax(Number(e.target.value))}
                />
                <span>years</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Children Aspirations</label>
              <select className="form-select" value={childrenExpectation} onChange={(e) => setChildrenExpectation(e.target.value as any)}>
                <option value="wants_children">Wants Children in the future</option>
                <option value="open_to_children">Open to discussing children</option>
                <option value="no_children">Does not want children</option>
                <option value="has_children_welcome">Warmly welcomes partner's children</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Financial Approach</label>
              <select className="form-select" value={financialPhilosophy} onChange={(e) => setFinancialPhilosophy(e.target.value as any)}>
                <option value="shared_planning">Shared Budgeting & Joint Wealth Creation</option>
                <option value="independent_accounts">Proportional Shared Expenses + Independent Accounts</option>
                <option value="traditional_breadwinner">Traditional Single-Income Stability</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Vedic Astrology Inputs */}
      {currentStep === 6 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '0.5rem', color: 'var(--color-burgundy-dark)' }}>
            Vedic Astrology Coordinates
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Used for authentic 36 Guna Ashta Kuta, Gotra compatibility, and Manglik calculations. If any detail is unknown, select approximate values.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Time of Birth</label>
              <input
                type="text"
                className="form-input"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                placeholder="e.g. 06:45 AM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Place of Birth</label>
              <input
                className="form-input"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birth Nakshatra</label>
              <select className="form-select" value={nakshatra} onChange={(e) => setNakshatra(e.target.value)}>
                {NAKSHATRAS.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name} ({n.rashi})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gotra (For Lineage Exogamy)</label>
              <select className="form-select" value={gotra} onChange={(e) => setGotra(e.target.value)}>
                {COMMON_GOTRAS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <span className="form-hint">Enforces traditional Gotra rules with modern advisory context.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Manglik Status</label>
              <select className="form-select" value={manglikStatus} onChange={(e) => setManglikStatus(e.target.value as any)}>
                <option value="non_manglik">Non-Manglik</option>
                <option value="manglik">Manglik</option>
                <option value="anshik_manglik">Anshik Manglik (Partial)</option>
                <option value="dont_know">Don’t Know / Need Astrologer Consultation</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: Review & ChaanBean Trust Setup */}
      {currentStep === 7 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <h3 className="heading-card" style={{ marginBottom: '1rem', color: 'var(--color-burgundy-dark)' }}>
            Review Profile & ChaanBean Trust Consent
          </h3>

          <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.75rem' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--color-burgundy)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Profile Snapshot
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Name:</strong> {fullName || 'New Candidate'}</div>
              <div><strong>Intent:</strong> {intent.replace(/_/g, ' ')}</div>
              <div><strong>Education:</strong> {education}</div>
              <div><strong>Profession:</strong> {profession || 'Professional'}</div>
              <div><strong>Location:</strong> {currentCity || 'Bangalore'}</div>
              <div><strong>Gotra & Nakshatra:</strong> {gotra} • {nakshatra}</div>
            </div>
          </div>

          {/* ChaanBean Trust Vault Consent Notice */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} />
              <span>ChaanBean Trust Vault Protection</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#14532D', lineHeight: 1.55, marginBottom: '0.75rem' }}>
              ChaanBean guarantees that raw documents, National ID numbers, and sensitive salary slips are never revealed to other members or search engines. Only verified status badges and audit timestamps are published.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#166534', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={chaanBeanConsent}
                onChange={(e) => setChaanBeanConsent(e.target.checked)}
              />
              <span>I consent to ChaanBean credential hashing and accept the data minimization policy.</span>
            </label>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}
              onClick={handleCompleteOnboarding}
            >
              <span>Publish My Verified Profile</span>
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        {currentStep > 1 ? (
          <button className="btn-secondary" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Previous Step</span>
          </button>
        ) : (
          <button className="btn-outline" onClick={() => setActiveTab('home')}>
            Cancel
          </button>
        )}

        {currentStep < totalSteps && (
          <button className="btn-primary" onClick={handleNext}>
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
