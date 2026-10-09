# PHASE 1 — MANGALSUTRA CORE WEB PROMPT

Read the Master Prompt, complete feature index, repository audit, and approved UX foundation. Implement only the smallest coherent Phase 1 web release that fits the actual repository. Reuse working code and preserve the full later-phase inventory.

## Phase 1 scope

### Public entry and account

- Create the welcoming public homepage using the specified headline, support line, and four user-goal actions: find a match, verify a profile, prepare for marriage, live a better marriage.
- Explain the product and its relationship to ChaanBean and Pratha without claiming unavailable features.
- Implement or improve sign-up, login, secure session handling, and account recovery using existing architecture.

### Intent and onboarding

- Support marriage, remarriage, dating leading to marriage, life-partner, and parent/guardian intents.
- Define and enforce applicable age eligibility before matchmaking profile creation; verify current policy/legal requirements rather than assume, and do not create matchmaking profiles for ineligible users.
- Build a progressive conversational onboarding flow. Allow manual entry, freeform description, biodata upload, existing matrimonial-profile upload, and review/correction of any extracted data.
- Extract only supported fields: age/DOB, education, profession, location, family, lifestyle, interests, expectations, religion/community preferences, and marriage expectations.
- Ask only for missing information. Explain sensitive questions, allow optional skip/“Prefer not to say”, save/resume, and handle invalid files, duplicate data, extraction failure, interruption, and retry.
- Never publish AI-extracted data before user review and confirmation.
- For parent/guardian intent, distinguish the account holder from the person whose profile is being created; obtain appropriate authority and the profile subject's consent before publishing or sharing their profile.
- Explain file/AI processing, storage, use, access, and deletion before upload; obtain appropriate consent and use only authorized processing.

### Profile

- Preserve the actual fields and rules found in the repository. Include existing biodata, family, education, occupation, lifestyle, hometown, horoscope, and partner preferences where present.
- Organize user-facing information into Who I Am, My Life, My Family, My Expectations, and My Trust Profile.
- Include readiness progress, editing/validation, preview, visibility controls, private information, photo permissions, and clear completion guidance.
- Verify the reported 20+ required fields against the schema; do not invent required answers.

### Discover, match, connect

- Build/reuse recommended and new matches, preferences, saved profiles, search/filter, match ranking, detailed profile, interest, mutual connection, connection management, and photo-access request flows as supported by the current backend.
- Make recommendations understandable where possible. Do not imply guaranteed relationship success.
- Include private messaging and notifications using real permissions/integrations. Include block/report and useful empty/loading/error states.
- Use focused initial navigation, such as Discover, Matches, Messages, Trust, My Profile, adjusted to existing routes.

### Astrology and compatibility

- Preserve existing 36 Guna/Guna Milan, Manglik, Nakshatra, Dosha, numerology, lifestyle chemistry, and four Gotra requirements only after inspecting exact source logic and existing rules.
- Add only validated compatibility dimensions or explain what is needed before implementation: communication, emotional maturity, money, career, children/parenting, living arrangements/family boundaries, religion/spirituality, lifestyle, intimacy expectations, and conflict resolution.
- Keep calculations separate from presentation and AI. Astra/Astro AI may explain known computed inputs; it must not invent scores or calculations.
- Display limitations, missing inputs, and result provenance using clear categories such as Strong, Needs discussion, Important conversation required. Do not use arbitrary marriage-success scores.

### Basic trust foundation

- Add a basic Trust Profile only to the extent supported by real verification capability. Use explicit states such as user supplied, pending, verified, unavailable, further review required.
- Explain each state. Keep evidence private and show only the user's chosen, limited status and necessary metadata.
- Do not fabricate identity, court, police, education, employment, marriage, certificate, or provider results. Advanced checks belong to Phase 2.

## Required implementation approach

- Before editing, confirm the audit and design deliverables are available. If not, provide the missing inspection first.
- Identify the target user journey, existing components/services to reuse, data contracts, privacy boundary, UI states, and acceptance criteria.
- Build a small complete vertical slice rather than a large screen collection.
- Use the actual tech stack and versions; do not migrate the framework/backend without evidence and a clear reason.
- Make controls functional. Do not add placeholder links, inert buttons, fake AI, mock matching presented as real, or success messages disconnected from backend results.
- Include mobile, tablet, and desktop behavior plus accessible semantics, keyboard/focus, validation, and reduced motion.

## Acceptance criteria

A new user can understand the product, select intent, create/review a profile, save and resume, set preferences and visibility, see discovery results with honest match explanations, understand compatibility limitations, and begin a protected conversation only when authorized. Every key state has usable feedback. Sensitive details are never exposed by default. Report changed files, real integration status, validation actually performed, and unresolved dependencies.


