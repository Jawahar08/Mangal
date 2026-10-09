# CROSS-PHASE ACCEPTANCE AND RELEASE REVIEW PROMPT

Use this prompt after each implementation slice and before a release. Read the Master Prompt, feature index, approved scope, and repository audit. Review evidence; do not assume implementation is complete from a status update.

## Review

1. Compare changed behavior with the approved user goal, journey, acceptance criteria, and feature-index items. Identify scope that is postponed and preserve it in the backlog.
2. Verify each visible action actually works. Find inert buttons, placeholder links, fake success messages, simulated data presented as real, and unhandled states.
3. Review loading, success, failure, empty, missing-data, validation, unauthorized, pending, provider-unavailable, retry, unsaved-change, interrupted-upload, and expired-session states as relevant.
4. Review mobile, tablet, and desktop behavior; semantic structure; keyboard/focus; screen-reader labels; contrast; reduced-motion; accessible dialogs and errors.
5. Review authorization and data boundaries, especially profile/private data, verification evidence, consent, messages, private couple reflections, children/custody details, user-selected visibility, deletion/retention, and audit events.
6. Confirm service/provider status and provenance. Clearly separate live, partial, mock, planned, and blocked behavior. Confirm that a user-supplied value is not described as independently verified.
7. Confirm compatibility and AI do not invent calculation results, court/police facts, legal conclusions, risk findings, or relationship diagnoses. State uncertainty and limitations.
8. Inspect schema/API changes for ownership, authorization, constraints, indexes, migration safety, retention/deletion, and backward compatibility.
9. Confirm the focused navigation matches the current release and future destinations remain in the roadmap rather than crowding primary navigation.
10. Run only appropriate checks for the change and report their exact commands/results. Never claim a check passed unless it was run. Identify manual review still needed.

## Business/navigation check when relevant

Treat tiers as proposals until entitlement rules are approved:
- Free: basic profile, discovery, compatibility.
- Premium: advanced matching, full compatibility, AI relationship assistant, additional conversation capabilities.
- Verified: ChaanBean trust profile, document/marriage verification.
- Premium Verified: advanced verification bundle, priority matching, relationship assessment, marriage preparation.
- Couple: couple journey, readiness, Pratha, wellness, counselling.

Payment must never imply verification, safety, or compatibility. Check the eventual IA in the feature index against the current scoped release. Keep account/security/privacy/notifications/support/data access/deletion reachable.

## Report

Provide:
- Implemented behavior and changed files.
- Feature-index items completed, partial, blocked, and deliberately deferred.
- Evidence for verification and exact checks actually run.
- UX, accessibility, privacy, security, and integration issues found.
- Regressions or unresolved risks.
- Recommended next vertical slice and acceptance criteria.

Do not silently expand scope, remove requirements, or mark the full project complete because one phase has shipped.
