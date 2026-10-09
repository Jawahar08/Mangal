# UX FOUNDATION AND JOURNEY DESIGN PROMPT

Use after the repository audit. Read the Master Prompt and feature-coverage index. Base all design choices on the audit evidence and existing brand/code patterns. This task establishes product structure and UX specifications; do not implement unrelated backend features.

## Objective

Turn the product vision into a calm, understandable, accessible experience. Preserve the complete long-term feature set but make the first-release experience focused. Do not expose every roadmap item in primary navigation.

## Work

1. **Prioritize journeys.** Map the new-user journey from homepage through registration, intent, profile, preferences, readiness, and discovery. Also map match understanding, trust verification, communication, marriage preparation, Second Chapter, post-marriage, and Pratha/marketplace journeys.
2. For each journey, specify user goal, entry point, screens, actions, information needed, when sensitive questions appear and why, private/shared boundaries, loading/empty/error/retry/unauthorized states, exit/skip/resume behavior, and completion criteria.
3. **Information architecture.** Recommend a focused Phase 1 navigation based on the actual app. Keep the complete later navigation as a future-state map. Include discover, matches, messages, trust, profile where supported by the audit.
4. **Onboarding.** Design a conversational, progressive flow with intent choice, freeform self-description, manual entry, biodata/profile upload, extraction review/correction, missing-data questions, optional skips, clear rationale for sensitive questions, save/resume, and failure recovery.
5. **Profile model.** Organize the user-facing profile into Who I Am, My Life, My Family, My Expectations, My Trust Profile. Validate required fields from the actual schema rather than inventing them.
6. **Compatibility and trust explanations.** Specify how results, limitations, missing data, evidence provenance, user-supplied data, pending/unavailable checks, and privacy visibility are explained without arbitrary scores or color-only meanings.
7. **Design system.** Propose reusable tokens and components for typography, colors, spacing, layouts/breakpoints, forms, validation, cards, badges, progress, consent, navigation, drawers/modals, toast, skeleton, empty/error/success/confirmation.
8. **Responsive and inclusive design.** Specify phone/tablet/desktop behavior, keyboard/focus, screen-reader labels, contrast, reduced motion, dialog behavior, validation announcements, meaningful icons, text labels with status, and touch targets.
9. **Prototype or implement only the approved design slice.** If the user asks for a visual prototype, connect real interactions where feasible and label unconnected concepts honestly. Avoid inert buttons and pretend success states.

## Deliverables

- Journey maps for all eight journey groups in the feature index.
- A screen inventory showing Phase 1 versus future destinations.
- Onboarding and profile interaction specification.
- Core component/token inventory.
- Responsive and accessibility checklist.
- A prioritized sequence of design/implementation slices, with acceptance criteria.
- Open questions tied to evidence gaps.

Do not redesign working flows without explaining why. Keep sensitive data out of public/profile surfaces unless the user explicitly chooses a visibility state.

