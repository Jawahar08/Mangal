// Data and generator for the 1-Click Smart Bio Generator (Step 2 Onboarding)
// Replaces blank-page essay fatigue with instant curated chips and smart bio generation.

export interface TagOption {
  id: string;
  label: string;
  category: 'personality' | 'weekend' | 'values';
  phrase: string;
}

export const PERSONALITY_TAGS: TagOption[] = [
  { id: 'ambitious', label: '🎯 Ambitious & Driven', category: 'personality', phrase: 'an ambitious and goal-oriented mindset' },
  { id: 'grounded', label: '🕊️ Grounded & Calm', category: 'personality', phrase: 'a calm, grounded, and balanced approach to life' },
  { id: 'lively', label: '😊 Cheerful & Lively', category: 'personality', phrase: 'a warm, cheerful, and positive outlook' },
  { id: 'spiritual', label: '🪔 Spiritual & Mindful', category: 'personality', phrase: 'deeply rooted values and a reflective, mindful perspective' },
  { id: 'creative', label: '🎨 Creative & Expressive', category: 'personality', phrase: 'an appreciation for creativity, aesthetics, and meaningful experiences' },
  { id: 'family_first', label: '🏡 Family-Centric', category: 'personality', phrase: 'close family bonds and cherished domestic warmth' },
  { id: 'curious', label: '🧠 Curious & Intellectual', category: 'personality', phrase: 'an intellectual curiosity and love for stimulating conversations' },
  { id: 'easygoing', label: '🌿 Friendly & Easygoing', category: 'personality', phrase: 'an easygoing, adaptable, and empathetic nature' },
];

export const WEEKEND_TAGS: TagOption[] = [
  { id: 'chai_talks', label: '☕ Chai & Heartfelt Chats', category: 'weekend', phrase: 'savoring good tea with thoughtful, engaging conversations' },
  { id: 'roadtrips', label: '🚗 Road Trips & Nature Trails', category: 'weekend', phrase: 'exploring scenic weekend getaways, nature trails, and road trips' },
  { id: 'cafes_food', label: '🍲 Cafes & Cooking', category: 'weekend', phrase: 'discovering cozy neighborhood cafes and experimenting with homemade dishes' },
  { id: 'fitness', label: '🧘 Fitness, Gym & Yoga', category: 'weekend', phrase: 'staying energized through regular workouts, yoga, or morning jogs' },
  { id: 'reading', label: '📚 Books, Podcasts & Music', category: 'weekend', phrase: 'unwinding with thought-provoking books, good music, and podcasts' },
  { id: 'movie_nights', label: '🎬 Movie & OTT Nights', category: 'weekend', phrase: 'cozy movie marathons and watching captivating series' },
  { id: 'family_time', label: '🎉 Family & Friends Gatherings', category: 'weekend', phrase: 'spending quality time with family, cousins, and close friends' },
];

export const VALUES_TAGS: TagOption[] = [
  { id: 'mutual_respect', label: '🤝 Mutual Respect & Equality', category: 'values', phrase: 'an equal partnership, open dialogue, and genuine mutual respect' },
  { id: 'emotional_honesty', label: '❤️ Emotional Depth & Honesty', category: 'values', phrase: 'emotional maturity, transparent communication, and trustworthiness' },
  { id: 'growth_support', label: '🌱 Mutual Growth & Ambition', category: 'values', phrase: 'supporting each other’s personal ambitions and professional dreams' },
  { id: 'culture_modern', label: '✨ Heritage with Modern Thinking', category: 'values', phrase: 'respect for family traditions paired with a progressive modern outlook' },
  { id: 'humor_light', label: '😂 Laughter & Good Humour', category: 'values', phrase: 'sharing plenty of laughter, lighthearted moments, and friendship' },
  { id: 'compassion', label: '🛡️ Kindness & Loyalty', category: 'values', phrase: 'unwavering loyalty, gentle kindness, and standing together through life' },
];

export interface PersonaPreset {
  id: string;
  name: string;
  badge: string;
  desc: string;
  tags: string[];
  tone: 'warm' | 'crisp' | 'traditional' | 'expressive';
}

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'grounded_pro',
    name: 'Grounded Professional',
    badge: '👔 Career & Balance',
    desc: 'Goal-oriented yet balanced, loves chai & good books',
    tags: ['ambitious', 'grounded', 'family_first', 'chai_talks', 'fitness', 'mutual_respect', 'growth_support'],
    tone: 'warm',
  },
  {
    id: 'family_explorer',
    name: 'Family-First Explorer',
    badge: '🌿 Warm & Traditional',
    desc: 'Cherishes family roots, festive culture & road trips',
    tags: ['lively', 'family_first', 'spiritual', 'roadtrips', 'family_time', 'culture_modern', 'compassion'],
    tone: 'traditional',
  },
  {
    id: 'modern_thinker',
    name: 'Progressive Thinker',
    badge: '🚀 Modern & Equal',
    desc: 'Intellectually curious, values equality & shared adventures',
    tags: ['ambitious', 'curious', 'easygoing', 'cafes_food', 'reading', 'mutual_respect', 'emotional_honesty'],
    tone: 'crisp',
  },
  {
    id: 'creative_soul',
    name: 'Creative Kindred Soul',
    badge: '🎨 Expressive & Kind',
    desc: 'Appreciates art, deep connections & lots of laughter',
    tags: ['creative', 'spiritual', 'easygoing', 'cafes_food', 'movie_nights', 'emotional_honesty', 'humor_light'],
    tone: 'expressive',
  },
];

