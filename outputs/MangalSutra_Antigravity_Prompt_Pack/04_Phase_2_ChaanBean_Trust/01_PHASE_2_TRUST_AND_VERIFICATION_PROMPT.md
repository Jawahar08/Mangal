# PHASE 2 — CHAANBEAN TRUST AND VERIFICATION PROMPT

Read the Master Prompt, feature index, audit, and relevant Phase 1 architecture. Implement Phase 2 only after confirming a legally authorized, technically available provider or a truthful manual-review workflow. Do not equate a proposed integration in the brief with an available integration.

## Goal

Build an evidence-based, consent-led verification experience with clear limits, strong privacy boundaries, auditable status changes, and a dignified user experience. ChaanBean holds the sensitive trust workflow; general matchmaking surfaces receive only status and minimum authorized metadata.

## Verification scope

Support the check categories that are actually available and approved:

- Mobile and email confirmation.
- Identity and date of birth; birth-certificate verification only when an authorized source supports it.
- Address.
- Education and certificates.
- Employment and professional licence.
- Marriage status and marriage certificate.
- Divorce status and supporting documents.
- Court screening, with lawful/appropriate process and cautious result wording.
- Police/antecedent checks only through an authorized workflow and where available.
- Optional, user-controlled caste/community certificate.
- Optional income verification.
- Consent-based references.

Potential paths named in the brief include DigiLocker, eCourts, authorized government services, issuers, institutions, employers, and qualified service providers. For every path, verify access, authorization, jurisdiction, coverage, permitted use, data retention, and credentials. If no real provider exists, implement only an explicitly labeled pending/manual/unavailable workflow. Never simulate a completed verification.

## User flow

1. The person opens the Trust Profile and chooses a check.
2. Explain the check purpose, requested data/documents, provider or reviewer, limits, who can see the result, retention, and how to correct a result.
3. Ask for explicit, revocable consent before requesting or submitting sensitive information. Record consent, scope, timestamp, and relevant version.
4. Accept supported evidence securely; provide file/type/size guidance, progress, retry, interrupted-upload recovery, missing-document feedback, and safe deletion.
5. Track pending, unavailable, review-required, and complete states. Do not conflate provider failure or missing coverage with a negative finding.
6. Let the user review the result, request correction/review where appropriate, and select whether a limited badge is visible and to whom.
7. Show verification date and a short, limited description. Never show documents, full judgments, custody information, or raw sensitive records to another member.

## Status and wording

Use accessible labels and explanations for: Verified; Pending; Verification unavailable; User supplied; Further review required. Do not rely on status color alone. A pending check is not a failure. “No matching public court record identified” is not proof that no case exists; account for similar names and source coverage. Never claim unrestricted police/CCTNS access. Never turn checks into an unexplained good/bad, safe/dangerous, or trust score.

Where lawful and supported by the real provider, record which identifiers were searched, such as party name, case/CNR number, or FIR number. Explain query and source coverage limits; a name-only search can produce false matches.

For marital status, support declared states: Never married, Married, Divorced, Widowed, Separated, Annulled. Only request evidence appropriate to the declared state. For never-married declarations, consider supporting documents and government marriage records only where accessible. Potential divorce evidence includes decree/order, case or CNR details where available, marriage certificate, date, and voluntarily disclosed children/custody details. Custody details remain private by default.

## Architecture and security requirements

- Inspect actual schema and existing chaanbean_requests before designing migrations.
- Keep Trust Vault evidence separate from public/profile data. Store minimum results in the matchmaking layer.
- Enforce authorization server-side for every read/write and provider call. Never place privileged credentials in client code.
- Define encryption, scoped access, access logs, retention/deletion, correction, and incident/support handling.
- Proposed tables in the feature index are options to assess, not a migration checklist. Design ownership, relationships, constraints, indexes, RLS/authorization, retention, and deletion before schema work.
- Keep provider credentials and integration-specific logic at a trusted server/Edge boundary.
- Record provenance and distinguish user-supplied statements from independently verified evidence.
- Avoid retaining raw provider responses longer than needed and never display more detail than authorized.

## Acceptance criteria

A user can understand and consent to a specific real check, submit evidence safely or see a truthful unavailable path, follow progress, understand the result and its limits, correct/manage visibility, and revoke or manage consent where supported. Other users see only explicitly approved, limited metadata. Unauthorized access attempts are denied and auditable. Report which providers are real, which are not connected, and what the system cannot conclude. Do not claim legal compliance without qualified review.



