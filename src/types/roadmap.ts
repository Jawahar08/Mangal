// Complete Roadmap & Feature Coverage Crosswalk (Modules A-T, Phases 1-6)

export type FeaturePhase = 
  | 'Phase 1: Web Launch'
  | 'Phase 2: ChaanBean Trust'
  | 'Phase 3: Marriage Intelligence'
  | 'Phase 4: Second Chapter'
  | 'Phase 5: Pratha Spirituality'
  | 'Phase 6: Marketplace';

export type FeatureStatus = 
  | 'implemented_and_tested'
  | 'partial'
  | 'mocked_simulated'
  | 'planned'
  | 'blocked_external';

export interface RoadmapModule {
  letter: string;
  code: string;
  title: string;
  phase: FeaturePhase;
  status: FeatureStatus;
  summary: string;
  phasePromptRef: string;
  acceptanceCriteria: string;
  blockersOrDependencies?: string;
  features: {
    name: string;
    status: FeatureStatus;
    note: string;
  }[];
}

export const ROADMAP_MODULES: RoadmapModule[] = [
  {
    letter: 'A',
    code: 'PUBLIC_WEBSITE',
    title: 'Public Website & Homepage',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Premium homepage with four core actions, brand ethos, progressive disclosure, and clear ecosystem introduction.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: 'Clear hero with four actions, difference from dating apps explained, accessible navigation, legal & privacy notices.',
    features: [
      { name: 'Hero with 4 Primary Actions', status: 'implemented_and_tested', note: 'Find Match, Verify Profile, Prepare for Marriage, Live a Better Marriage' },
      { name: 'Core Brand & Philosophy', status: 'implemented_and_tested', note: 'Discover -> Understand -> Verify -> Assess -> Connect -> Prepare -> Marry -> Nurture' },
      { name: 'Ecosystem Introduction (ChaanBean, Pratha, Marketplace)', status: 'implemented_and_tested', note: 'Explains relationships without claiming unbuilt commerce' },
      { name: 'Responsive Luxury Design System', status: 'implemented_and_tested', note: 'Warm ivory, burgundy wine, antique gold palette' }
    ]
  },
  {
    letter: 'B',
    code: 'CONVERSATIONAL_ONBOARDING',
    title: 'Conversational Onboarding & Intent Flow',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Adaptive step-by-step onboarding supporting 5 intents, legal age validation, biodata upload/text parsing, and mandatory review before publishing.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: 'Enforce legal age, allow manual entry or biodata extraction, review extracted data before save, parent/guardian consent agency.',
    features: [
      { name: 'Intent Selection (Marriage, Remarriage, Dating to Marriage, Life Partner, Parent/Guardian)', status: 'implemented_and_tested', note: 'Tailors subsequent questions to intent' },
      { name: 'Legal Age & Eligibility Guard', status: 'implemented_and_tested', note: 'Enforces minimum legal marriage age (21+ groom, 18+ or 21+ bride)' },
      { name: 'Biodata Text & File Parser with Mandatory Review', status: 'implemented_and_tested', note: 'Extracts key fields but never publishes without explicit user confirmation' },
      { name: 'Progressive Disclosure & Save Progress', status: 'implemented_and_tested', note: 'Allows skipping optional questions and resume later' }
    ]
  },
  {
    letter: 'C',
    code: 'PROFILE_MANAGEMENT',
    title: 'Profile Management & 5 Layers',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Full profile organized in 5 explicit layers: Who I Am, My Life, My Family, My Expectations, My Trust Profile.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: '5-layer view, profile readiness completion score, privacy controls for photos and income, editing with validation.',
    features: [
      { name: 'Five Profile Layers Structure', status: 'implemented_and_tested', note: 'Who I Am, My Life, My Family, My Expectations, My Trust Profile' },
      { name: 'Profile Readiness Gauge', status: 'implemented_and_tested', note: 'Calculates completeness percentage with missing fields guide' },
      { name: 'Privacy Toggles & Photo Permissions', status: 'implemented_and_tested', note: 'Income private toggle, photo blur with request-access workflow' },
      { name: 'Live Profile Editor', status: 'implemented_and_tested', note: 'Edit bio, lifestyle, family details, and preferences' }
    ]
  },
  {
    letter: 'D',
    code: 'DISCOVERY_MATCHMAKING',
    title: 'Discovery, Matchmaking & Connections',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Multi-tab discovery (Recommended, New, Second Chapter, Saved), multi-criteria filters, rich match cards, mutual connection flow.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: 'Filterable discovery, non-superficial profile view, express interest, mutual connection activation, block and report.',
    features: [
      { name: 'Multi-Tab Discovery Pools', status: 'implemented_and_tested', note: 'Recommended, New Matches, Second Chapter, Saved' },
      { name: 'Comprehensive Filters', status: 'implemented_and_tested', note: 'Age, religion, education, profession, location, Manglik status' },
      { name: 'Express Interest & Mutual Match Unlocking', status: 'implemented_and_tested', note: 'Both must express interest to unlock direct communication' },
      { name: 'Photo Access Request Mechanism', status: 'implemented_and_tested', note: 'Consent-based photo unlocking' }
    ]
  },
  {
    letter: 'E',
    code: 'ASTROLOGY_COMPATIBILITY',
    title: 'Astrology (36 Guna) & 12 Modern Dimensions',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Deterministic Ashta Kuta (36 Guna) engine, Gotra compatibility, Manglik check, and 12 modern relationship dimensions with Astra AI helper.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: 'Separation of calculations from UI, real 36 Guna algorithm, Gotra rule verification, non-judgmental modern categories.',
    features: [
      { name: 'Authentic 36 Guna / Ashta Kuta Engine', status: 'implemented_and_tested', note: 'Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi' },
      { name: 'Gotra Compatibility & Cultural Explanations', status: 'implemented_and_tested', note: 'Sagotra considerations explained with sensitivity' },
      { name: 'Manglik Dosha Matching Logic', status: 'implemented_and_tested', note: 'Mars placement calculation and cancellation rules' },
      { name: '12 Modern Compatibility Dimensions', status: 'implemented_and_tested', note: 'Categorized as Strong, Needs discussion, Important conversation required' },
      { name: 'Astra AI Relationship Assistant', status: 'implemented_and_tested', note: 'Consumes real calculated inputs to provide grounded discussion prompts' }
    ]
  },
  {
    letter: 'F',
    code: 'CHAANBEAN_TRUST_FOUNDATION',
    title: 'ChaanBean Trust Profile & Verification Foundation',
    phase: 'Phase 1: Web Launch',
    status: 'partial',
    summary: 'Trust dashboard with explicit status labels (Verified, Pending, User Supplied, Unavailable), purpose-limited consent, simulated uploader.',
    phasePromptRef: '04_Phase_2_ChaanBean_Trust/01_PHASE_2_TRUST_AND_VERIFICATION_PROMPT.md',
    acceptanceCriteria: 'No fake external results, explicit status labels without color reliance, purpose-bound consent modal, Trust Vault separation notice.',
    features: [
      { name: 'Trust Dashboard with Status Badges', status: 'implemented_and_tested', note: 'Mobile, Email, ID, DOB, Education, Marital Status' },
      { name: 'Purpose-Limited Consent Modal', status: 'implemented_and_tested', note: 'Explicit purpose notice, who sees results, data isolation' },
      { name: 'Document Upload & Verification Simulator', status: 'mocked_simulated', note: 'Mocked until official DigiLocker/eCourts institutional API keys are configured' },
      { name: 'Deep Institutional Government Verification (DigiLocker / eCourts)', status: 'blocked_external', note: 'Requires production enterprise credentials & entity agreements (Phase 2)' }
    ]
  },
  {
    letter: 'G',
    code: 'MARITAL_STATUS_DIVORCE',
    title: 'Marital Status & Divorce Verification',
    phase: 'Phase 2: ChaanBean Trust',
    status: 'planned',
    summary: 'Conditional evidence workflows for never married, divorced, widowed, annulled; dignified court record checking.',
    phasePromptRef: '04_Phase_2_ChaanBean_Trust/01_PHASE_2_TRUST_AND_VERIFICATION_PROMPT.md',
    acceptanceCriteria: 'Never-married declaration, divorce decree/court order CNR verification where available, dignified marital history card.',
    features: [
      { name: 'Marital Status Declaration & Document Workflow', status: 'planned', note: 'Phase 2 deep verification' },
      { name: 'Dignified Marital History Summary Card', status: 'partial', note: 'Basic marital status in Phase 1 profile' }
    ]
  },
  {
    letter: 'H',
    code: 'MARRIAGE_READINESS',
    title: 'Marriage Readiness Assessment',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Non-judgmental readiness assessment identifying strength areas and conversations before engagement.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Non-diagnostic readiness summary, private self-reflection, topic recommendations.',
    features: [
      { name: 'Individual Readiness Survey', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'I',
    code: 'TALK_BEFORE_YOU_MARRY',
    title: 'Talk Before You Marry Paced Prompts',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'partial',
    summary: 'Curated prompts on money, parents, career, kids, religion, living arrangements. Phase 1 provides starter prompts in chat.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Paced prompts, private reflection before sharing, save and skip.',
    features: [
      { name: 'Chat Icebreakers & Essential Questions', status: 'implemented_and_tested', note: 'Phase 1 chat includes curated starter topics' },
      { name: 'Full Interactive Paced Reflection Engine', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'J',
    code: 'COUPLE_CONVERSATION_MODE',
    title: 'Couple Conversation Mode',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Private shared space accessible only after mutual opt-in with distinct private vs shared answer separation.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Mutual consent before activation, explicit controls per answer, never silently expose private notes.',
    features: [
      { name: 'Shared Relationship Space', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'K',
    code: 'RELATIONSHIP_RISK_SIGNALS',
    title: 'Relationship Risk Signals',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Objective signals regarding financial divergence, child expectation conflicts, or inconsistencies.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'State evidence source & uncertainty, no defamatory labels, suggest qualified counseling.',
    features: [
      { name: 'Discussion Advisory Signals', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'L',
    code: 'ASK_MS_TRUST',
    title: 'Ask MS Trust Confidential Helper',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'partial',
    summary: 'Assistant guiding users on questions to ask, documents to verify, and red flags. Phase 1 Astra AI handles initial queries.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Distinguishes verified facts from user statements, safe non-legal suggestions.',
    features: [
      { name: 'Astra AI Relationship & Questions Guide', status: 'implemented_and_tested', note: 'Included in Phase 1 compatibility view' },
      { name: 'Confidential Verification Advisory Bot', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'M',
    code: 'SECOND_CHAPTER',
    title: 'Second Chapter Remarriage Ecosystem',
    phase: 'Phase 4: Second Chapter',
    status: 'partial',
    summary: 'Dignified remarriage journey for divorced, widowed, and single parents. Phase 1 includes dedicated intent, tab, and profile fields.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/02_PHASE_4_SECOND_CHAPTER_PROMPT.md',
    acceptanceCriteria: 'No stigma, children details protected, optional dedicated discovery pool without permanent segregation.',
    features: [
      { name: 'Second Chapter Intent & Discovery Tab', status: 'implemented_and_tested', note: 'Dedicated discovery pool in Phase 1' },
      { name: 'Learnings & Priorities Profile Fields', status: 'implemented_and_tested', note: 'What I learned & priorities' },
      { name: 'Recovery Ecosystem (Reset, Understand, Rebuild, Restart, Heal)', status: 'planned', note: 'Phase 4 backlog item' }
    ]
  },
  {
    letter: 'N',
    code: 'PRATHA',
    title: 'Pratha Spirituality & Wellbeing Layer',
    phase: 'Phase 5: Pratha Spirituality',
    status: 'planned',
    summary: 'Optional inner life layer: daily spiritual practices, temple experiences, poojas, meditation, couple rituals, festival calendar.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/03_PHASE_5_PRATHA_PROMPT.md',
    acceptanceCriteria: 'Optional spiritual paths (Traditional, Wellness, Modern, Family, Couple), 21-day couple journey, mutual agreement for shared rites.',
    features: [
      { name: 'Pratha Value Pillar & Vision', status: 'implemented_and_tested', note: 'Presented on homepage and ecosystem hub' },
      { name: 'Daily Rituals, Temple Booking & Meditation Engine', status: 'planned', note: 'Phase 5 backlog item' }
    ]
  },
  {
    letter: 'O',
    code: 'MARKETPLACE',
    title: 'MangalSutra Marketplace',
    phase: 'Phase 6: Marketplace',
    status: 'planned',
    summary: 'Wedding services, jewelry, Ayurveda/wellness, spiritual goods, couple experiences with real vendors and payment gateway.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/04_PHASE_6_MARKETPLACE_PROMPT.md',
    acceptanceCriteria: 'Vendor directory, genuine checkout integration (never fake success), does not overshadow matchmaking.',
    features: [
      { name: 'Marketplace Concept Preview', status: 'implemented_and_tested', note: 'Introduced on homepage and ecosystem hub' },
      { name: 'Commerce & Vendor Services', status: 'planned', note: 'Phase 6 backlog item' }
    ]
  },
  {
    letter: 'P',
    code: 'MARRIAGE_JOURNEY_DASHBOARD',
    title: 'Marriage Journey Dashboard & Milestones',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Configurable milestones: Matched, Trust Check, Know Each Other, Important Conversations, Engagement, Wedding, First 100 Days.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Mutual consent for shared progress, non-competitive milestones.',
    features: [
      { name: 'Milestone Progress Tracker', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'Q',
    code: 'FIRST_100_DAYS',
    title: 'First 100 Days Post-Marriage Guide',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Structured guidance for days 1-7 (expectations), 8-30 (communication), 31-60 (money/family), 61-90 (lifestyle), 91-100 (reflection).',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Independent answers, conversational prompts, non-diagnostic.',
    features: [
      { name: '100-Day Phased Prompts', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'R',
    code: 'ANNUAL_HEALTH_CHECK',
    title: 'Annual Marriage Health Check',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'planned',
    summary: 'Yearly check-in on communication, finances, family, intimacy, and joint dreams with optional retreats/counselling.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Private non-clinical language, voluntary couple check-in.',
    features: [
      { name: 'Annual Marriage Reflection', status: 'planned', note: 'Phase 3 backlog item' }
    ]
  },
  {
    letter: 'S',
    code: 'COMMERCIAL_TIERS',
    title: 'Proposed Commercial Tiers & Entitlements',
    phase: 'Phase 1: Web Launch',
    status: 'partial',
    summary: 'Transparent explanation of proposed tiers: Free, Premium, Verified, Premium Verified, Couple. Honest disclaimer that pricing is proposed.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/05_CROSS_PHASE_ACCEPTANCE_REVIEW_PROMPT.md',
    acceptanceCriteria: 'Clear explanation of proposed benefits, no fake payment charges or promises that payment guarantees marriage.',
    features: [
      { name: 'Tier Explanations & Transparency Notice', status: 'implemented_and_tested', note: 'Included on homepage pricing modal' },
      { name: 'Payment Gateway Integration (Razorpay / Stripe)', status: 'blocked_external', note: 'Requires merchant account credentials & KYC (Phase 2)' }
    ]
  },
  {
    letter: 'T',
    code: 'NAVIGATION_ARCHITECTURE',
    title: 'Complete Navigation Architecture',
    phase: 'Phase 1: Web Launch',
    status: 'implemented_and_tested',
    summary: 'Focused Phase 1 navigation (Discover, Matches, Messages, Trust Hub, Profile, Ecosystem) with mobile bottom bar and accessible skip links.',
    phasePromptRef: '03_Phase_1_Core_Web/01_PHASE_1_CORE_WEB_PROMPT.md',
    acceptanceCriteria: 'Responsive mobile & desktop navigation, accessible keyboard focus, badge counts for messages & interests.',
    features: [
      { name: 'Desktop Header with Brand & Status Badges', status: 'implemented_and_tested', note: 'Discover, Matches, Messages, Trust, Profile' },
      { name: 'Mobile Bottom Navigation Bar', status: 'implemented_and_tested', note: 'High touch-target mobile navigation' },
      { name: 'Ecosystem & Roadmap Viewer', status: 'implemented_and_tested', note: 'Transparently tracks all Modules A-T across 6 phases' }
    ]
  }
];