export const PROMPT_STARTERS = [
  { 
    id: 'weekend', 
    prompt: "On an ideal weekend, you'll find me...", 
    placeholder: "e.g. Sipping morning filter coffee, reading a good book, and catching up with parents or friends." 
  },
  { 
    id: 'friends_say', 
    prompt: "My closest friends would describe me as...", 
    placeholder: "e.g. The calm listener who is ambitious at work, always on time, and brings warm positive energy." 
  },
  { 
    id: 'partner_vision', 
    prompt: "In a marriage, what matters most to me is...", 
    placeholder: "e.g. Equal partnership, mutual respect for each other's aspirations, honest communication, and humor." 
  },
];

export function generateSmartBio({
  tags,
  tone,
  variation = 0,
  profession,
  city,
}: {
  tags: string[];
  tone: 'warm' | 'crisp' | 'traditional' | 'expressive';
  variation?: number;
  profession?: string;
  city?: string;
}): string {
  const personalityPhrases = PERSONALITY_TAGS.filter(t => tags.includes(t.id)).map(t => t.phrase);
  const weekendPhrases = WEEKEND_TAGS.filter(t => tags.includes(t.id)).map(t => t.phrase);
  const valuePhrases = VALUES_TAGS.filter(t => tags.includes(t.id)).map(t => t.phrase);

  const personalityStr = personalityPhrases.length > 0 
    ? personalityPhrases.join(' and ') 
    : 'a balanced, grounded disposition';
  
  const weekendStr = weekendPhrases.length > 0 
    ? weekendPhrases.join(', alongside ') 
    : 'unwinding with relaxing hobbies, spending time with loved ones, and catching up on good books';

  const valuesStr = valuePhrases.length > 0 
    ? valuePhrases.join(', as well as ') 
    : 'mutual respect, open communication, and lifelong companionship';

  const locationIntro = city ? ` Based in ${city}.` : '';
  const workIntro = profession ? ` Working professionally as ${profession}.` : '';

  if (tone === 'crisp') {
    const v = variation % 2;
    if (v === 0) {
      return `Purpose-driven, grounded by values.${locationIntro}${workIntro} By nature, I carry ${personalityStr}. During weekends and downtime, I usually enjoy ${weekendStr}. I am looking for a partner who believes in ${valuesStr} — someone excited to build a progressive, supportive, and cheerful partnership together.`;
    } else {
      return `Forward-thinking and authentic.${locationIntro}${workIntro} Friends and family would describe me as someone with ${personalityStr}. On days away from work, you will find me ${weekendStr}. In marriage, I value ${valuesStr}, eager to create a fulfilling life anchored in trust and shared dreams.`;
    }
  }

  if (tone === 'traditional') {
    const v = variation % 2;
    if (v === 0) {
      return `Rooted in cultural heritage with a contemporary outlook on life.${locationIntro}${workIntro} I am someone who values ${personalityStr}, holding family bonds and traditional warmth close to heart. My leisure time is best spent ${weekendStr}. I seek an honest, understanding life partner who cherishes ${valuesStr}, ready to embark on a harmonious journey of togetherness.`;
    } else {
      return `Warm greetings. Raised with strong family values and modern perspectives.${locationIntro}${workIntro} Guided by ${personalityStr}, I believe in nurturing both personal roots and life ambitions. Weekends are cherished for ${weekendStr}. I look forward to connecting with a companion who values ${valuesStr}, building a warm and respectful family together.`;
    }
  }

  if (tone === 'expressive') {
    const v = variation % 2;
    if (v === 0) {
      return `A firm believer in meaningful connections, small everyday joys, and shared growth.${locationIntro}${workIntro} At heart, I bring ${personalityStr}. When free from work, I find happiness in ${weekendStr}. I dream of a union enriched by ${valuesStr} — where we celebrate life's adventures, offer each other a quiet haven, and laugh our way through every season.`;
    } else {
      return `Life is a beautiful journey best shared with a kindred spirit.${locationIntro}${workIntro} Known for ${personalityStr}, I cherish genuine conversations and lighthearted moments. My ideal weekends revolve around ${weekendStr}. Looking for a partner who holds ${valuesStr} dear, ready to write an uplifting, affectionate chapter together.`;
    }
  }

  // Default: 'warm'
  const v = variation % 2;
  if (v === 0) {
    return `I consider myself someone with ${personalityStr}.${locationIntro}${workIntro} Balancing ambition with a warm, grounded lifestyle is central to who I am. Outside of work, my weekends are usually filled with ${weekendStr}. In a life partner, I deeply cherish ${valuesStr} — looking forward to building a meaningful journey grounded in genuine companionship and mutual respect.`;
  } else {
    return `Hello! I am someone guided by ${personalityStr}.${locationIntro}${workIntro} I take pride in my professional pursuits while cherishing simple, authentic moments. When unwinding, you'll often find me ${weekendStr}. I envision a marriage rooted in ${valuesStr}, where both of us can thrive individually while creating a joyous, peaceful home.`;
  }
}
