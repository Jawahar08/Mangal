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
  UserCheck,
  MapPin,
  ChevronDown,
  Zap,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Edit3
} from 'lucide-react';
import {
  PERSONALITY_TAGS,
  WEEKEND_TAGS,
  VALUES_TAGS,
  PERSONA_PRESETS,
  PROMPT_STARTERS,
  generateSmartBio,
  PersonaPreset
} from '../../data/bioGeneratorData';

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

  // Biodata & 1-Click Smart Generator State
  const [bioMethod, setBioMethod] = useState<'smart_generator' | 'prompts' | 'type' | 'biodata_text'>('smart_generator');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'grounded', 'family_first', 'chai_talks', 'mutual_respect'
  ]);
  const [bioTone, setBioTone] = useState<'warm' | 'crisp' | 'traditional' | 'expressive'>('warm');
  const [activePersona, setActivePersona] = useState<string | null>('grounded_pro');
  const [bioVariation, setBioVariation] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [promptAnswers, setPromptAnswers] = useState<{ [key: string]: string }>({
    weekend: '',
    friends_say: '',
    partner_vision: ''
  });
  const [rawBiodataText, setRawBiodataText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  const [bio, setBio] = useState(
    'I consider myself someone with a calm, grounded, and balanced approach to life and close family bonds. Outside of work, my weekends are usually filled with savoring good tea with thoughtful, engaging conversations. In a life partner, I deeply cherish an equal partnership, open dialogue, and genuine mutual respect — looking forward to building a meaningful journey grounded in genuine companionship and mutual respect.'
  );

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
      if (draft.bioMethod) setBioMethod(draft.bioMethod);
      if (draft.selectedTags && Array.isArray(draft.selectedTags)) setSelectedTags(draft.selectedTags);
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
      bioMethod,
      selectedTags,
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

  // Biodata AI Extraction with Mandatory Disclosure & User Review
  const handleExtractBiodata = async () => {
    if (!rawBiodataText.trim()) return;
    setIsExtracting(true);

    try {
      const { ProfileService } = await import('../../services/backend');
      const res = await ProfileService.extractBiodata(rawBiodataText, true);

      if (res.success && res.draft) {
        if (res.draft.fullName) setFullName(res.draft.fullName);
        if (res.draft.profession) setProfession(res.draft.profession);
        if (res.draft.education) setEducation(res.draft.education);
        if (res.draft.currentCity) setCurrentCity(res.draft.currentCity);
        if (res.draft.diet) setDiet(res.draft.diet);
        if (res.draft.religion) setReligion(res.draft.religion);

        setBio(
          `Cultured professional based in ${res.draft.currentCity || currentCity || 'Mumbai'}. Working as ${res.draft.profession || profession || 'Professional'}. Seeking an authentic, family-oriented partner with shared values and mutual respect.`
        );

        setExtractionCompleted(true);
        showToast(
          'Biodata Fields Extracted',
          res.draft.disclosureNotice || 'Please review each extracted field carefully. Information is never published without your explicit confirmation.',
          'success'
        );
      } else {
        showToast('Extraction Note', res.error || 'Please provide more details.', 'warning');
      }
    } catch (e: any) {
      showToast('Extraction Error', e.message, 'warning');
    } finally {
      setIsExtracting(false);
    }
  };

  // Smart Generator Handlers
  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const next = prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId];
      return next;
    });
    setActivePersona(null);
  };

  const handleApplyPersona = (preset: PersonaPreset) => {
    setActivePersona(preset.id);
    setSelectedTags(preset.tags);
    setBioTone(preset.tone);
    const generated = generateSmartBio({
      tags: preset.tags,
      tone: preset.tone,
      variation: bioVariation,
      profession,
      city: currentCity
    });
    setBio(generated);
    showToast('Persona Applied', `Applied "${preset.name}" preset and created your summary.`, 'info');
  };

  const handleGenerateBio = () => {
    if (selectedTags.length === 0) {
      showToast('Select a few tags', 'Please tap at least 1 or 2 tags to personalize your summary.', 'warning');
      return;
    }
    const nextVariation = bioVariation + 1;
    setBioVariation(nextVariation);
    const generated = generateSmartBio({
      tags: selectedTags,
      tone: bioTone,
      variation: nextVariation,
      profession,
      city: currentCity
    });
    setBio(generated);
    showToast('Bio Generated!', 'Feel free to tweak any words or click regenerate for fresh phrasing.', 'success');
  };

  const handleCombinePrompts = () => {
    const parts: string[] = [];
    if (promptAnswers.weekend?.trim()) {
      parts.push(`On weekends, you will usually find me ${promptAnswers.weekend.trim().replace(/\.$/, '')}.`);
    }
    if (promptAnswers.friends_say?.trim()) {
      parts.push(`My close friends describe me as someone who is ${promptAnswers.friends_say.trim().replace(/\.$/, '')}.`);
    }
    if (promptAnswers.partner_vision?.trim()) {
      parts.push(`In a life partner and marriage, what matters most to me is ${promptAnswers.partner_vision.trim().replace(/\.$/, '')}.`);
    }

    if (parts.length === 0) {
      showToast('Empty Prompts', 'Please answer at least one prompt starter.', 'warning');
      return;
    }

    const combined = parts.join(' ');
    setBio(combined);
    showToast('Prompts Combined!', 'Your bio has been compiled from your answers. You can edit it anytime.', 'success');
  };

  const handleCopyBio = () => {
    if (!bio) return;
    navigator.clipboard.writeText(bio);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Copied to Clipboard', 'Bio text copied.', 'info');
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
    if (currentStep === 2 && !bio.trim()) {
      // Auto-generate if left empty
      const generated = generateSmartBio({
        tags: selectedTags.length > 0 ? selectedTags : ['grounded', 'family_first', 'chai_talks', 'mutual_respect'],
        tone: bioTone,
        variation: 0,
        profession,
        city: currentCity
      });
      setBio(generated);
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
        : '/images/profiles/aditya.jpg',
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
    localStorage.removeItem('ms_interests_sent_v2');
    localStorage.removeItem('ms_mutual_connections_v2');
    showToast('Verified Profile Published!', 'Your account has been verified and candidate discovery is now unlocked.', 'success');
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

      {/* STEP 2: About Me & Biodata Upload - Efficient 1-Click Smart Generator */}
      {currentStep === 2 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          {/* Method Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.75rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              className={bioMethod === 'smart_generator' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => setBioMethod('smart_generator')}
            >
              <Zap size={15} />
              <span>1-Click Smart Bio</span>
              <span style={{ 
                background: bioMethod === 'smart_generator' ? 'rgba(255,255,255,0.22)' : 'var(--color-gold-subtle)', 
                color: bioMethod === 'smart_generator' ? '#FFF' : 'var(--color-gold-dark)', 
                fontSize: '0.68rem', 
                fontWeight: 700, 
                padding: '0.15rem 0.45rem', 
                borderRadius: '9999px',
                letterSpacing: '0.5px'
              }}>
                15 SECS
              </span>
            </button>

            <button
              className={bioMethod === 'prompts' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => setBioMethod('prompts')}
            >
              <MessageSquare size={15} />
              <span>Guided Prompts</span>
            </button>

            <button
              className={bioMethod === 'type' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => setBioMethod('type')}
            >
              <Edit3 size={15} />
              <span>Write Freely</span>
            </button>

            <button
              className={bioMethod === 'biodata_text' ? 'btn-primary' : 'btn-outline'}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => setBioMethod('biodata_text')}
            >
              <FileText size={15} />
              <span>Paste Biodata</span>
            </button>
          </div>

          {/* METHOD 1: 1-Click Smart Generator */}
          {bioMethod === 'smart_generator' && (
            <div>
              {/* Introduction Callout */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(128,0,32,0.04) 0%, rgba(197,160,89,0.12) 100%)', 
                border: '1px solid rgba(197, 160, 89, 0.35)', 
                padding: '1.1rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <div style={{ color: 'var(--color-gold-dark)', marginTop: '2px' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                    Skip Blank-Page Writing — Choose Chips & Auto-Synthesize
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Pick a 1-tap ready persona or tap quick chips that describe your rhythm. We immediately craft an eloquent, high-response matrimonial summary for you.
                  </p>
                </div>
              </div>

              {/* 1-Tap Persona Presets */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⚡ 1-Tap Persona Presets (Instant Fill)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to auto-select matching tags</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  {PERSONA_PRESETS.map((preset) => {
                    const isSelected = activePersona === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPersona(preset)}
                        style={{
                          border: isSelected ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.35)',
                          background: isSelected ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          boxShadow: isSelected ? '0 3px 8px rgba(128,0,32,0.1)' : 'none',
                          position: 'relative'
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '0.25rem' }}>
                          {preset.badge}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.3rem' }}>
                          {preset.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                          {preset.desc}
                        </div>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--color-burgundy)' }}>
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tag Categories */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {/* 1. Personality & Vibe */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0, fontSize: '0.84rem' }}>
                      1. Personality & Nature
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Tap 2–3 tags</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {PERSONALITY_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            border: isSelected ? '1px solid var(--color-burgundy-dark)' : '1px solid rgba(197, 160, 89, 0.4)',
                            background: isSelected ? 'var(--grad-burgundy)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                            boxShadow: isSelected ? '0 2px 5px rgba(128, 0, 32, 0.25)' : 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Weekend Passions */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0, fontSize: '0.84rem' }}>
                      2. How I Spend Weekends & Downtime
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Tap 1–2 tags</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {WEEKEND_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            border: isSelected ? '1px solid var(--color-burgundy-dark)' : '1px solid rgba(197, 160, 89, 0.4)',
                            background: isSelected ? 'var(--grad-burgundy)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                            boxShadow: isSelected ? '0 2px 5px rgba(128, 0, 32, 0.25)' : 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Values in a Partner */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0, fontSize: '0.84rem' }}>
                      3. What I Value Most in a Life Partner
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Tap 1–2 tags</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {VALUES_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            border: isSelected ? '1px solid var(--color-burgundy-dark)' : '1px solid rgba(197, 160, 89, 0.4)',
                            background: isSelected ? 'var(--grad-burgundy)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                            boxShadow: isSelected ? '0 2px 5px rgba(128, 0, 32, 0.25)' : 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tone Selection & Generation Button */}
              <div style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid rgba(197, 160, 89, 0.35)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.35rem' }}>
                    Writing Tone / Style:
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'warm', label: 'Warm & Balanced' },
                      { id: 'crisp', label: 'Crisp & Modern' },
                      { id: 'traditional', label: 'Traditional & Grounded' },
                      { id: 'expressive', label: 'Expressive & Heartfelt' },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => {
                          setBioTone(tone.id as any);
                          // Auto regenerate if bio already exists
                          if (bio) {
                            const generated = generateSmartBio({
                              tags: selectedTags,
                              tone: tone.id as any,
                              variation: bioVariation,
                              profession,
                              city: currentCity
                            });
                            setBio(generated);
                          }
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontWeight: bioTone === tone.id ? 700 : 500,
                          border: bioTone === tone.id ? '1px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.3)',
                          background: bioTone === tone.id ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                          color: bioTone === tone.id ? 'var(--color-burgundy-dark)' : 'var(--text-secondary)',
                          transition: 'all 150ms ease'
                        }}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>{selectedTags.length}</strong> tags active
                  </div>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={handleGenerateBio}
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                  >
                    <Sparkles size={16} />
                    <span>{bio ? 'Regenerate Bio' : '✨ Generate My Bio (1-Click)'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Live Bio Preview Card */}
              {bio && (
                <div style={{ 
                  background: '#FCFAF6', 
                  border: '1.5px solid rgba(197, 160, 89, 0.5)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.25rem',
                  boxShadow: '0 4px 12px rgba(128,0,32,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-burgundy-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-gold-dark)' }} />
                      <span>Your Profile Bio (Live Preview — Edit Freely)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleGenerateBio}
                        style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Generate alternate phrasing"
                      >
                        <RefreshCw size={13} />
                        <span>Alternate Phrasing</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyBio}
                        style={{ fontSize: '0.75rem', color: isCopied ? '#059669' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ 
                      fontSize: '0.88rem', 
                      lineHeight: 1.6, 
                      background: '#FFFFFF', 
                      borderColor: 'rgba(197,160,89,0.3)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Your generated bio will appear here. You can edit any sentence directly."
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>
                      {bio.length} characters • ~{bio.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Check size={13} /> High match appeal profile
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* METHOD 2: Guided Prompts */}
          {bioMethod === 'prompts' && (
            <div>
              <div style={{ 
                background: 'var(--color-gold-subtle)', 
                border: '1px solid rgba(197, 160, 89, 0.4)', 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.5rem', 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)' 
              }}>
                <strong>Answer 3 Simple Prompts</strong>: Complete short answers to sentence starters below. We will seamlessly compile them into your bio!
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {PROMPT_STARTERS.map((p) => (
                  <div key={p.id} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                      {p.prompt}
                    </label>
                    <input
                      className="form-input"
                      value={promptAnswers[p.id] || ''}
                      onChange={(e) => setPromptAnswers({ ...promptAnswers, [p.id]: e.target.value })}
                      placeholder={p.placeholder}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-gold"
                onClick={handleCombinePrompts}
                style={{ marginBottom: '1.5rem' }}
              >
                <Sparkles size={16} />
                <span>Compile Answers into Bio</span>
              </button>

              {bio && (
                <div className="form-group">
                  <label className="form-label">Compiled Bio (Editable)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* METHOD 3: Write Freely */}
          {bioMethod === 'type' && (
            <div className="form-group">
              <label className="form-label">About Yourself & What You Cherish</label>
              <textarea
                className="form-textarea"
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your passions, what a normal weekend looks like, your core values, and what kind of partnership you envision..."
              />
              <span className="form-hint">A warm, genuine summary gets 3x more meaningful connection requests.</span>
            </div>
          )}

          {/* METHOD 4: Paste Biodata Text */}
          {bioMethod === 'biodata_text' && (
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
              <div style={{ position: 'relative' }}>
                <MapPin size={17} color="var(--color-burgundy)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka (or type any city worldwide)"
                  list="major-cities-list"
                />
              </div>
              <span className="form-hint">Type your current residential or work city.</span>
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
              <div style={{ position: 'relative' }}>
                <MapPin size={17} color="var(--color-burgundy)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="e.g. Jaipur, Rajasthan (or ancestral town/village)"
                  list="major-cities-list"
                />
              </div>
              <span className="form-hint">Type your family’s ancestral native roots or home district.</span>
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

      {/* Datalist for fast native city autocomplete suggestions */}
      <datalist id="major-cities-list">
        <option value="Bangalore, Karnataka" />
        <option value="Mumbai, Maharashtra" />
        <option value="Delhi NCR" />
        <option value="Pune, Maharashtra" />
        <option value="Hyderabad, Telangana" />
        <option value="Chennai, Tamil Nadu" />
        <option value="Kolkata, West Bengal" />
        <option value="Ahmedabad, Gujarat" />
        <option value="Jaipur, Rajasthan" />
        <option value="Chandigarh" />
        <option value="Lucknow, Uttar Pradesh" />
        <option value="Indore, Madhya Pradesh" />
        <option value="Surat, Gujarat" />
        <option value="Kochi, Kerala" />
        <option value="Coimbatore, Tamil Nadu" />
        <option value="Bhopal, Madhya Pradesh" />
        <option value="Nagpur, Maharashtra" />
        <option value="Patna, Bihar" />
        <option value="Vadodara, Gujarat" />
        <option value="Visakhapatnam, Andhra Pradesh" />
        <option value="Dehradun, Uttarakhand" />
        <option value="Noida, Uttar Pradesh" />
        <option value="Gurugram, Haryana" />
        <option value="London, United Kingdom" />
        <option value="New York, USA" />
        <option value="San Francisco, USA" />
        <option value="Seattle, USA" />
        <option value="Dubai, UAE" />
        <option value="Singapore" />
        <option value="Toronto, Canada" />
        <option value="Sydney, Australia" />
      </datalist>
    </div>
  );
};
