# COMPLETE FEATURE-COVERAGE INDEX

Use this checklist as the source-to-prompt traceability map. Preserve every item in the backlog even when assigned to a later phase. Confirm current implementation against the repository; the brief is not evidence that code, providers, permissions, or data already exist.

## 1. Vision, positioning, and ecosystem

- [ ] MangalSutra supports more than profile → like → match → chat. Its journey is discover, understand, verify, assess, connect, prepare, marry, nurture.
- [ ] Long-term outcome: find a person, understand one another, verify important information, prepare for marriage, marry, build a healthy family, live well, grow together.
- [ ] MangalSutra: discovery, profiles, matching, compatibility, messaging, and relationship journeys.
- [ ] ChaanBean: trust and verification infrastructure, protected evidence, consent, statuses, and audit.
- [ ] Pratha: optional spirituality, rituals, meditation, wellness, and relationship guidance.
- [ ] Marketplace: future wedding, couple wellbeing, spiritual and wellness products/services, experiences, and commerce.
- [ ] Maintain premium, human, trustworthy positioning. Candidate lines include “More Than a Match. A Life Journey.”, “Marriage, With Trust.”, and “Find. Verify. Understand. Belong.” Treat as options to validate, not simultaneous headlines.
- [ ] Supporting concepts: AI-powered matchmaking, Vedic compatibility, digital verification, relationship intelligence, spiritual wellbeing.
- [ ] Keep the four parts connected without making the site a generic dating product, card gallery, feature dump, or disconnected dashboards.
- [ ] PDF journey diagram also identifies Discover, Verify, Prepare, Connect, Engage, Marriage Ready, Pratha/Marketplace, Nurture, and Marriage Life.

## 2. Public website and homepage — Phase 1 prompt

- [ ] Premium, welcoming homepage that explains how the product differs from a conventional matrimonial service.
- [ ] Hero: “Find Your Life Partner With More Confidence.”
- [ ] Supporting line: “Compatibility. Verification. Wisdom. Wellbeing.”
- [ ] Four clear actions: Find a Match; Verify a Profile; Prepare for Marriage; Live a Better Marriage.
- [ ] Explain matchmaking, compatibility, what verification means and does not mean, ChaanBean, Pratha, and the wider relationship journey.
- [ ] Navigation to sign-up, login, product explanations, pricing only when real, safety, privacy, support, and legal information.
- [ ] Progressive disclosure; do not put every feature on the homepage.

## 3. Conversational onboarding — Phase 1 prompt; Second Chapter variants — Phase 4 prompt

- [ ] Intent options: marriage, remarriage, dating leading to marriage, life partner, and parent/guardian looking for a match.
- [ ] Define and enforce applicable age eligibility before matchmaking profile creation; verify current policy/legal requirements rather than assume. Do not create a matchmaking profile for an ineligible user.
- [ ] Conversational, adaptive, low-burden flow; do not start with dozens of questions.
- [ ] Manual entry and freeform self-description.
- [ ] Upload biodata or existing matrimonial profile; handle unsupported/invalid files, duplicates, interrupted uploads, and extraction errors.
- [ ] AI may extract age/date of birth, education, profession, location, family, lifestyle, interests, partner expectations, religion/community preferences, and marriage expectations.
- [ ] Review, correct, and validate extracted content. Never publish extracted information without user review.
- [ ] Ask only for missing information after extraction and validation.
- [ ] Explain sensitive questions; allow skipping optional questions; save progress and resume later.
- [ ] For parent/guardian intent, distinguish the account holder from the person whose profile is being created. Preserve the profile subject's agency and obtain appropriate authority and subject consent before publication or sharing.
- [ ] Explain whether uploaded files are processed by an AI or external provider, how they are stored/used, who can access them, and how they can be deleted; obtain appropriate consent and use only authorized processing.

## 4. Profiles and privacy — Phase 1 prompt

- [ ] Preserve useful profile fields: biodata, family background, education, occupation, lifestyle, hometown, horoscope inputs, partner preferences.
- [ ] Five profile layers: Who I Am; My Life; My Family; My Expectations; My Trust Profile.
- [ ] Expectations include marriage, children, location, career, lifestyle, and finances.
- [ ] Verify actual schema and business rules behind “20+ required fields”; do not invent mandatory fields.
- [ ] Profile readiness, editing and validation, preview, visibility, private fields, photo permissions, completion guidance.
- [ ] Avoid unnecessary disclosure; offer “Prefer not to say” where suitable.

## 5. Discovery, matching, messaging, and notifications — Phase 1 prompt

