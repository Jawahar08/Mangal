// MangalSutra 2.0 Core Data Types (Phase 1 & Phase 2 Enhanced)

export type IntentType = 
  | 'marriage' 
  | 'remarriage' 
  | 'dating_leading_to_marriage' 
  | 'life_partner' 
  | 'parent_guardian';

export type MaritalStatus = 
  | 'never_married' 
  | 'divorced' 
  | 'widowed' 
  | 'separated' 
  | 'annulled';

export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export type VerificationState = 
  | 'verified' 
  | 'pending' 
  | 'user_supplied' 
  | 'unavailable' 
  | 'further_review_required';

export type BadgeVisibility = 
  | 'mutual_connections_only' 
  | 'verified_members_only' 
  | 'public' 
  | 'hidden';

export interface ConsentRecord {
  id: string;
  checkId: string;
  purpose: string;
  grantedAt: string;
  revokedAt?: string;
  scope: string;
  version: string;
  isRevoked: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'consent_granted' | 'consent_revoked' | 'document_uploaded' | 'status_changed' | 'visibility_changed' | 'dispute_raised';
  checkTitle: string;
  actor: string;
  details: string;
  previousStatus?: VerificationState;
  newStatus?: VerificationState;
}

export interface CourtScreeningResult {
  cnrNumber?: string;
  state: string;
  district: string;
  year: string;
  queryName: string;
  searchDate: string;
  resultSummary: string;
  caveatNote: string;
  matchingRecordsCount: number;
}

export interface MaritalVerificationRecord {
  declaredStatus: MaritalStatus;
  declarationAffirmed: boolean;
  declarationDate: string;
  decreeDate?: string;
  courtName?: string;
  sectionType?: '13B_Mutual_Consent' | 'Contested_Granted' | 'Annulled' | 'Not_Applicable';
  cnrReference?: string;
  custodyDisclosedPrivately?: string;
  verifiedAt?: string;
  verificationBadge: string;
}

export interface VerificationCheck {
  id: string;
  category: 'identity' | 'dob' | 'address' | 'education' | 'employment' | 'marital_status' | 'court' | 'police' | 'caste_community' | 'income' | 'references';
  title: string;
  description: string;
  status: VerificationState;
  visibility: BadgeVisibility;
  verifiedAt?: string;
  sourceNote?: string;
  documentType?: string;
  isOptional?: boolean;
  providerName?: string;
  providerType?: 'digilocker' | 'nad' | 'ecourts' | 'corporate_hr' | 'manual_noc' | 'self_affirmed';
  evidenceFileName?: string;
  evidenceHash?: string;
  correctionRequested?: boolean;
  disputeNote?: string;
}

export interface ChaanBeanTrustProfile {
  trustScoreLevel: 'Basic' | 'Verified' | 'Comprehensive';
  checks: VerificationCheck[];
  lastAuditDate: string;
  consentGranted: boolean;
  visibility: BadgeVisibility;
  consentLedger: ConsentRecord[];
  auditLogs: AuditLogEntry[];
  maritalVerification?: MaritalVerificationRecord;
  courtScreening?: CourtScreeningResult;
}

export interface AstrologyDetails {
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
  nakshatra: string;
  rashi: string;
  gotra: string;
  manglikStatus: 'manglik' | 'non_manglik' | 'anshik_manglik' | 'dont_know';
  horoscopePublic: boolean;
}

export interface CompatibilityScores {
  gunaScore: number; // 0 to 36
  gunaMax: 36;
  gunaCategories: {
    name: string;
    score: number;
    maxScore: number;
    significance: string;
  }[];
  gotraStatus: 'compatible' | 'caution' | 'not_applicable';
  gotraNote: string;
  manglikCompatibility: 'compatible' | 'requires_consultation' | 'neutral';
  manglikNote: string;
  modernDimensions: {
    dimension: string;
    rating: 'Strong' | 'Needs discussion' | 'Important conversation required';
    userPerspective: string;
    partnerPerspective: string;
    advice: string;
  }[];
  overallAssessment: string;
}

export interface Expectations {
  partnerAgeMin: number;
  partnerAgeMax: number;
  partnerHeightMin: string;
  partnerEducation: string[];
  partnerProfession: string[];
  partnerLocation: string[];
  dietaryPreference: string;
  maritalStatusAccepted: MaritalStatus[];
  familyValues: string;
  childrenExpectations: 'open_to_children' | 'wants_children' | 'no_children' | 'has_children_welcome';
  financialPhilosophy: 'shared_planning' | 'independent_accounts' | 'traditional_breadwinner';
  relocationOpenness: 'open' | 'prefer_current' | 'not_open';
}

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  intent: IntentType;
  maritalStatus: MaritalStatus;
  religion: string;
  community: string;
  motherTongue: string;
  hometown: string;
  currentCity: string;
  currentCountry: string;
  height: string;
  bio: string;
  
  // Education & Work
  education: string;
  educationField: string;
  profession: string;
  companyOrIndustry: string;
  incomeBracket: string;
  incomePrivate: boolean;

  // Lifestyle
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Jain';
  drinking: 'Never' | 'Occasionally' | 'Regularly';
  smoking: 'Never' | 'Occasionally' | 'Regularly';
  fitness: string;
  interests: string[];

  // Family
  familyType: 'Nuclear' | 'Joint';
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;

  // Second Chapter / Children if applicable
  childrenCount?: number;
  custodyStatus?: string;
  secondChapterLearnings?: string;

  // Photos
  photoUrl: string;
  additionalPhotos: string[];
  photosBlurred: boolean; // Privacy photo blur

  // Layers
  astrology: AstrologyDetails;
  expectations: Expectations;
  trustProfile: ChaanBeanTrustProfile;

  // System
  createdAt: string;
  updatedAt: string;
  isRegisteredUser?: boolean;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  photoAccessGranted?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isPromptStarter?: boolean;
}

export interface Conversation {
  partnerId: string;
  partner: UserProfile;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPhotoAccessRequested?: boolean;
  isPhotoAccessApproved?: boolean;
}
