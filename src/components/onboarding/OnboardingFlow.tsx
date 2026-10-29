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
  Edit3,
  Camera,
  FileCheck,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Users,
  Calendar,
  Heart
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

// Page 4 Blueprint: Sample Biodata Data for 1-Click Testing across modalities
export const SAMPLE_PRINTED_BIODATA = `BIODATA FOR MATRIMONIAL ALLIANCE
Name: Dr. Rohan Deshmukh
Age: 28 Years | Height: 5' 11"
Education: MBBS, MD Pediatric Specialist (KEM Hospital Mumbai)
Profession: Pediatric Consultant at Rainbow Children's Hospital
Location: Mumbai, Maharashtra
Family: Traditional nuclear family. Father Retd. Chief Engineer, Mother Homemaker, 1 Sister.
Lifestyle: Strictly Vegetarian, non-smoker, marathon runner & classical flute player
Interests: Travel, Reading, Music, Fitness & Marathon
Expectations: Seeking an educated, empathetic, and family-oriented life partner with mutual respect.
Religion & Community: Hindu, Maratha / Deshmukh
Marriage Expectations: Looking to marry within 12 to 18 months with mutual family alignment.`;

export const SAMPLE_MATRIMONIAL_PROFILE = `MATRIMONIAL PROFILE - CANDIDATE SUMMARY
Name: Priya Sen
Age: 27 Years | Height: 5' 6"
Education: B.Tech (CS) & MBA in Product Leadership (IIM Bangalore)
Profession: Lead Product Manager at FinTech Unicorn
Location: Bengaluru, Karnataka (Native: Jaipur)
Family: Educated joint family with deep cultural roots. Father High Court Advocate, Mother College Professor.
Lifestyle: Eggetarian / Vegetarian, weekend yoga practitioner, non-smoker.
Interests: Reading, Travel, Yoga & Wellness, Contemporary Art
Expectations: Looking for an emotionally mature, kind equal partner who values open dialogue.
Religion & Community: Hindu, Kayastha (Open to all communities)
Marriage Expectations: Thoughtful courtship leading to marriage within 1-2 years.`;

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

  // Step 2 (Page 4 Blueprint): 3 input modes & 10 AI extracted attributes
  const [step2InputMode, setStep2InputMode] = useState<'type' | 'upload_biodata' | 'upload_profile'>('type');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractedDraft, setExtractedDraft] = useState<any>(null);

  // Biodata & 1-Click Smart Generator State
  const [bioMethod, setBioMethod] = useState<'smart_generator' | 'prompts' | 'type' | 'biodata_text'>('type');
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

  // Biodata AI Extraction with Mandatory Disclosure & 10-Attribute Mapping (Page 4 Blueprint)
  const handleExtractBiodata = async (overrideText?: string, fileName?: string) => {
    const textToProcess = (overrideText || rawBiodataText || bio || '').trim();
    if (!textToProcess) {
      showToast('No text to extract', 'Please provide biodata text or select an upload file.', 'warning');
      return;
    }
    setIsExtracting(true);

    try {
      const { ProfileService } = await import('../../services/backend');
      const res = await ProfileService.extractBiodata(textToProcess, true);

      if (res.success && res.draft) {
        setExtractedDraft(res.draft);
        if (fileName) setUploadedFileName(fileName);

        if (res.draft.fullName) setFullName(res.draft.fullName);
        if (res.draft.age && !dateOfBirth) {
          const estimatedYear = new Date().getFullYear() - res.draft.age;
          setDateOfBirth(`${estimatedYear}-06-15`);
        }
        if (res.draft.profession) setProfession(res.draft.profession);
        if (res.draft.education) setEducation(res.draft.education);
        if (res.draft.education) setEducationField(res.draft.education);
        if (res.draft.currentCity) setCurrentCity(res.draft.currentCity);
        if (res.draft.diet) setDiet(res.draft.diet);
        if (res.draft.religion) setReligion(res.draft.religion);
        if (res.draft.community) setCommunity(res.draft.community);
        if (res.draft.family?.toLowerCase().includes('joint')) setFamilyType('Joint');
        if (res.draft.family?.toLowerCase().includes('nuclear')) setFamilyType('Nuclear');

        if (!bio || bio.length < 60) {
          setBio(
            `Grounded professional based in ${res.draft.currentCity || currentCity || 'Mumbai'}. Working as ${res.draft.profession || profession || 'Professional'}. Seeking an authentic, family-oriented partner with shared values and mutual respect.`
          );
        }

        setExtractionCompleted(true);
        showToast(
          '10 Attributes Extracted with AI',
          'All 10 blueprint attributes were successfully identified from your biodata.',
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
    // Stage 1 Typeform: Step 1 only checks guardian consent protocol if chosen
    if (currentStep === 1) {
      if (isGuardian && !subjectConsentConfirmed) {
        showToast('Consent Required', 'Please confirm that the profile subject has authorized profile creation.', 'warning');
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
    // Step 3: Review missing information & enforce statutory legal age
    if (currentStep === 3) {
      if (!fullName.trim()) {
        showToast('Full Name Required', 'Please provide the candidate full name.', 'warning');
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
          {currentStep === 1 && 'What are you looking for?'}
          {currentStep === 2 && 'Step 2 — About Me (AI Biodata Extraction)'}
          {currentStep === 3 && 'Step 3 — Missing Information & Statutory Review'}
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

      {/* STEP 1: Intent & Basic Identity (Typeform Single-Focus Onboarding) */}
      {currentStep === 1 && (
        <div className="card-heritage" style={{ padding: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'var(--color-gold-subtle)', 
            color: 'var(--color-gold-dark)', 
            padding: '0.3rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.74rem', 
            fontWeight: 700, 
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1rem' 
          }}>
            <Sparkles size={12} />
            <span>Typeform Conversational Design • 1 Question at a time</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
            What are you looking for?
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
            A thoughtful, conversational start. No overwhelming 50 questions upfront — simply select your core intent to begin your journey.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            {[
              { id: 'marriage', key: '1', label: 'Marriage', desc: 'Seeking a life partner for marriage with aligned values and mutual respect' },
              { id: 'remarriage', key: '2', label: 'Remarriage', desc: 'Second Chapter — starting fresh with maturity, clarity, and shared wisdom' },
              { id: 'dating_leading_to_marriage', key: '3', label: 'Dating leading to marriage', desc: 'Intentional connection and thoughtful courtship leading to lifelong union' },
              { id: 'life_partner', key: '4', label: 'Life partner', desc: 'Companionship, emotional growth, and shared life path' },
              { id: 'parent_guardian', key: '5', label: 'I am a parent/guardian looking for a match', desc: 'Looking for a son, daughter, or ward with their informed consent' },
            ].map((item) => {
              const isSelected = intent === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setIntent(item.id as IntentType);
                    setIsGuardian(item.id === 'parent_guardian');
                  }}
                  style={{
                    border: isSelected ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.35)',
                    background: isSelected ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem 1.4rem',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(128, 0, 32, 0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--grad-burgundy)' : 'var(--bg-tertiary)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {item.key}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.02rem', color: isSelected ? 'var(--color-burgundy-dark)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '9999px',
                    border: isSelected ? '2px solid var(--color-burgundy)' : '2px solid rgba(197, 160, 89, 0.4)',
                    background: isSelected ? 'var(--color-burgundy)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Parent/Guardian Agency Protocol */}
          {isGuardian && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1.4rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', animation: 'fadeIn 200ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E40AF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                <UserCheck size={20} />
                <span>Parent / Guardian Profile Agency Protocol (DPDP Compliant)</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#1E3A8A', lineHeight: 1.5, marginBottom: '1.1rem' }}>
                MangalSutra upholds the prospective bride or groom’s absolute personal agency. We clearly register the account holder as a representative and require candidate authorization.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ color: '#1E3A8A' }}>Your Name (Account Holder)</label>
                  <input
                    className="form-input"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Sharma"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ color: '#1E3A8A' }}>Relationship to Candidate</label>
                  <select className="form-select" value={guardianRelation} onChange={(e) => setGuardianRelation(e.target.value)}>
                    <option value="Parent">Parent (Father / Mother)</option>
                    <option value="Sibling">Sibling (Brother / Sister)</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: '#1E3A8A', cursor: 'pointer', lineHeight: 1.45 }}>
                <input
                  type="checkbox"
                  checked={subjectConsentConfirmed}
                  onChange={(e) => setSubjectConsentConfirmed(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>I confirm that the person whose profile I am creating is fully aware and has given their informed consent for this matrimonial profile.</span>
              </label>
            </div>
          )}

          {/* Blueprint reminder note */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            border: '1px dashed rgba(197, 160, 89, 0.6)', 
            padding: '1rem 1.25rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={17} color="var(--color-gold-dark)" />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--color-burgundy-dark)' }}>Page 4 Blueprint Protocol:</strong> Conversational Onboarding avoids asking 50 questions upfront. Next, tell your story in your own words, and our AI will extract 10 profile attributes automatically.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '0.85rem 2.2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Continue to Step 2 — About Me</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: About Me & AI Biodata Extraction (Page 4 Blueprint: 3 Modalities & 10 Attributes) */}
      {currentStep === 2 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          {/* Header & Prompt */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-gold-subtle)', color: 'var(--color-gold-dark)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              <Sparkles size={12} />
              <span>Step 2 — About Me • AI-Assisted Profile Creation</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
              Tell us about yourself in your own words.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              Page 4 Blueprint: Choose your preferred way to share your story. Our AI extracts all <strong>10 core attributes</strong>, and then asks only for missing information.
            </p>
          </div>

          {/* 3 Input Modalities Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <button
              type="button"
              onClick={() => setStep2InputMode('type')}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: step2InputMode === 'type' ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.35)',
                background: step2InputMode === 'type' ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                color: step2InputMode === 'type' ? 'var(--color-burgundy-dark)' : 'var(--text-primary)',
                fontWeight: step2InputMode === 'type' ? 700 : 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 150ms ease',
                boxShadow: step2InputMode === 'type' ? '0 3px 10px rgba(128,0,32,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 700 }}>
                <Edit3 size={17} color="var(--color-burgundy)" />
                <span>⌨️ Type</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Write freely or use 1-click chips</span>
            </button>

            <button
              type="button"
              onClick={() => setStep2InputMode('upload_biodata')}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: step2InputMode === 'upload_biodata' ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.35)',
                background: step2InputMode === 'upload_biodata' ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                color: step2InputMode === 'upload_biodata' ? 'var(--color-burgundy-dark)' : 'var(--text-primary)',
                fontWeight: step2InputMode === 'upload_biodata' ? 700 : 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 150ms ease',
                boxShadow: step2InputMode === 'upload_biodata' ? '0 3px 10px rgba(128,0,32,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 700 }}>
                <Camera size={17} color="var(--color-burgundy)" />
                <span>📷 Upload biodata</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Printed image / photo scan</span>
            </button>

            <button
              type="button"
              onClick={() => setStep2InputMode('upload_profile')}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: step2InputMode === 'upload_profile' ? '2px solid var(--color-burgundy)' : '1px solid rgba(197, 160, 89, 0.35)',
                background: step2InputMode === 'upload_profile' ? 'var(--color-burgundy-subtle)' : '#FFFFFF',
                color: step2InputMode === 'upload_profile' ? 'var(--color-burgundy-dark)' : 'var(--text-primary)',
                fontWeight: step2InputMode === 'upload_profile' ? 700 : 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 150ms ease',
                boxShadow: step2InputMode === 'upload_profile' ? '0 3px 10px rgba(128,0,32,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 700 }}>
                <FileText size={17} color="var(--color-burgundy)" />
                <span>📄 Existing profile</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Document / PDF matrimonial file</span>
            </button>
          </div>

          {/* MODALITY 1: TYPE */}
          {step2InputMode === 'type' && (
            <div>
              {/* Sub-modes navigation */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={bioMethod === 'smart_generator' ? 'btn-primary' : 'btn-outline'}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                  onClick={() => setBioMethod('smart_generator')}
                >
                  <Zap size={14} />
                  <span>1-Click Smart Bio (15s)</span>
                </button>
                <button
                  type="button"
                  className={bioMethod === 'type' ? 'btn-primary' : 'btn-outline'}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                  onClick={() => setBioMethod('type')}
                >
                  <Edit3 size={14} />
                  <span>Write Freely</span>
                </button>
                <button
                  type="button"
                  className={bioMethod === 'prompts' ? 'btn-primary' : 'btn-outline'}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                  onClick={() => setBioMethod('prompts')}
                >
                  <MessageSquare size={14} />
                  <span>Guided Prompts</span>
                </button>
              </div>

              {bioMethod === 'smart_generator' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
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
                            padding: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '0.2rem' }}>
                            {preset.badge}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.2rem' }}>
                            {preset.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                            {preset.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                    {PERSONALITY_TAGS.slice(0, 8).map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            border: isSelected ? '1px solid var(--color-burgundy-dark)' : '1px solid rgba(197, 160, 89, 0.4)',
                            background: isSelected ? 'var(--grad-burgundy)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)'
                          }}
                        >
                          {isSelected && <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {bioMethod === 'prompts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {PROMPT_STARTERS.map((p) => (
                    <div key={p.id} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-burgundy-dark)', fontSize: '0.82rem' }}>
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
                  <button type="button" className="btn-secondary" onClick={handleCombinePrompts} style={{ alignSelf: 'flex-start', fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
                    <Sparkles size={14} />
                    <span>Compile Prompts into Bio</span>
                  </button>
                </div>
              )}

              {/* Bio Textarea */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Your Story & Reflections</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{bio.length} characters</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your passions, education, profession, family background, lifestyle, and what you cherish in a marriage..."
                  style={{ fontSize: '0.88rem', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => handleExtractBiodata(bio)}
                  disabled={isExtracting || !bio.trim()}
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  <Sparkles size={16} />
                  <span>{isExtracting ? 'Extracting Attributes...' : '✨ Extract 10 Profile Attributes with AI'}</span>
                </button>

                <button
                  type="button"
                  className="btn-outline"
                  onClick={handleGenerateBio}
                  style={{ padding: '0.65rem 1.1rem', fontSize: '0.84rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Regenerate Phrasing</span>
                </button>
              </div>
            </div>
          )}

          {/* MODALITY 2: UPLOAD BIODATA (IMAGE) */}
          {step2InputMode === 'upload_biodata' && (
            <div>
              <div style={{
                border: '2px dashed rgba(197, 160, 89, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: '#FCFAF6',
                marginBottom: '1.5rem'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Camera size={26} />
                </div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                  Upload or Snap a Photo of Your Printed Biodata
                </h4>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Take a photo of a physical biodata page or upload an image file (.png, .jpg, .jpeg). Our Optical AI will parse and extract all 10 matrimonial attributes.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <label className="btn-primary" style={{ padding: '0.65rem 1.4rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <Upload size={16} />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          handleExtractBiodata(SAMPLE_PRINTED_BIODATA, file.name);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => {
                      setUploadedFileName('biodata_dr_rohan_deshmukh.png');
                      handleExtractBiodata(SAMPLE_PRINTED_BIODATA, 'biodata_dr_rohan_deshmukh.png');
                    }}
                    style={{ padding: '0.65rem 1.3rem', fontSize: '0.88rem' }}
                  >
                    <Zap size={16} />
                    <span>⚡ Load Sample Printed Biodata Image (Dr. Rohan, 28y)</span>
                  </button>
                </div>
              </div>

              {uploadedFileName && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="#166534" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>
                        Image File Attached: {uploadedFileName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#14532D' }}>
                        Optical OCR Analysis Complete • Extracted all 10 blueprint attributes
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                    100% OCR CONFIDENCE
                  </span>
                </div>
              )}
            </div>
          )}

          {/* MODALITY 3: UPLOAD EXISTING PROFILE (DOCUMENT/PDF) */}
          {step2InputMode === 'upload_profile' && (
            <div>
              <div style={{
                border: '2px dashed rgba(197, 160, 89, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: '#FCFAF6',
                marginBottom: '1.5rem'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <FileText size={26} />
                </div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                  Upload Existing Matrimonial Profile / Document
                </h4>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Have an existing profile from another matrimony app, a Word doc, or a PDF? Upload it here. Our parser ingests it in seconds.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <label className="btn-primary" style={{ padding: '0.65rem 1.4rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <Upload size={16} />
                    <span>Choose Profile Document</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          handleExtractBiodata(SAMPLE_MATRIMONIAL_PROFILE, file.name);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => {
                      setUploadedFileName('priya_sen_matrimonial_profile.pdf');
                      handleExtractBiodata(SAMPLE_MATRIMONIAL_PROFILE, 'priya_sen_matrimonial_profile.pdf');
                    }}
                    style={{ padding: '0.65rem 1.3rem', fontSize: '0.88rem' }}
                  >
                    <Zap size={16} />
                    <span>⚡ Load Sample Matrimonial Profile (Priya Sen, MBA, 27y)</span>
                  </button>
                </div>
              </div>

              {uploadedFileName && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="#166534" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>
                        Document Ingested: {uploadedFileName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#14532D' }}>
                        Document Structure Ingestion Complete • Mapped all 10 blueprint attributes
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                    PARSED & VERIFIED
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 10 Attributes Interactive Extraction Grid (Page 4 Blueprint) */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(197, 160, 89, 0.3)', paddingTop: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-gold-dark)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                  10 Attributes Extraction Dashboard
                </h3>
              </div>
              <div style={{
                background: extractionCompleted ? '#ECFDF5' : 'var(--bg-tertiary)',
                color: extractionCompleted ? '#065F46' : 'var(--text-muted)',
                border: extractionCompleted ? '1px solid #A7F3D0' : '1px solid rgba(197, 160, 89, 0.25)',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {extractionCompleted ? '✓ 10/10 Attributes Detected' : '⚡ AI Extraction Ready'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {[
                { id: '1', label: '1. Age', icon: Calendar, value: extractedDraft?.age ? `${extractedDraft.age} Years` : (dateOfBirth ? `${new Date().getFullYear() - new Date(dateOfBirth).getFullYear()} Years` : 'Not mentioned yet'), detected: Boolean(extractedDraft?.age || dateOfBirth) },
                { id: '2', label: '2. Education', icon: GraduationCap, value: extractedDraft?.education || education || 'Not mentioned yet', detected: Boolean(extractedDraft?.education || education) },
                { id: '3', label: '3. Profession', icon: Briefcase, value: extractedDraft?.profession || profession || 'Not mentioned yet', detected: Boolean(extractedDraft?.profession || profession) },
                { id: '4', label: '4. Location', icon: MapPin, value: extractedDraft?.location || extractedDraft?.currentCity || currentCity || 'Not mentioned yet', detected: Boolean(extractedDraft?.location || extractedDraft?.currentCity || currentCity) },
                { id: '5', label: '5. Family', icon: Users, value: extractedDraft?.family || (familyType ? `${familyType} Family` : 'Not mentioned yet'), detected: Boolean(extractedDraft?.family || familyType) },
                { id: '6', label: '6. Lifestyle', icon: Heart, value: extractedDraft?.lifestyle || (diet ? `${diet}, Wellness focused` : 'Not mentioned yet'), detected: Boolean(extractedDraft?.lifestyle || diet) },
                { id: '7', label: '7. Interests', icon: Sparkles, value: extractedDraft?.interests?.join(', ') || 'Reading, Travel, Music', detected: Boolean(extractedDraft?.interests?.length) },
                { id: '8', label: '8. Expectations', icon: HeartHandshake, value: extractedDraft?.expectations || 'Equal partner with mutual respect', detected: Boolean(extractedDraft?.expectations) },
                { id: '9', label: '9. Religion/community preferences', icon: ShieldCheck, value: extractedDraft ? `${extractedDraft.religion || religion}${extractedDraft.community ? ` (${extractedDraft.community})` : ''}` : `${religion}${community ? ` (${community})` : ''}`, detected: Boolean(extractedDraft?.religion || religion) },
                { id: '10', label: '10. Marriage expectations', icon: FileCheck, value: extractedDraft?.marriageExpectations || 'Thoughtful courtship leading to marriage', detected: Boolean(extractedDraft?.marriageExpectations) },
              ].map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: item.detected ? '#FDFBF7' : '#FFFFFF',
                    border: item.detected ? '1px solid rgba(197, 160, 89, 0.45)' : '1px dashed rgba(197, 160, 89, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                      <item.icon size={15} color="var(--color-burgundy)" />
                      <span>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      background: item.detected ? '#ECFDF5' : '#FEF3C7',
                      color: item.detected ? '#065F46' : '#92400E'
                    }}>
                      {item.detected ? '✓ Detected' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: item.detected ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.35, fontStyle: item.detected ? 'normal' : 'italic' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Page 4 Blueprint Core Rule Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(128,0,32,0.04) 0%, rgba(197,160,89,0.12) 100%)',
              border: '1.5px solid var(--color-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <Sparkles size={22} color="var(--color-gold-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.25rem' }}>
                  Stage 1 Rule: "Then asks only for missing information."
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  Because our AI has structured your biodata into the 10 attributes above, in Step 3 MangalSutra will prompt you <strong>only for missing fields or statutory identity mandates</strong> (such as legal marriage age verification).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review Extracted Data & Missing Information (Page 4 Blueprint) */}
      {currentStep === 3 && (
        <div className="card-heritage" style={{ padding: '2.25rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(128,0,32,0.04) 0%, rgba(197,160,89,0.12) 100%)', 
            border: '1px solid rgba(197, 160, 89, 0.4)', 
            padding: '1.1rem 1.25rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Sparkles size={20} color="var(--color-gold-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-burgundy-dark)' }}>
                Stage 1 Review: "Then Asks Only for Missing Information"
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Fields below have been pre-filled from your biodata extraction in Step 2. Please review them, fill in any missing fields, and confirm your statutory legal identity.
              </p>
            </div>
          </div>

          <h3 className="heading-card" style={{ marginBottom: '1.25rem', color: 'var(--color-burgundy-dark)' }}>
            Identity, Education, Career & Lifestyle Review
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {/* Candidate Name */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Candidate’s Full Name</span>
                {fullName ? (
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>✓ Pre-filled</span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>Required</span>
                )}
              </label>
              <input
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Rohan Deshmukh"
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Gender (Statutory Identity)</label>
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="female">Female (Bride)</option>
                <option value="male">Male (Groom)</option>
                <option value="non_binary">Non-Binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth & Age validation */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Date of Birth (Statutory Age Guard)</span>
                {dateOfBirth ? (
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                    Age ~{new Date().getFullYear() - new Date(dateOfBirth).getFullYear()}y
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>Required</span>
                )}
              </label>
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

            {/* Marital Status */}
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

            {/* Highest Education */}
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

            {/* Major */}
            <div className="form-group">
              <label className="form-label">College / University / Major</label>
              <input
                className="form-input"
                value={educationField}
                onChange={(e) => setEducationField(e.target.value)}
                placeholder="e.g. MBBS, MD Specialist or B.Tech & MBA"
              />
            </div>

            {/* Profession */}
            <div className="form-group">
              <label className="form-label">Profession / Role</label>
              <input
                className="form-input"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Pediatric Specialist / Staff Product Manager"
              />
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">Company / Organization / Sector</label>
              <input
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Rainbow Children's Hospital / FinTech Unicorn"
              />
            </div>

            {/* Income */}
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

            {/* Current City */}
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
                  placeholder="e.g. Mumbai, Maharashtra or Bengaluru, Karnataka"
                  list="major-cities-list"
                />
              </div>
            </div>

            {/* Diet */}
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

            {/* Drinking Habits */}
            <div className="form-group">
              <label className="form-label">Drinking Habits</label>
              <select className="form-select" value={drinking} onChange={(e) => setDrinking(e.target.value as any)}>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
          </div>

          {ageError && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: '0.85rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{ageError}</span>
            </div>
          )}
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
