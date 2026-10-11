-- MangalSutra 2.0: ChaanBean Trust Vault Migration
-- Migration 002: Evidence Quarantine, Purpose Limitation, Consent Ledger, Audit Trails, and Court Screenings

-- 1. ChaanBean Verification Requests & Status Ledger
CREATE TABLE IF NOT EXISTS public.chaanbean_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'identity', 'dob', 'address', 'education', 'employment', 
    'marital_status', 'court', 'police', 'caste_community', 'income', 'references'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'user_supplied' CHECK (status IN (
    'verified', 'pending', 'user_supplied', 'unavailable', 'further_review_required'
  )),
  visibility TEXT NOT NULL DEFAULT 'mutual_connections_only' CHECK (visibility IN (
    'mutual_connections_only', 'verified_members_only', 'public', 'hidden'
  )),
  document_type TEXT,
  provider_name TEXT,
  provider_type TEXT CHECK (provider_type IN (
    'digilocker', 'nad', 'ecourts', 'corporate_hr', 'manual_noc', 'self_affirmed'
  )),
  evidence_file_name TEXT,
  evidence_hash TEXT,
  verified_at TIMESTAMPTZ,
  source_note TEXT,
  correction_requested BOOLEAN NOT NULL DEFAULT FALSE,
  dispute_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_check UNIQUE (user_id, check_id)
);

-- 2. Quarantined Document Vault (Evidence isolated from matchmaking data)
-- Raw documents are NEVER exposed to prospective matches or public API endpoints
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.chaanbean_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  quarantine_status TEXT NOT NULL DEFAULT 'quarantined' CHECK (quarantine_status IN (
    'quarantined', 'reviewed_approved', 'reviewed_rejected', 'purged'
  )),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '180 days')
);

-- 3. Consent Ledger
-- Enforces purposeful consent, scope, and revocation tracking
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  scope TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '2.1',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_user_check_consent UNIQUE (user_id, check_id, version)
);

-- 4. Audit Trail Ledger (Append-Only)
-- Records all state transitions, consent actions, and document depositions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'consent_granted', 'consent_revoked', 'document_uploaded', 
    'status_changed', 'visibility_changed', 'dispute_raised'
  )),
  check_title TEXT NOT NULL,
  actor TEXT NOT NULL,
  details TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Court Screening Records
-- Strictly records query parameters and lawful non-defamatory disclaimer
CREATE TABLE IF NOT EXISTS public.court_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cnr_number TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  year TEXT NOT NULL,
  query_name TEXT NOT NULL,
  result_summary TEXT NOT NULL,
  caveat_note TEXT NOT NULL DEFAULT 'No matching public court record identified is not proof of absence of legal proceedings. Similar names and geographic coverage limits apply.',
  matching_records_count INTEGER NOT NULL DEFAULT 0,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Marital Verification Records
CREATE TABLE IF NOT EXISTS public.marital_verification_records (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  declared_status marital_status_type NOT NULL,
  declaration_affirmed BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  decree_date DATE,
  court_name TEXT,
  section_type TEXT,
  cnr_reference TEXT,
  custody_disclosed_privately TEXT,
  verified_at TIMESTAMPTZ,
  verification_badge TEXT NOT NULL DEFAULT 'Self-Affirmed Statement',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chaanbean_user ON public.chaanbean_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consent_records_user ON public.consent_records(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.chaanbean_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marital_verification_records ENABLE ROW LEVEL SECURITY;

-- Chaanbean Requests:
-- 1. Owner can see and manage all their checks
CREATE POLICY cb_owner_all ON public.chaanbean_requests
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- 2. Other users can ONLY view the public or connection-authorized badges (never quarantined evidence)
CREATE POLICY cb_public_badge_view ON public.chaanbean_requests
  FOR SELECT TO authenticated
  USING (
    visibility = 'public' OR
    (visibility = 'verified_members_only' AND EXISTS (
      SELECT 1 FROM public.chaanbean_requests r 
      WHERE r.user_id = auth.uid() AND r.status = 'verified'
    )) OR
    (visibility = 'mutual_connections_only' AND EXISTS (
      SELECT 1 FROM public.connections c
      WHERE ((c.from_user_id = auth.uid() AND c.to_user_id = user_id) OR
             (c.to_user_id = auth.uid() AND c.from_user_id = user_id))
        AND c.status = 'accepted'
    ))
  );

-- Quarantined Documents: ONLY the owner can ever see metadata. Matches NEVER get access.
CREATE POLICY doc_owner_only ON public.verification_documents
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Consent Ledger: ONLY the owner can read their consent history
CREATE POLICY consent_owner_only ON public.consent_records
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Audit Logs: Owner can view their own audit trail; append-only for authenticated callers
CREATE POLICY audit_owner_read ON public.audit_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY audit_insert_policy ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Court screening and Marital Records: Owner only, or shared under mutual consent
CREATE POLICY court_owner_only ON public.court_screenings
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY marital_owner_only ON public.marital_verification_records
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
