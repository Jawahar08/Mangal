// Astra AI: Grounded Relationship & Compatibility Assistant
// Strictly adheres to project rules: Never invents scores, never hallucinates verification, explains limitations honestly.

import { UserProfile, CompatibilityScores } from '../types';

export interface AstraMessage {
  id: string;
  sender: 'user' | 'astra';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export function generateAstraInitialSummary(
  user: UserProfile,
  partner: UserProfile,
  scores: CompatibilityScores
): string {
  const { gunaScore, gotraStatus, gotraNote, manglikCompatibility, manglikNote, modernDimensions } = scores;

  const strongCount = modernDimensions.filter((d) => d.rating === 'Strong').length;
  const discussionCount = modernDimensions.filter((d) => d.rating === 'Needs discussion' || d.rating === 'Important conversation required').length;

  return `Namaste! I am **Astra**, your relationship intelligence assistant.

Here is an objective, grounded breakdown based on your profiles:

1. **Vedic Compatibility (Ashta Kuta)**:
   - **Score**: **${gunaScore} / 36 points**
   - **Gotra Assessment**: ${gotraStatus === 'compatible' ? 'Clear lineage alignment' : 'Same Gotra / Sagotra consideration'} — ${gotraNote}
   - **Manglik Harmony**: ${manglikCompatibility === 'compatible' ? 'Balanced Mars placements' : 'Requires gentle review'} — ${manglikNote}

2. **Modern Life Alignment**:
   - **Strongly Aligned Areas**: ${strongCount} dimensions (such as ${modernDimensions.slice(0, 2).map((d) => d.dimension).join(', ')})
   - **Recommended Conversation Topics**: ${discussionCount} dimensions to talk through openly.

💡 **Important Reminder**: Astrology and compatibility rubrics are tools for self-discovery and thoughtful discussion. They are never arbitrary determiners of relationship success. True lasting companionship is built on honesty, mutual kindness, and everyday commitment.

Feel free to ask me for specific conversation icebreakers or guidance on navigating differences!`;
}

export function getAstraResponse(
  userQuestion: string,
  user: UserProfile,
  partner: UserProfile,
  scores: CompatibilityScores
): { response: string; suggestedQuestions: string[] } {
  const lower = userQuestion.toLowerCase();

  if (lower.includes('guna') || lower.includes('score') || lower.includes('astrology')) {
    const topGunas = scores.gunaCategories.filter((g) => g.score === g.maxScore).map((g) => g.name);
    const lowGunas = scores.gunaCategories.filter((g) => g.score < g.maxScore).map((g) => g.name);

    return {
      response: `Your deterministic Ashta Kuta score is **${scores.gunaScore} out of 36 points**.

✨ **Full Score Areas**:
${topGunas.slice(0, 3).map((g) => `• ${g}`).join('\n')}

🔍 **Areas with Partial Points**:
${lowGunas.slice(0, 3).map((g) => `• ${g}`).join('\n') || 'None — exceptional full alignment across categories!'}

Traditional guidelines consider 18+ auspicious. The areas with partial points are not fatal flaws; they simply indicate areas (such as temperament or emotional rhythms) where active communication helps you understand each other's styles.`,
      suggestedQuestions: [
        'What questions should we ask about finances?',
        'How should we approach family boundaries?',
        'Tell me about ChaanBean verification for this profile.'
      ]
    };
  }

  if (lower.includes('money') || lower.includes('finance') || lower.includes('budget') || lower.includes('salary')) {
    const userFin = user.expectations.financialPhilosophy.replace(/_/g, ' ');
    const partnerFin = partner.expectations.financialPhilosophy.replace(/_/g, ' ');

    return {
      response: `**Financial Philosophy Analysis**:

• **Your Stance**: Prefers ${userFin}
• **${partner.name}'s Stance**: Prefers ${partnerFin}

${userFin === partnerFin 
  ? `You both align on ${userFin}! This gives you a strong starting foundation.` 
  : `You have slightly different perspectives on financial management (${userFin} vs ${partnerFin}). This is very common in modern partnerships.`}

💬 **Thoughtful questions to ask ${partner.name}**:
1. "How did your family handle money growing up, and how do you prefer budgeting today?"
2. "How do you feel about joint household accounts versus keeping independent personal funds?"
3. "What are your 3-year financial goals (home purchase, travel, investments)?"`,
      suggestedQuestions: [
        'How should we discuss living with family?',
        'What about career ambitions and relocation?',
        'How do we handle disagreements calmly?'
      ]
    };
  }

  if (lower.includes('trust') || lower.includes('chaanbean') || lower.includes('verification') || lower.includes('fake')) {
    const verifiedChecks = partner.trustProfile.checks.filter((c) => c.status === 'verified').map((c) => c.title);
    const pendingChecks = partner.trustProfile.checks.filter((c) => c.status !== 'verified').map((c) => c.title);

    return {
      response: `**ChaanBean Trust Status for ${partner.name}**:

🛡️ **Verified Credentials**:
${verifiedChecks.map((c) => `• ✅ ${c}`).join('\n')}

⏳ **User-Supplied or Pending Credentials**:
${pendingChecks.map((c) => `• ℹ️ ${c}`).join('\n')}

🔒 **Privacy Guard**: ChaanBean never reveals raw government documents, salary slips, or national ID numbers to other members. It only verifies validity and publishes a cryptographic verification badge. If a check is pending or unavailable, you can politely ask to discuss it once mutual comfort is established.`,
      suggestedQuestions: [
        'What are the best icebreakers to start our chat?',
        'Explain the Gotra compatibility rule',
        'How do we navigate parenting expectations?'
      ]
    };
  }

  if (lower.includes('family') || lower.includes('parents') || lower.includes('in-law') || lower.includes('living')) {
    return {
      response: `**Family & Living Arrangements**:

• **Family Values**: You value ${user.familyValues} traditions; ${partner.name} values ${partner.familyValues} traditions.
• **Family Structure**: You come from a ${user.familyType} family; ${partner.name} comes from a ${partner.familyType} family.

💬 **Gentle Conversation Starters**:
1. "How involved are your parents in major decisions, and what does a healthy weekend look like with family?"
2. "What are your expectations regarding living arrangements after marriage — independent apartment or joint living?"
3. "How do we balance festive visits and holidays fairly between both families?"`,
      suggestedQuestions: [
        'What questions should we ask about finances?',
        'How do we handle disagreements calmly?',
        'Explain our Vedic 36 Guna score'
      ]
    };
  }

  // Default thoughtful answer
  return {
    response: `Thank you for sharing your thoughts about your connection with ${partner.name}.

When getting to know someone for marriage, moving through deliberate steps helps:
1. **Connect on Values**: Ensure fundamental life goals and mutual respect match before getting attached.
2. **Paced Disclosure**: Share personal hopes, career dreams, and expectations at a comfortable, natural pace.
3. **Verify What Matters**: Rely on ChaanBean's consent-backed verification badges to confirm essential credentials.

Would you like specific conversation prompts for today's chat, or an astrological drilldown on a particular Kuta?`,
    suggestedQuestions: [
      'Give me 3 icebreakers for our first chat',
      'Tell me about our financial alignment',
      'Explain our Vedic 36 Guna score'
    ]
  };
}