- [ ] Recommended and new matches, preference-based discovery, saved profiles, Second Chapter discovery, search, filters, match ranking.
- [ ] Detailed profiles explain identity, life, family, expectations, compatibility, and trust status.
- [ ] After mutual match, connect compatibility categories, user-approved limited trust statuses, important conversation topics, and an optional Pratha/couple-wellbeing invitation in one coherent journey, with private reflections kept separate.
- [ ] Explain recommendations where possible; no guarantee of success.
- [ ] Express interest, mutual connection, connection management.
- [ ] Photo access requests, private messaging, notifications, block/report.
- [ ] Mobile-first usable discovery and conversation flows.

## 6. Astrology, compatibility, and readiness — Phase 1 and Phase 3 prompts

- [ ] Astrology capabilities to inspect and preserve: 36 Guna/Guna Milan, Manglik, Nakshatra, Dosha, numerology, lifestyle chemistry, and four Gotra after verifying its exact existing rule.
- [ ] Modern compatibility dimensions: communication, emotional maturity, financial philosophy, career expectations, children, parenting, living arrangements, family boundaries, religion/spirituality, lifestyle, intimacy expectations, conflict resolution.
- [ ] Keep calculation engine separate from UI; use validated rules and inputs. Do not replace authoritative calculations with LLM guesses.
- [ ] Explain result source, limits, missing inputs, and differences.
- [ ] Use “Strong”, “Needs discussion”, and “Important conversation required”; avoid arbitrary marriage-success or credit-style scores.
- [ ] Readiness may say several areas are strong while identifying topics to discuss before engagement. Never predict marriage success.
- [ ] Consequential relationship assessments need a defensible method and appropriate expert input; do not present an unvalidated tool as clinical or scientific diagnosis.
- [ ] Astro AI/Astra consumes real calculated inputs such as Guna scores instead of inventing results.

## 7. ChaanBean trust and verification — Phase 2 prompt

- [ ] Dedicated MangalSutra Trust Profile associated with ChaanBean; explain the partnership between products.
- [ ] Potential checks: mobile, email, identity, age/DOB, birth certificate, education, employment, address, marital status, divorce status, court screening, police/antecedent only where authorized/available, certificates, and other permitted checks.
- [ ] Status vocabulary: verified, pending, unavailable, user supplied, further review required; explain each state and do not encode meaning by color alone.
- [ ] Show verification date and limited description/status only to audiences selected by the user; never disclose underlying documents to other members.
- [ ] Evidence-based, consent-based, auditable, purpose-limited checks; no “good/bad person” or unexplained trust/safety score.
- [ ] Provider paths to verify: DigiLocker, eCourts, authorized government services, document issuers, educational institutions, employers, qualified providers.
- [ ] Distinguish unavailable provider, pending result, review required, and verified result. Never claim unrestricted CCTNS/police access.
- [ ] Safe court wording: “No matching public court record identified” is not proof of no history. Similar names and record coverage create uncertainty.
- [ ] Caste/community certificate optional and user-controlled; income check optional; professional license through relevant authority; references consent-based.
- [ ] Trust Vault separates documents/evidence from matchmaking profile data. Restrict access, encrypt appropriately, log access, control retention/deletion, use scoped credentials.
- [ ] Consent UX states purpose, requested information, who may see the result, visibility choice, explicit consent, and an audit record.

## 8. Marital status and divorce — Phase 2 and Phase 4 prompts

- [ ] Marital statuses: never married, married, divorced, widowed, separated, annulled.
- [ ] Conditional evidence workflows appropriate to declared status; never-married verification may use a declaration, supporting documents, and government records only where accessible. Unavailable registry data does not prove status.
- [ ] Divorce evidence may include decree, court order, case/CNR details where available, marriage certificate, divorce date, and voluntarily shared child/custody information.
- [ ] Secure upload, review progress, missing-document feedback, correction/appeal, user-controlled visibility, limited summaries.
- [ ] A “Divorce Status Verified by MangalSutra Trust” style result appears only when actually supported.
- [ ] Dignified “Marital History” card may show previous marriage/status, verification provider/state, year, children, custody disclosed privately, and further details only after mutual consent.
- [ ] Never expose full judgments or sensitive custody details to other users.

## 9. Marriage intelligence, conversations, risk signals, Ask MS Trust — Phase 3 prompt

