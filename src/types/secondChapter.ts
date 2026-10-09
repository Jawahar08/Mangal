// Phase 4: Second Chapter Remarriage Ecosystem Types (Module M)

export type RebuildPriority = 
  | 'Emotional Stability'
  | 'Mutual Respect & Equality'
  | 'Financial Transparency'
  | 'Peaceful & Gentle Home'
  | 'Healthy Co-Parenting Harmony'
  | 'Intellectual & Spiritual Connection'
  | 'Independent Career Space'
  | 'Shared Laughter & Companionship';

export interface ChildDetail {
  id: string;
  age: number;
  gender: 'son' | 'daughter';
  livingWithParent: 'Full-time' | '50-50 Shared' | 'Weekends / Visits' | 'Independent / Adult';
}

export interface SecondChapterProfileDetails {
  // 5 Rebuild Dimensions
  whatILearned: string;
  whatIWantNow: string;
  whatHasChanged: string;
  whatIDoNotWantAgain: string;
  myPriorities: RebuildPriority[];

  // Children & Family
  hasChildren: boolean;
  childrenCount: number;
  childrenDetails: ChildDetail[];
  custodyArrangement: 'Sole Physical Custody' | 'Shared Joint 50-50' | 'Visiting Rights' | 'Adult / Independent' | 'No Children';
  coParentingDynamic: 'Harmonious & Cooperative' | 'Independent parallel parenting' | 'Courteous with clear boundaries' | 'Not applicable';
  custodyPrivacy: 'mutual_connections_only' | 'verified_only' | 'on_request';
  openToPartnerWithChildren: boolean;
  futureChildrenExpectation: 'Open to more children' | 'Family complete (no more children)' | 'Open to discussing together';

  // Emotional Readiness (Private Self-Reflection)
  griefClosureState: 'Healed & Grounded' | 'Constructive Progress' | 'Taking Quiet Time';
  emotionalIndependence: 'High Sovereignty & Joy' | 'Balanced with desire for partnership';
  readinessAffirmation: boolean;
  lastAssessedDate?: string;
  readinessReflectionNote: string;
}

export type EcosystemPillar = 
  | 'RESET'
  | 'UNDERSTAND'
  | 'REBUILD'
  | 'RESTART'
  | 'FAMILY'
  | 'RECONNECT'
  | 'HEAL';

export interface SecondChapterResource {
  id: string;
  pillar: EcosystemPillar;
  pillarTitle: string;
  pillarIcon: string;
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  actionableChecklist: string[];
  faqOrLegalNotes?: string[];
  professionalAssistanceNote?: string;
}
