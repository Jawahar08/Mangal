// Comprehensive Compatibility Engine: 36 Guna + Gotra + Manglik + 12 Modern Dimensions

import { UserProfile, CompatibilityScores } from '../types';
import { calculateAshtaKuta, evaluateGotraRule, evaluateManglikRule } from './astrologyEngine';

export function computeComprehensiveCompatibility(
  user: UserProfile,
  partner: UserProfile
): CompatibilityScores {
  // 1. Vedic Ashta Kuta (36 Guna)
  // Ensure we pass groom/bride according to gender or order
  const isUserMale = user.gender === 'male';
  const groomAstro = isUserMale ? user.astrology : partner.astrology;
  const brideAstro = isUserMale ? partner.astrology : user.astrology;

  const { totalScore, categories } = calculateAshtaKuta(groomAstro, brideAstro);

  // 2. Gotra evaluation
  const gotraResult = evaluateGotraRule(user.astrology.gotra, partner.astrology.gotra);

  // 3. Manglik evaluation
  const manglikResult = evaluateManglikRule(user.astrology.manglikStatus, partner.astrology.manglikStatus);

  // 4. Modern 12 Dimensions Evaluation
  const modernDimensions = [
    {
      dimension: 'Communication Style',
      rating: 'Strong' as const,
      userPerspective: 'Values direct, empathetic, and timely communication.',
      partnerPerspective: 'Appreciates thoughtful listening before responding.',
      advice: 'Harmonious communication foundation. Keep shared check-ins routine.',
    },
    {
      dimension: 'Emotional Maturity',
      rating: 'Strong' as const,
      userPerspective: 'Grounded and self-aware under stress.',
      partnerPerspective: 'Focuses on emotional resilience and mutual validation.',
      advice: 'High mutual emotional intelligence brings stability during stressful periods.',
    },
    {
      dimension: 'Financial Philosophy',
      rating: user.expectations.financialPhilosophy === partner.expectations.financialPhilosophy 
        ? ('Strong' as const) 
        : ('Needs discussion' as const),
      userPerspective: `Prefers ${user.expectations.financialPhilosophy.replace(/_/g, ' ')}.`,
      partnerPerspective: `Prefers ${partner.expectations.financialPhilosophy.replace(/_/g, ' ')}.`,
      advice: user.expectations.financialPhilosophy === partner.expectations.financialPhilosophy
        ? 'Shared vision on budgeting, savings, and investments.'
        : 'Discuss how day-to-day expenses, big-ticket savings, and joint vs individual accounts will be managed.',
    },
    {
      dimension: 'Career Expectations',
      rating: user.profession && partner.profession ? ('Strong' as const) : ('Needs discussion' as const),
      userPerspective: `${user.profession || 'Professional career'} in ${user.currentCity}.`,
      partnerPerspective: `${partner.profession || 'Professional career'} in ${partner.currentCity}.`,
      advice: 'Clarify mutual expectations on career growth, long hours, and potential geographic relocation.',
    },
    {
      dimension: 'Children & Parenting',
      rating: user.expectations.childrenExpectations === partner.expectations.childrenExpectations
        ? ('Strong' as const)
        : ('Important conversation required' as const),
      userPerspective: user.expectations.childrenExpectations.replace(/_/g, ' '),
      partnerPerspective: partner.expectations.childrenExpectations.replace(/_/g, ' '),
      advice: user.expectations.childrenExpectations === partner.expectations.childrenExpectations
        ? 'Mutual alignment on family planning aspirations.'
        : 'Crucial to discuss timelines, parenting philosophies, and expectations regarding children early.',
    },
    {
      dimension: 'Living Arrangements',
      rating: user.familyType === partner.familyType ? ('Strong' as const) : ('Needs discussion' as const),
      userPerspective: `${user.familyType} family preference.`,
      partnerPerspective: `${partner.familyType} family preference.`,
      advice: 'Discuss expectations around living independently versus living with or near extended family.',
    },
    {
      dimension: 'Family Boundaries',
      rating: 'Strong' as const,
      userPerspective: `${user.familyValues} family values.`,
      partnerPerspective: `${partner.familyValues} family values.`,
      advice: 'Mutual respect for parental involvement while maintaining couple autonomy.',
    },
    {
      dimension: 'Religion & Spirituality',
      rating: user.religion === partner.religion ? ('Strong' as const) : ('Needs discussion' as const),
      userPerspective: `${user.religion} (${user.community || 'Heritage'}).`,
      partnerPerspective: `${partner.religion} (${partner.community || 'Heritage'}).`,
      advice: user.religion === partner.religion
        ? 'Shared cultural traditions and spiritual background.'
        : 'Celebrate mutual heritage and discuss how festivals and traditions will be integrated.',
    },
    {
      dimension: 'Lifestyle & Daily Habits',
      rating: user.diet === partner.diet ? ('Strong' as const) : ('Needs discussion' as const),
      userPerspective: `Diet: ${user.diet}, Drinking: ${user.drinking}, Smoking: ${user.smoking}.`,
      partnerPerspective: `Diet: ${partner.diet}, Drinking: ${partner.drinking}, Smoking: ${partner.smoking}.`,
      advice: user.diet === partner.diet
        ? 'Naturally aligned dietary lifestyle at home.'
        : `One is ${user.diet} and the other is ${partner.diet}. Agree on kitchen preferences and dining habits.`,
    },
    {
      dimension: 'Intimacy Expectations',
      rating: 'Needs discussion' as const,
      userPerspective: 'Values emotional warmth, vulnerability, and mutual physical affection.',
      partnerPerspective: 'Appreciates pacing, building comfort, and affectionate quality time.',
      advice: 'Gentle conversational pacing recommended as emotional trust deepens.',
    },
    {
      dimension: 'Conflict Resolution',
      rating: 'Strong' as const,
      userPerspective: 'Prefers calm discussion over confrontation; gives space when needed.',
      partnerPerspective: 'Looks for constructive solutions and gentle repair attempts.',
      advice: 'Both lean towards de-escalation rather than prolonged conflict.',
    },
    {
      dimension: 'Personal Growth & Ambition',
      rating: 'Strong' as const,
      userPerspective: 'Enjoys continuous learning, fitness, and personal pursuits.',
      partnerPerspective: 'Values intellectual curiosity and supporting partner goals.',
      advice: 'Encouraging atmosphere for mutual personal growth.',
    },
  ];

  // Overall assessment synthesis
  let overall = '';
  if (totalScore >= 28) {
    overall = `Exceptional Guna score (${totalScore}/36) with balanced astrological alignment. The relationship shows high promise in temperamental and cultural harmony, complemented by solid modern compatibility in communication and family values.`;
  } else if (totalScore >= 18) {
    overall = `Favorable Guna score (${totalScore}/36). Astrological alignment meets traditional auspicious thresholds. The pairing shows meaningful areas of strength alongside specific topics that warrant open conversation.`;
  } else {
    overall = `Guna score (${totalScore}/36) falls below traditional 18-point threshold. However, Vedic tradition notes that strong personal compatibility, mutual respect, and planetary charts can mitigate classical doshas. We encourage open discussion on highlighted areas.`;
  }

  return {
    gunaScore: totalScore,
    gunaMax: 36,
    gunaCategories: categories,
    gotraStatus: gotraResult.status,
    gotraNote: gotraResult.note,
    manglikCompatibility: manglikResult.status,
    manglikNote: manglikResult.note,
    modernDimensions,
    overallAssessment: overall,
  };
}