- [ ] “Talk Before You Marry”: personalized prompts for money/financial independence, parents/family duties, children/parenting, career/relocation, lifestyle/social life, religion/festivals, living arrangements, communication, conflict, and future goals.
- [ ] Private individual reflection before choosing to share; save, skip, revisit, proceed at the user's own pace.
- [ ] Couple Conversation Mode activates only after both agree; topics: Know Each Other, Money, Family, Home, Children, Spirituality, Intimacy, Mental Wellbeing, Career, Future.
- [ ] Private and shared content are distinct. Explicit sharing controls; shared notes only where appropriate; consent-based summaries and milestones. Never silently expose private answers.
- [ ] “Relationship Risk Signals” topics include extreme financial expectations, major child expectation differences, contradictory marital history, inconsistent profile, lifestyle mismatch, money pressure, refusal to discuss key topics, reported controlling behavior, repeated inconsistencies.
- [ ] Signals show source and uncertainty, suggest careful questions and qualified support where suitable; never declare someone dangerous/guilty based on an allegation, mismatch, or AI inference.
- [ ] Confidential “Ask MS Trust” explains missing information, documents to clarify, questions to ask, items to verify, and when professional/legal help may be appropriate.
- [ ] Assistant distinguishes verified facts, user statements, public-record limitations, and suggestions; use trusted references and controlled AI outputs.
- [ ] Counselling integrations only when real and appropriately qualified.

## 10. Second Chapter — Phase 4 prompt

- [ ] Dedicated but dignified path for divorced, widowed, separated where appropriate, single parents, and remarriage seekers.
- [ ] “New Beginning” / “Second Chapter” identity and rebuild profile: what I learned, want now, what changed, what I do not want again, priorities.
- [ ] Children/family details: children, age, custody/co-parenting, and future expectations; protect this sensitive information.
- [ ] Optional private emotional-readiness assessment/reflection.
- [ ] Second-marriage matching considers previous marriage, children, geography, family and financial expectations, emotional readiness, lifestyle, and partner acceptance of previous marriage.
- [ ] User may choose a Second Chapter pool/open-to-second-marriage discovery or “Show me everyone” where eligible; never permanently segregate.
- [ ] Recovery ecosystem: Reset (mental wellbeing), Understand (relationship education), Rebuild (legal/document assistance), Restart (financial planning), Family (children/co-parenting), Reconnect (relationship preparation), Heal (spiritual/wellbeing).
- [ ] Navigation includes divorce, widowed, single parents, healing, remarriage; respect privacy and avoid stigma.

## 11. Pratha — Phase 5 prompt

- [ ] Optional “inner life” layer, introduced as relationship nurtures after matching.
- [ ] Daily spiritual practice, relationship rituals, temple experiences, pooja, meditation, yoga, spiritual learning, festival calendar, couple prayers, home rituals.
- [ ] Personalization: Traditional (temple/pooja/rituals), Wellness (meditation/yoga/appropriate wellness), Modern Spiritual (mindfulness/relationship practices), Family (festivals/family rituals), Couple (joint meditation/gratitude/prayer).
- [ ] Respect different beliefs and preferences; no forced religious assumptions.
- [ ] Offer optional guided programs such as a 21-day couple wellbeing journey when content and service are real.
- [ ] Personalized recommendations and future single sign-on/service boundaries if separately operated.

## 12. Marketplace — Phase 6 prompt

- [ ] Before marriage: gifts, wellness, Ayurveda, skincare, grooming, meditation, books, couple experiences.
- [ ] Wedding: jewellery, clothing, pooja products, invitations, photography, travel, wedding services.
- [ ] After marriage: couple wellness, home products, relationship books, fitness, meditation, suitable wellness/spiritual goods.
- [ ] Handle intimacy/wellbeing sensitively and within applicable policy.
- [ ] Plan discovery, categories/search, product detail, vendors, real payment provider, orders, fulfillment, cancellations, refunds, support.
- [ ] Never implement fake checkout or show payment success without verified provider response; marketplace must not overwhelm matchmaking.

## 13. Couple journey, post-marriage, and health — Phase 3 prompt

- [ ] Optional, configurable shared milestones: Matched; Trust Check; Know Each Other; Important Conversations; Family Introduction; Marriage Readiness; Engagement; Wedding; First 100 Days; First Year; Long-term Wellbeing.
- [ ] Milestones are optional and adaptable, use mutual consent for shared progress, and are not a competition.
- [ ] First 100 Days: days 1–7 expectations; 8–30 communication; 31–60 money/family; 61–90 lifestyle; 91–100 relationship-health reflection.
- [ ] Both partners may answer independently; identify differences only as conversation prompts, not diagnosis or proof of failure.
- [ ] Optional annual anniversary check covers communication, emotional connection, financial stress, family, physical wellbeing, spiritual connection, time together, future goals.
- [ ] Optional next steps: counselling, couple experiences/retreat, Pratha, wellness program, qualified expert. Use privacy-preserving, non-diagnostic language.

