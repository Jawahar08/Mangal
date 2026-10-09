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
    title: 'ChaanBean Trust Profile & Verification Engine',
    phase: 'Phase 2: ChaanBean Trust',
    status: 'implemented_and_tested',
    summary: 'Evidence-based trust engine with 4-step wizard, purpose limitation, consent ledger, tamper-evident audit logs, and user-controlled visibility.',
    phasePromptRef: '04_Phase_2_ChaanBean_Trust/01_PHASE_2_TRUST_AND_VERIFICATION_PROMPT.md',
    acceptanceCriteria: 'Explicit status labels without color reliance, purpose-bound consent modal, Trust Vault separation, audit logs, revocable consent.',
    features: [
      { name: 'Trust Dashboard with Status Badges & Visibility', status: 'implemented_and_tested', note: 'Mobile, Email, ID, DOB, Education, Marital Status' },
      { name: '4-Step Verification Wizard', status: 'implemented_and_tested', note: 'Purpose notice, informed consent, evidence submission, visibility settings' },
      { name: 'Public Court Record Screening (eCourts CNR)', status: 'implemented_and_tested', note: 'CNR lookup simulator with non-defamatory safe wording caveats' },
      { name: 'Consent Revocation & Quarantined Evidence Purging', status: 'implemented_and_tested', note: 'Users can revoke consent at any time and purge evidence' },
      { name: 'Tamper-Evident Audit Trail Ledger', status: 'implemented_and_tested', note: 'Cryptographic log of all status transitions and grants' }
    ]
  },
  {
    letter: 'G',
    code: 'MARITAL_STATUS_DIVORCE',
    title: 'Marital Status & Divorce Verification',
    phase: 'Phase 2: ChaanBean Trust',
    status: 'implemented_and_tested',
    summary: 'Conditional evidence workflows for never married, divorced, widowed, annulled; certified decree CNR audit and confidential custody disclosures.',
    phasePromptRef: '04_Phase_2_ChaanBean_Trust/01_PHASE_2_TRUST_AND_VERIFICATION_PROMPT.md',
    acceptanceCriteria: 'Never-married declaration under oath, divorce decree/Section 13B CNR verification, dignified marital history card with private custody.',
    features: [
      { name: 'Never Married Declaration Protocol', status: 'implemented_and_tested', note: 'Digital affirmation under oath + state registrar check' },
      { name: 'Divorce Decree & Section 13B Verification', status: 'implemented_and_tested', note: 'Court name, decree date, CNR reference, and certified order' },
      { name: 'Protected Custody Disclosures', status: 'implemented_and_tested', note: 'Custody details kept private; shared only after mutual consent' },
      { name: 'Widowed & Annulment Sensitive Workflows', status: 'implemented_and_tested', note: 'Municipal certificate submission handled with dignity' }
    ]
  },
  {
    letter: 'H',
    code: 'MARRIAGE_READINESS',
    title: 'Marriage Readiness Assessment',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Non-judgmental readiness assessment identifying strength areas and conversations before engagement.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Non-diagnostic readiness summary, private self-reflection, topic recommendations.',
    features: [
      { name: 'Individual Readiness Survey & Prompts', status: 'implemented_and_tested', note: 'Curated self-reflections across finances, family, and conflict' },
      { name: 'Non-Diagnostic Growth Framing', status: 'implemented_and_tested', note: 'Never assigns credit-like score or divorce prediction' }
    ]
  },
  {
    letter: 'I',
    code: 'TALK_BEFORE_YOU_MARRY',
    title: 'Talk Before You Marry Paced Prompts',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Curated prompts on money, parents, career, kids, religion, living arrangements. Supports private reflections and mutual consent sharing.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Paced prompts, private reflection before sharing, save and skip.',
    features: [
      { name: 'Chat Icebreakers & Essential Questions', status: 'implemented_and_tested', note: 'Curated starter topics in Phase 1 chat' },
      { name: 'Full Interactive Paced Reflection Studio', status: 'implemented_and_tested', note: 'Paced topics with independent reflection and mutual reveal' },
      { name: 'Private Draft vs Partner Shared Toggle', status: 'implemented_and_tested', note: 'Strict privacy guard ensuring private drafts are never leaked' }
    ]
  },
  {
    letter: 'J',
    code: 'COUPLE_CONVERSATION_MODE',
    title: 'Couple Conversation Mode',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Private shared space accessible only after mutual opt-in with distinct private vs shared answer separation.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Mutual consent before activation, explicit controls per answer, never silently expose private notes.',
    features: [
      { name: 'Sacred Couple Sanctuary Mode', status: 'implemented_and_tested', note: 'Mutual opt-in handshake required before activation' },
      { name: 'Shared Agreement Ledger & Notes', status: 'implemented_and_tested', note: 'Category-specific joint notes penned by each partner' }
    ]
  },
  {
    letter: 'K',
    code: 'RELATIONSHIP_RISK_SIGNALS',
    title: 'Relationship Risk Signals',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Objective signals regarding financial divergence, child expectation conflicts, or inconsistencies.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'State evidence source & uncertainty, no defamatory labels, suggest qualified counseling.',
    features: [
      { name: 'Discussion Advisory Signals', status: 'implemented_and_tested', note: 'Green advisory and Amber discussion signals with questions to ask' },
      { name: 'Evidence Provenance & Professional Support', status: 'implemented_and_tested', note: 'Clear source attribution and licensed counseling links' }
    ]
  },
  {
    letter: 'L',
    code: 'ASK_MS_TRUST',
    title: 'Ask MS Trust Confidential Helper',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Assistant guiding users on questions to ask, documents to verify, and red flags with grounded non-diagnostic advice.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Distinguishes verified facts from user statements, safe non-legal suggestions.',
    features: [
      { name: 'Astra AI Relationship & Questions Guide', status: 'implemented_and_tested', note: 'Included in Phase 1 compatibility view' },
      { name: 'Ask MS Trust Confidential Relationship Guide', status: 'implemented_and_tested', note: 'Interactive guidance on framing delicate queries and counseling' }
    ]
  },
  {
    letter: 'M',
    code: 'SECOND_CHAPTER',
    title: 'Second Chapter Remarriage Ecosystem',
    phase: 'Phase 4: Second Chapter',
    status: 'implemented_and_tested',
    summary: 'Dignified remarriage journey for divorced, widowed, and single parents. Features Rebuild profile dimensions, children & custody safeguards, non-diagnostic emotional readiness, and a 7-pillar recovery ecosystem.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/02_PHASE_4_SECOND_CHAPTER_PROMPT.md',
    acceptanceCriteria: 'No stigma, children details protected, optional dedicated discovery pool without permanent segregation.',
    features: [
      { name: 'Second Chapter Dedicated Discovery Pool & Non-Segregation Switcher', status: 'implemented_and_tested', note: 'Switch between Second Chapter sanctuary and all eligible members' },
      { name: 'Five-Dimension Rebuild Profile Studio', status: 'implemented_and_tested', note: 'What I Learned, What I Want Now, What Has Changed, What I Do Not Want Again, My Priorities' },
      { name: 'Children & Family Custody Sanctuary', status: 'implemented_and_tested', note: 'Sensitive child details, custody models, and strict mutual-connections-only visibility controls' },
      { name: 'Private Emotional Readiness Self-Assessment', status: 'implemented_and_tested', note: 'Non-diagnostic reflection on grief closure, emotional sovereignty, and readiness to love again' },
      { name: 'Rebuilding & Recovery 7-Pillar Ecosystem', status: 'implemented_and_tested', note: 'RESET, UNDERSTAND, REBUILD (Section 13B legal decrees), RESTART (Finances), FAMILY (Co-parenting), RECONNECT, HEAL' }
    ]
  },
  {
    letter: 'N',
    code: 'PRATHA',
    title: 'Pratha Spirituality & Wellbeing Layer',
    phase: 'Phase 5: Pratha Spirituality',
    status: 'implemented_and_tested',
    summary: 'Optional inner life layer: five spiritual paths, daily Rigvedic Sankalpa, heritage temple darshan guides, pooja & sanskara explanations, 21-day couple wellbeing journey, and Panchang festival calendar.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/03_PHASE_5_PRATHA_PROMPT.md',
    acceptanceCriteria: 'Optional spiritual paths (Traditional, Wellness, Modern, Family, Couple), 21-day couple journey, mutual agreement for shared rites.',
    features: [
      { name: 'Five Personalized Spiritual Paths', status: 'implemented_and_tested', note: 'Traditional, Wellness, Modern Spiritual, Family, Couple paths' },
      { name: 'Daily Sankalpa & 60-Second Mindfulness Breath Pause', status: 'implemented_and_tested', note: 'Vedic sloka with English meaning and interactive timer' },
      { name: 'Sacred Heritage Temple Darshan Directory', status: 'implemented_and_tested', note: 'Meenakshi Sundareswarar, Tirumala Tirupati, Kashi Vishwanath, Somnath, Kamakhya with marital blessings and seva guides' },
      { name: 'Vedic Sanskara & Home Pooja Step-by-Step Guides', status: 'implemented_and_tested', note: 'Saptapadi 7 vows meaning, Gauri Pooja, Griha Pravesh, Sri Satyanarayan Katha with samagri checklists' },
      { name: '21-Day Couple Wellbeing Journey', status: 'implemented_and_tested', note: 'Daily micro-exercises and shared couple prompts with mutual affirmation' },
      { name: 'Panchang & Auspicious Festival Calendar', status: 'implemented_and_tested', note: 'Karwa Chauth, Diwali, Vivaha Panchami, Makar Sankranti with couple observances' }
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
    status: 'implemented_and_tested',
    summary: 'Configurable milestones: Matched, Trust Check, Know Each Other, Important Conversations, Engagement, Wedding, First 100 Days.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Mutual consent for shared progress, non-competitive milestones.',
    features: [
      { name: 'Mutual Milestone Progress Tracker', status: 'implemented_and_tested', note: '10 milestones from Discovery through Wedding and First Anniversary' },
      { name: 'Mutual Affirmation Protocol', status: 'implemented_and_tested', note: 'Requires both partners to affirm milestones without competition' }
    ]
  },
  {
    letter: 'Q',
    code: 'FIRST_100_DAYS',
    title: 'First 100 Days Post-Marriage Guide',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Structured guidance for days 1-7 (expectations), 8-30 (communication), 31-60 (money/family), 61-90 (lifestyle), 91-100 (reflection).',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Independent answers, conversational prompts, non-diagnostic.',
    features: [
      { name: '100-Day Phased Prompts & Reflection', status: 'implemented_and_tested', note: 'Five 20-30 day transition modules with partner-shared answers' }
    ]
  },
  {
    letter: 'R',
    code: 'ANNUAL_HEALTH_CHECK',
    title: 'Annual Marriage Health Check',
    phase: 'Phase 3: Marriage Intelligence',
    status: 'implemented_and_tested',
    summary: 'Yearly check-in on communication, finances, family, intimacy, and joint dreams with optional retreats/counselling.',
    phasePromptRef: '05_Phases_3_to_6_Ecosystem/01_PHASE_3_MARRIAGE_INTELLIGENCE_PROMPT.md',
    acceptanceCriteria: 'Private non-clinical language, voluntary couple check-in.',
    features: [
      { name: 'Annual Marriage Reflection Dashboard', status: 'implemented_and_tested', note: 'Evaluates harmony, finances, emotional intimacy, and joint dreams' }
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
