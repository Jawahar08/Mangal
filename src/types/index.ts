// MangalSutra 2.0 Core Data Types

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

export interface VerificationCheck {
  id: string;
  category: 'identity' | 'dob' | 'address' | 'education' | 'employment' | 'marital_status' | 'court' | 'police';
  title: string;
  description: string;
  status: VerificationState;
  verifiedAt?: string;
  sourceNote?: string;
  documentType?: string;
  isOptional?: boolean;
}

export interface ChaanBeanTrustProfile {
  trustScoreLevel: 'Basic' | 'Verified' | 'Comprehensive';
  checks: VerificationCheck[];
  lastAuditDate: string;
  consentGranted: boolean;
  visibility: 'mutual_connections_only' | 'verified_members_only' | 'public';
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
