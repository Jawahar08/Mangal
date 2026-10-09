// Deterministic 36 Guna (Ashta Kuta) & Vedic Astrology Calculation Engine

import { NAKSHATRAS, NakshatraInfo, RASHI_ORDER } from '../data/astrologyData';
import { AstrologyDetails, CompatibilityScores } from '../types';

// Varna Hierarchy: Brahmin (4) > Kshatriya (3) > Vaishya (2) > Shudra (1)
const VARNA_WEIGHTS: Record<string, number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
};

// Planetary Friendship Table for Graha Maitri (5 points)
// Lords: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
const PLANETARY_FRIENDS: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutrals: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutrals: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], neutrals: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], neutrals: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};

export function getNakshatraInfo(name: string): NakshatraInfo {
  const found = NAKSHATRAS.find((n) => n.name.toLowerCase() === name.toLowerCase());
  return found || NAKSHATRAS[0];
}

// 1. Varna Kuta (1 point)
export function calculateVarna(groom: NakshatraInfo, bride: NakshatraInfo): number {
  const gWeight = VARNA_WEIGHTS[groom.varna] || 1;
  const bWeight = VARNA_WEIGHTS[bride.varna] || 1;
  return gWeight >= bWeight ? 1 : 0;
}

// 2. Vashya Kuta (2 points)
export function calculateVashya(groom: NakshatraInfo, bride: NakshatraInfo): number {
  if (groom.vashya === bride.vashya) return 2;
  // Specific harmonic pairings
  const pairings: Record<string, string[]> = {
    Manava: ['Chatushpada', 'Jalachara'],
    Chatushpada: ['Manava'],
    Jalachara: ['Manava'],
    Vanachara: [],
    Keeta: ['Jalachara'],
  };
  if (pairings[groom.vashya]?.includes(bride.vashya)) return 1;
  return 0.5;
}

// 3. Tara Kuta (3 points)
export function calculateTara(groomIdx: number, brideIdx: number): number {
  const countGB = ((groomIdx - brideIdx + 27) % 9) + 1;
  const countBG = ((brideIdx - groomIdx + 27) % 9) + 1;
  // Auspicious Taras: 3 (Vipat is bad), 5 (Pratyak is bad), 7 (Naidhana is bad)
  const isAuspicious = (num: number) => ![3, 5, 7].includes(num);

  const gbGood = isAuspicious(countGB);
  const bgGood = isAuspicious(countBG);

  if (gbGood && bgGood) return 3;
  if (gbGood || bgGood) return 1.5;
  return 0;
}

// 4. Yoni Kuta (4 points)
const YONI_ENEMIES: Record<string, string> = {
  Horse: 'Buffalo',
  Buffalo: 'Horse',
  Elephant: 'Lion',
  Lion: 'Elephant',
  Sheep: 'Monkey',
  Monkey: 'Sheep',
  Serpent: 'Mongoose',
  Mongoose: 'Serpent',
  Dog: 'Deer',
  Deer: 'Dog',
  Cat: 'Rat',
  Rat: 'Cat',
  Cow: 'Tiger',
  Tiger: 'Cow',
};

export function calculateYoni(groom: NakshatraInfo, bride: NakshatraInfo): number {
  if (groom.yoni === bride.yoni) return 4;
  if (YONI_ENEMIES[groom.yoni] === bride.yoni) return 0;
  return 2; // neutral
}

// 5. Graha Maitri (5 points)
export function calculateGrahaMaitri(groom: NakshatraInfo, bride: NakshatraInfo): number {
  const gLord = groom.rashiLord;
  const bLord = bride.rashiLord;

  if (gLord === bLord) return 5;

  const gRelation = PLANETARY_FRIENDS[gLord];
  const bRelation = PLANETARY_FRIENDS[bLord];

  const gLikesB = gRelation?.friends.includes(bLord);
  const bLikesG = bRelation?.friends.includes(gLord);

  const gNeutralB = gRelation?.neutrals.includes(bLord);
  const bNeutralG = bRelation?.neutrals.includes(gLord);

  if (gLikesB && bLikesG) return 5;
  if ((gLikesB && bNeutralG) || (gNeutralB && bLikesG)) return 4;
  if (gNeutralB && bNeutralG) return 3;
  if ((gLikesB && !bLikesG && !bNeutralG) || (bLikesG && !gLikesB && !gNeutralB)) return 1;
  return 0;
}

// 6. Gana Kuta (6 points)
export function calculateGana(groom: NakshatraInfo, bride: NakshatraInfo): number {
  if (groom.gana === bride.gana) return 6;
  if (groom.gana === 'Deva' && bride.gana === 'Manushya') return 6;
  if (groom.gana === 'Manushya' && bride.gana === 'Deva') return 5;
  if (groom.gana === 'Rakshasa' && bride.gana === 'Deva') return 1;
  if (groom.gana === 'Deva' && bride.gana === 'Rakshasa') return 0;
  return 0;
}

// 7. Bhakoot Kuta (7 points)
export function calculateBhakoot(groom: NakshatraInfo, bride: NakshatraInfo): number {
  const gRashiIdx = RASHI_ORDER.indexOf(groom.rashi);
  const bRashiIdx = RASHI_ORDER.indexOf(bride.rashi);

  const diff = Math.abs(gRashiIdx - bRashiIdx) + 1;
  // Shadashtaka (6/8), Dvidvadasha (2/12), and Navapanchama (9/5) can produce Bhakoot Dosha
  if (diff === 6 || diff === 8 || diff === 2 || diff === 12) {
    // If same lord or mutual friends, dosha is canceled
    if (groom.rashiLord === bride.rashiLord) return 7;
    return 0;
  }
  return 7;
}

