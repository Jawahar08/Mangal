// Phase 4: Fuzzy Name Matching & Document Identity Reconciliation Engine
// Resolves real-world Indian naming variations across government documents (Aadhaar, Passport, Degrees, eCourts)
// Strips honorifics, handles initials, token-sort permutations, and calculates confidence scores.

export type NameMatchTier = 'exact' | 'high_confidence' | 'manual_review_required' | 'mismatch';

export interface FuzzyNameMatchResult {
  score: number; // 0 to 100
  tier: NameMatchTier;
  isAcceptableForAutoVerification: boolean;
  normalizedProfileName: string;
  normalizedDocumentName: string;
  extractedHonorifics: string[];
  diagnostics: string;
}

const INDIAN_HONORIFICS = new Set([
  'dr',
  'doctor',
  'er',
  'engr',
  'engineer',
  'adv',
  'advocate',
  'ca',
  'shri',
  'shree',
  'smt',
  'shrimati',
  'mr',
  'ms',
  'mrs',
  'prof',
  'professor',
  'pandit',
  'pt',
]);

// Helper: Levenshtein distance between two strings
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Clean and normalize name token array
function normalizeTokens(name: string): { tokens: string[]; honorifics: string[] } {
  if (!name) return { tokens: [], honorifics: [] };

  // Lowercase and remove punctuation
  const cleaned = name
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const rawTokens = cleaned.split(' ').filter(Boolean);
  const honorifics: string[] = [];
  const tokens: string[] = [];

  for (const t of rawTokens) {
    if (INDIAN_HONORIFICS.has(t)) {
      honorifics.push(t);
    } else {
      tokens.push(t);
    }
  }

  return { tokens, honorifics };
}

export const FuzzyNameMatcher = {
  // Normalize a name for clean display
  normalize(name: string): string {
    const { tokens } = normalizeTokens(name);
    return tokens.join(' ');
  },

  // Match Profile Name against Document Name
  matchNames(profileName: string, documentName: string): FuzzyNameMatchResult {
    const prof = normalizeTokens(profileName);
    const doc = normalizeTokens(documentName);

    const normProf = prof.tokens.join(' ');
    const normDoc = doc.tokens.join(' ');
    const extractedHonorifics = Array.from(new Set([...prof.honorifics, ...doc.honorifics]));

    // 1. Direct equality after honorific stripping
    if (normProf === normDoc && normProf.length > 0) {
      return {
        score: 100,
        tier: 'exact',
        isAcceptableForAutoVerification: true,
        normalizedProfileName: normProf,
        normalizedDocumentName: normDoc,
        extractedHonorifics,
        diagnostics: 'Exact character-for-character match after removing honorifics.',
      };
    }

    // 2. Token Set Permutation Match (e.g. "Sen Ananya" vs "Ananya Sen")
    const sortedProf = [...prof.tokens].sort().join(' ');
    const sortedDoc = [...doc.tokens].sort().join(' ');
    if (sortedProf === sortedDoc && sortedProf.length > 0) {
      return {
        score: 98,
        tier: 'exact',
        isAcceptableForAutoVerification: true,
        normalizedProfileName: normProf,
        normalizedDocumentName: normDoc,
        extractedHonorifics,
        diagnostics: 'Perfect match with transposed Indian surname/given-name order.',
      };
    }

    // 3. Initials and Abbreviation Handling (e.g. "Ananya S." vs "Ananya Sen" or "Rohan R. Deshmukh" vs "Rohan Deshmukh")
    let initialMatchBonus = 0;
    const profTokens = prof.tokens;
    const docTokens = doc.tokens;

    let matchedCount = 0;
    let initialMatches = 0;

    for (const pt of profTokens) {
      if (docTokens.includes(pt)) {
        matchedCount++;
      } else {
        // Check if pt is an initial that matches any docToken starting letter
        if (pt.length === 1 && docTokens.some((dt) => dt.startsWith(pt))) {
          initialMatches++;
        }
      }
    }

    for (const dt of docTokens) {
      if (!profTokens.includes(dt)) {
        if (dt.length === 1 && profTokens.some((pt) => pt.startsWith(dt))) {
          initialMatches++;
        }
      }
    }

    const maxTokens = Math.max(profTokens.length, docTokens.length);
    if (maxTokens > 0 && matchedCount + initialMatches >= maxTokens) {
      const score = Math.round(85 + (matchedCount / maxTokens) * 12);
      return {
        score: Math.min(score, 97),
        tier: 'high_confidence',
        isAcceptableForAutoVerification: true,
        normalizedProfileName: normProf,
        normalizedDocumentName: normDoc,
        extractedHonorifics,
        diagnostics: `High-confidence match with verified initial expansion (${initialMatches} initial(s) matched).`,
      };
    }

    // 4. Levenshtein String Similarity Ratio
    const maxLength = Math.max(normProf.length, normDoc.length);
    if (maxLength === 0) {
      return {
        score: 0,
        tier: 'mismatch',
        isAcceptableForAutoVerification: false,
        normalizedProfileName: '',
        normalizedDocumentName: '',
        extractedHonorifics,
        diagnostics: 'Empty name strings provided.',
      };
    }

    const dist = levenshteinDistance(normProf, normDoc);
    const rawRatio = Math.max(0, 1 - dist / maxLength);
    const calculatedScore = Math.round(rawRatio * 100);

    let tier: NameMatchTier = 'mismatch';
    let isAcceptable = false;
    let diag = '';

    if (calculatedScore >= 80) {
      tier = 'high_confidence';
      isAcceptable = true;
      diag = `High confidence phonetic / transliteration match (similarity: ${calculatedScore}%).`;
    } else if (calculatedScore >= 55) {
      tier = 'manual_review_required';
      isAcceptable = false;
      diag = `Moderate token similarity (${calculatedScore}%). Assigned to Senior Grievance Officer for manual verification review.`;
    } else {
      tier = 'mismatch';
      isAcceptable = false;
      diag = `Significant name mismatch (${calculatedScore}%). Document name deviates from candidate profile.`;
    }

    return {
      score: calculatedScore,
      tier,
      isAcceptableForAutoVerification: isAcceptable,
      normalizedProfileName: normProf,
      normalizedDocumentName: normDoc,
      extractedHonorifics,
      diagnostics: diag,
    };
  },
};