## 14. Proposed business tiers — Cross-phase acceptance review prompt

- [ ] Proposed only; validate entitlements before implementing or pricing.
- [ ] Free: basic profile, discovery, compatibility.
- [ ] Premium: advanced matching, full compatibility, AI relationship assistant, additional/unlimited conversations as defined.
- [ ] Verified: ChaanBean Trust Profile, document verification, marriage verification.
- [ ] Premium Verified: advanced verification bundle, priority matching, relationship assessment, marriage preparation.
- [ ] Couple: couple journey, marriage readiness, Pratha, wellness, counselling.
- [ ] Payment never implies verified status, safety, or successful compatibility.

## 15. Navigation — all phase prompts

- [ ] Eventual IA: Home.
- [ ] Discover: Recommended Matches, New Matches, Second Chapter, Saved.
- [ ] Compatibility: Astrology, Guna Milan, Lifestyle, Personality, Relationship Compatibility.
- [ ] Trust/ChaanBean: Identity, Documents, Marriage, Divorce, Education, Employment, Court, authorized Police/Antecedent.
- [ ] Relationship: Talk Before Marriage, Couple Journey, Marriage Readiness, Counselling.
- [ ] Second Chapter: Divorce, Widowed, Single Parents, Healing, Remarriage.
- [ ] Pratha: Temples, Pooja, Spirituality, Meditation, Couple Practices.
- [ ] Marketplace: Wedding, Wellness, Couple, Spiritual.
- [ ] Our Marriage: Journey, First 100 Days, Wellbeing, Anniversary.
- [ ] Account and Safety: Profile Settings, Security, Privacy, Notifications, Blocking/Reporting, Support, Data Access/Deletion.
- [ ] Simplified Phase 1 primary navigation may start with Discover, Matches, Messages, Trust, My Profile, subject to audit. Do not surface every future feature in primary navigation.

## 16. Technical architecture and data — audit first

- [ ] Confirm actual framework/dependency versions. The brief mentions React, TypeScript, Vite, Supabase/PostgreSQL, Edge Functions, Gemini, Firebase Cloud Messaging, Capacitor for Android.
- [ ] Logical services to consider: frontend/design system; auth/authorization; API/Edge layer; match engine; astrology/compatibility engine; Astra AI; ChaanBean verification engine and Trust Vault; PostgreSQL/Supabase; authorized providers; Pratha; Marketplace.
- [ ] Existing objects named for inspection: profiles, private_profiles, preferences, connections, conversations, messages, photo_requests, chaanbean_requests, get_discovery_candidates().
- [ ] Proposed objects, not assumptions: verification_profiles, verification_requests, verification_documents, verification_results, document_issuer_records, marital_status_checks, divorce_checks, court_checks, police_verification_requests, education_verifications, employment_verifications, consent_records, audit_logs, relationship_assessments, couple_profiles, couple_journeys, relationship_conversations, second_chapter_profiles, wellbeing_programs, pratha_services, marketplace_products.
- [ ] Before schema creation establish ownership, access patterns, relationships, retention, deletion, and security boundaries. Use migration constraints, indexes, access policies, validation, and tests.
- [ ] Never put privileged credentials in frontend code or rely on browser-only authorization.

## 17. Privacy, safety, visual system, accessibility

- [ ] Data minimization, purpose limitation, clear privacy notices, meaningful consent, per-operation authorization, protected documents, limited visibility, access logs, retention/deletion.
- [ ] Secure auth/session management and recovery; correction of inaccurate profile/verification data; abuse/harassment response, block/report, escalation/support.
- [ ] Validate applicable privacy requirements, including relevant Indian data-protection obligations, against current authoritative sources and qualified review; do not claim compliance without evidence.
- [ ] Protect private messaging, couple reflections, custody details, children's personal information.
- [ ] Premium, calm, human, culturally thoughtful UI; possible warm ivory, burgundy/wine, restrained antique gold; validate against existing brand and usability.
- [ ] Reusable tokens/components for type/color/spacing/radii/elevation/layout/breakpoints, buttons/inputs/validation, cards/badges, progress, consent, tabs/navigation, drawers/modals, toast, skeleton, empty/error/success/confirmation.
- [ ] Responsive phone/tablet/laptop/desktop layouts and touch targets.
- [ ] Semantic structure, keyboard navigation, focus, screen-reader labels, sufficient contrast, clear validation, reduced motion, accessible dialogs/icons, text labels with status color.

## 18. Important user journeys