// 8. Nadi Kuta (8 points)
export function calculateNadi(groom: NakshatraInfo, bride: NakshatraInfo): number {
  // If Nadis are different, maximum points (8). If same Nadi, 0 points (Nadi Dosha)
  if (groom.nadi !== bride.nadi) return 8;
  return 0;
}

// Full 36 Guna Calculation Engine
export function calculateAshtaKuta(
  groomAstro: AstrologyDetails,
  brideAstro: AstrologyDetails
): {
  totalScore: number;
  categories: { name: string; score: number; maxScore: number; significance: string }[];
} {
  const groomNakshatra = getNakshatraInfo(groomAstro.nakshatra);
  const brideNakshatra = getNakshatraInfo(brideAstro.nakshatra);

  const gIdx = NAKSHATRAS.findIndex((n) => n.name.toLowerCase() === groomNakshatra.name.toLowerCase());
  const bIdx = NAKSHATRAS.findIndex((n) => n.name.toLowerCase() === brideNakshatra.name.toLowerCase());

  const varna = calculateVarna(groomNakshatra, brideNakshatra);
  const vashya = calculateVashya(groomNakshatra, brideNakshatra);
  const tara = calculateTara(gIdx >= 0 ? gIdx : 0, bIdx >= 0 ? bIdx : 0);
  const yoni = calculateYoni(groomNakshatra, brideNakshatra);
  const maitri = calculateGrahaMaitri(groomNakshatra, brideNakshatra);
  const gana = calculateGana(groomNakshatra, brideNakshatra);
  const bhakoot = calculateBhakoot(groomNakshatra, brideNakshatra);
  const nadi = calculateNadi(groomNakshatra, brideNakshatra);

  const categories = [
    { name: 'Varna (Ego & Work Temperament)', score: varna, maxScore: 1, significance: 'Spiritual alignment & ego work' },
    { name: 'Vashya (Mutual Attraction & Harmony)', score: vashya, maxScore: 2, significance: 'Balance of power & mutual respect' },
    { name: 'Tara (Health, Destiny & Longevity)', score: tara, maxScore: 3, significance: 'Destiny flow & energetic resonance' },
    { name: 'Yoni (Biological & Physical Harmony)', score: yoni, maxScore: 4, significance: 'Sensual compatibility & instinctive comfort' },
    { name: 'Graha Maitri (Psychological Friendship)', score: maitri, maxScore: 5, significance: 'Mental wavelength & friendship between minds' },
    { name: 'Gana (Temperament & Behavior)', score: gana, maxScore: 6, significance: 'Personality alignment & social nature' },
    { name: 'Bhakoot (Emotional Depth & Prosperity)', score: bhakoot, maxScore: 7, significance: 'Family happiness, finance & emotional resilience' },
    { name: 'Nadi (Genetic Health & Vitality)', score: nadi, maxScore: 8, significance: 'Biological constitution & progeny vitality' },
  ];

  const totalScore = Math.round(categories.reduce((acc, cat) => acc + cat.score, 0) * 10) / 10;

  return { totalScore, categories };
}

// Gotra Compatibility Rule
export function evaluateGotraRule(userGotra?: string, partnerGotra?: string): {
  status: 'compatible' | 'caution' | 'not_applicable';
  note: string;
} {
  if (!userGotra || !partnerGotra || userGotra === 'Other / Not Known' || partnerGotra === 'Other / Not Known') {
    return {
      status: 'not_applicable',
      note: 'One or both Gotras are not specified. Gotra evaluation is skipped with no penalty.',
    };
  }

  const isSameGotra = userGotra.trim().toLowerCase() === partnerGotra.trim().toLowerCase();

  if (isSameGotra) {
    return {
      status: 'caution',
      note: `Both share the "${userGotra}" Gotra. Traditional Vedic custom advises avoiding Sagotra marriages for lineage exogamy; couples wishing to proceed often consult family traditions or genetic counseling.`,
    };
  }

  return {
    status: 'compatible',
    note: `Distinct Gotras (${userGotra} & ${partnerGotra}) align with traditional exogamous heritage principles.`,
  };
}

// Manglik Dosha Compatibility
export function evaluateManglikRule(
  userManglik: string,
  partnerManglik: string
): {
  status: 'compatible' | 'requires_consultation' | 'neutral';
  note: string;
} {
  const isUManglik = userManglik === 'manglik';
  const isPManglik = partnerManglik === 'manglik';
  const isUAnshik = userManglik === 'anshik_manglik';
  const isPAnshik = partnerManglik === 'anshik_manglik';

  if ((isUManglik && isPManglik) || (isUAnshik && isPAnshik)) {
    return {
      status: 'compatible',
      note: 'Both have matching Mars placements (Manglik / Anshik), creating mutual balance (Anukul Manglik Dosha Samya).',
    };
  }

  if (!isUManglik && !isPManglik && !isUAnshik && !isPAnshik) {
    return {
      status: 'compatible',
      note: 'Neither profile has strong Manglik influence. Astrological Mars balance is serene.',
    };
  }

  return {
    status: 'requires_consultation',
    note: 'One profile has Manglik/Anshik placement while the other does not. Astrological tradition suggests reviewing birth chart houses (1st, 4th, 7th, 8th, 12th) or seeking qualified Vedic guidance.',
  };
}
