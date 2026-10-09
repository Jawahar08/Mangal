// 12 Modern Compatibility Dimensions & "Talk Before You Marry" Prompts

export interface DimensionQuestion {
  id: string;
  dimension: string;
  prompt: string;
  options: { value: string; label: string; alignmentKey: string }[];
}

export const MODERN_DIMENSIONS_CONFIG = [
  'Communication Style',
  'Emotional Maturity',
  'Financial Philosophy',
  'Career Expectations',
  'Children & Parenting',
  'Living Arrangements',
  'Family Boundaries',
  'Religion & Spirituality',
  'Lifestyle & Daily Habits',
  'Intimacy Expectations',
  'Conflict Resolution',
  'Personal Growth & Ambition',
];

export const TALK_BEFORE_YOU_MARRY_PROMPTS = [
  {
    category: 'Money & Finances',
    prompt: 'How do you envision managing finances after marriage — joint pooling, proportional contributions, or separate accounts?',
    context: 'Financial transparency early on prevents resentment later.'
  },
  {
    category: 'Parents & Family Duties',
    prompt: 'How often do you envision visiting or hosting extended family, and how will elder care responsibilities be shared?',
    context: 'Clarifies boundaries and cultural family support obligations.'
  },
  {
    category: 'Children & Parenting',
    prompt: 'What are your hopes and timelines regarding children, and how would parenting duties or schooling decisions be handled?',
    context: 'Vital for long-term vision alignment.'
  },
  {
    category: 'Career & Relocation',
    prompt: 'If an exceptional career or international opportunity arises for either of us, how would we decide whether to relocate?',
    context: 'Helps understand mutual career respect and flexibility.'
  },
  {
    category: 'Conflict & Resolution',
    prompt: 'When you are upset or during a disagreement, do you prefer immediate discussion or taking quiet time first to process?',
    context: 'Prevents misinterpreting withdrawal as indifference.'
  },
  {
    category: 'Living Arrangements',
    prompt: 'Do you prefer living independently, in a joint family setting, or living in close proximity to parents?',
    context: 'Directly shapes daily living expectations.'
  },
  {
    category: 'Spirituality & Festivals',
    prompt: 'How do you like celebrating traditional festivals, and what role does personal spiritual practice play in your life?',
    context: 'Encourages mutual respect for traditions.'
  }
];