- [ ] New user: homepage → registration → intent → profile → preferences → readiness → discovery.
- [ ] Match: discovery → details → expectations → compatibility → trust status → interest → mutual connection.
- [ ] Verification: trust dashboard → select check → purpose → consent → evidence → progress → result → visibility.
- [ ] Communication: mutual connection → private conversation → privacy controls → guided prompts → optional couple mode.
- [ ] Marriage preparation: compatibility → Talk Before You Marry → private reflections → mutual sharing → journey milestones.
- [ ] Second Chapter: remarriage onboarding → profile/family/preferences → privacy → relevant discovery.
- [ ] After marriage: journey → First 100 Days → independent reflections → optional shared summary → annual check.
- [ ] Pratha/marketplace: explore → understand offering → details → real booking/payment only when implemented → confirmation/support.
- [ ] For each: goal, screens/actions, required data, privacy boundaries, failure states, completion criteria.

## 19. Six-phase roadmap

- [ ] Phase 1 — Web Launch: login/recovery, profile, marriage mode, discovery/matching, astrology, 36 Guna, four Gotra after rule validation, lifestyle compatibility, chat, Astro AI, basic verification, responsive UX, privacy/security foundation.
- [ ] Phase 2 — Trust: identity, DOB, address, education, employment, marriage certificate, divorce verification, court screening, authorized police/antecedent flow, certificate checks, statuses, consent, audit.
- [ ] Phase 3 — Marriage Intelligence: Talk Before Marriage, relationship compatibility, readiness, red/orange discussion signals, couple journey, counselling, First 100 Days.
- [ ] Phase 4 — Second Chapter: divorce/widow/single-parent, second marriage, healing, co-parenting, legal and financial resources, readiness, optional/dedicated discovery.
- [ ] Phase 5 — Pratha: temples, pooja, rituals, spiritual journeys, meditation, couple spirituality, personalized recommendations.
- [ ] Phase 6 — Marketplace: wedding, beauty/grooming, Ayurveda/wellness, couple/spiritual products, experiences, retreats, vendors/orders/operations.
- [ ] Do not build all six phases in the first release.

## 20. Required audit outputs and acceptance

- [ ] Audit: project overview; actual architecture/versioning; entry points/routing; design system/pages/journeys; auth; schema/migrations; APIs/Edge Functions; matching; astrology/compatibility; AI; messaging/notifications; verification; tests/build; security/privacy; accessibility/responsive; missing/duplicated/unfinished work; reusable code; blockers; prioritized sequence.
- [ ] Deliver comprehensive feature matrix, gap analysis, UX audit, phased backlog with dependencies/acceptance/test requirements, plain-language architecture explanation.
- [ ] Reference verified file paths, components, database objects, functions, and tests. Identify uncertainty rather than infer.
- [ ] Critical validation includes account flows, profiles, validation, visibility, discovery/matching, compatibility, message authorization, consent, unauthorized access, document controls, pending/failure checks, private vs shared couple answers, Second Chapter preferences, AI failure, account recovery/deletion, responsiveness/accessibility, empty/error/success/loading, migrations/API authorization, build integrity.
- [ ] Never report a test/build as passing unless it was run.
- [ ] Success means users understand the product, complete onboarding, understand match/compatibility/verification limits, control sharing, receive dignified experiences, use the product accessibly across devices, and every implemented action works honestly.



## Appendix — source Module A–T crosswalk

| Source module | Coverage section | Implementation prompt |
|---|---:|---|
| A — Public Website and Homepage | 2 | Phase 1 |
| B — Conversational Onboarding | 3 | Phase 1; Second Chapter variants |
| C — Profile Management | 4 | Phase 1 |
| D — Discovery and Matchmaking | 5 | Phase 1 |
| E — Astrology and Compatibility | 6 | Phase 1; Phase 3 |
| F — ChaanBean Trust Profile | 7 | Phase 2 |
| G — Marital Status and Divorce Verification | 8 | Phase 2; Second Chapter |
| H — Marriage Readiness | 6 | Phase 3 |
| I — Talk Before You Marry | 9 | Phase 3 |
| J — Couple Conversation Mode | 9 | Phase 3 |
| K — Relationship Risk Signals | 9 | Phase 3 |
| L — Ask MS Trust | 9 | Phase 3 |
| M — Second Chapter | 10 | Phase 4 |
| N — Pratha | 11 | Phase 5 |
| O — MangalSutra Marketplace | 12 | Phase 6 |
| P — Marriage Journey Dashboard | 13 | Phase 3 |
| Q — First 100 Days | 13 | Phase 3 |
| R — Annual Marriage Health Check | 13 | Phase 3 |
| S — Premium and Commercial Tiers | 14 | Cross-phase acceptance review |
| T — Complete Navigation Architecture | 15 | All phase prompts |






