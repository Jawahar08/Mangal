# REPOSITORY AUDIT AND UX GAP PROMPT

Read the Master Prompt and the complete feature-coverage index first. Treat the PDF and project specification as product requirements and development workflow context. This task is an evidence-based repository audit; do not make major code, schema, or framework changes while performing it.

## Objective

Explain what exists, what works, what is partial, and what is missing before proposing implementation. The repository, not the brief, is the evidence for current state.

## Inspect

Review the complete project structure, README and project docs, package manifests and exact dependency versions, app entry points, routes, UI patterns, responsive layouts, design system, tests, lint/build scripts, authentication and authorization, database schema and migrations, API/Edge functions, match and discovery logic, compatibility/astrology, AI/Astra, messaging/notifications, verification/ChaanBean, Android/Capacitor if present, and external service configuration. Follow relevant imports and call paths; do not infer implementation from filenames alone.

Do not expose secrets in the report. Confirm secret handling by describing where secrets are expected and whether client bundles/config appear to expose them.

## Required report

1. **Project overview:** repository layout, runtime/deployment setup, and actual stack/version evidence.
2. **Architecture:** front end, server/API/Edge functions, database, AI, messaging, verification, and platform integrations; explain how data flows in plain language.
3. **Current experience:** routes/pages, primary navigation, design patterns, responsive behavior, user journeys, and major interaction states.
4. **Auth and permissions:** account creation/login/recovery, session handling, authorization locations, roles, and sensitive operations.
5. **Data:** actual schema and migrations, named objects that exist, their relationships, access policies, retention/deletion clues.
6. **Feature matrix:** map every entry in the feature-coverage index to actual evidence and one status: implemented and tested; implemented but not fully verified; partial; mocked/simulated; missing; blocked by external dependency. Include evidence paths/symbols and state what test or proof supports the status. Mark uncertain items unknown, not implemented.
7. **Gap analysis:** what should be reused, repaired, redesigned, implemented, or validated; note dependencies and sequencing.
8. **UX audit:** confusing journeys, unnecessary steps, weak hierarchy, missing feedback, accessibility problems, responsive issues, user trust and privacy friction.
9. **Security and privacy review:** sensitive-data boundaries, consent, document access, message/couple privacy, authorization, logs, retention/deletion, abuse/block/report, and known unknowns. This is a product/code review, not legal advice.
10. **Integration blockers:** availability, credentials, authorization, coverage, jurisdiction, and permitted-use questions for each external provider. Never presume DigiLocker, eCourts, police/antecedent, employer, education, payment, AI, or notification access exists.
11. **Reusable code and duplication:** identify concrete existing components/services/schema and duplicated or unfinished logic.
12. **Prioritized plan:** propose the smallest coherent Phase 1 vertical slice first, then preserve dependencies through the six-phase roadmap. Include acceptance criteria and validation needs.
13. **First journey:** recommend the first user journey to design and why, with entry, screens, action, privacy boundary, failure states, completion criteria.
14. **Open questions:** list only decisions that cannot be resolved from code or source documents.

## Output format

Start with a concise executive summary, then the 14 sections above. Include a feature matrix table with feature, source module, observed status, evidence, gap/next step. Use actual repository-relative paths and line/symbol references where possible. Distinguish observations from recommendations. Do not produce a giant speculative implementation plan.

Finish with:
- What can be safely reused now.
- The top UX/privacy/architecture risks.
- The recommended first implementation slice.
- A short list of confirmations needed before major changes.

Stop after the audit and report. Do not begin feature implementation in this task.
