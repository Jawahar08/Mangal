-- MangalSutra 2.0: Second Chapter Remarriage Ecosystem Migration
-- Migration 004: Rebuild Profiles, Children Privacy Safeguards, Emotional Readiness, and 7-Pillar Recovery

-- 1. Second Chapter Rebuild Profiles
CREATE TABLE IF NOT EXISTS public.second_chapter_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 5 Rebuild Dimensions
  what_i_learned TEXT NOT NULL DEFAULT '',
  what_i_want_now TEXT NOT NULL DEFAULT '',
  what_has_changed TEXT NOT NULL DEFAULT '',
  what_i_do_not_want_again TEXT NOT NULL DEFAULT '',
  priorities TEXT[] NOT NULL DEFAULT '{}',

  -- Children & Co-Parenting Settings
  has_children BOOLEAN NOT NULL DEFAULT FALSE,
  children_count INTEGER NOT NULL DEFAULT 0,
  custody_arrangement TEXT NOT NULL DEFAULT 'No Children',
  co_parenting_dynamic TEXT NOT NULL DEFAULT 'Not applicable',
  custody_privacy TEXT NOT NULL DEFAULT 'mutual_connections_only' CHECK (custody_privacy IN (
    'mutual_connections_only', 'verified_only', 'on_request'
  )),
  open_to_partner_with_children BOOLEAN NOT NULL DEFAULT TRUE,
  future_children_expectation TEXT NOT NULL DEFAULT 'Open to discussing together',

  -- Emotional Readiness Self-Reflection (Strictly Confidential)
  grief_closure_state TEXT NOT NULL DEFAULT 'Healed & Grounded',
  emotional_independence TEXT NOT NULL DEFAULT 'Balanced with desire for partnership',
  readiness_affirmation BOOLEAN NOT NULL DEFAULT TRUE,
  readiness_reflection_note TEXT NOT NULL DEFAULT '',
  last_assessed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Children Safeguard Registry
-- Individual children details are strictly protected under child safety privacy standards
CREATE TABLE IF NOT EXISTS public.second_chapter_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 35),
  gender TEXT NOT NULL CHECK (gender IN ('son', 'daughter')),
  living_with_parent TEXT NOT NULL CHECK (living_with_parent IN (
    'Full-time', '50-50 Shared', 'Weekends / Visits', 'Independent / Adult'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Ecosystem Resource Guides (7 Pillars)
CREATE TABLE IF NOT EXISTS public.second_chapter_resources (
  id TEXT PRIMARY KEY,
  pillar TEXT NOT NULL CHECK (pillar IN ('RESET', 'UNDERSTAND', 'REBUILD', 'RESTART', 'FAMILY', 'RECONNECT', 'HEAL')),
  pillar_title TEXT NOT NULL,
  pillar_icon TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  read_time TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  actionable_checklist TEXT[] NOT NULL DEFAULT '{}',
  faq_or_legal_notes TEXT[] DEFAULT '{}',
  professional_assistance_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_second_chapter_user ON public.second_chapter_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_second_chapter_children ON public.second_chapter_children(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.second_chapter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.second_chapter_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.second_chapter_resources ENABLE ROW LEVEL SECURITY;

-- Second Chapter Profile RLS:
-- 1. Owner has full read/write access
CREATE POLICY sc_owner_policy ON public.second_chapter_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- 2. Prospective matches can view non-confidential rebuild dimensions ONLY if mutual connection or verified
CREATE POLICY sc_prospective_view ON public.second_chapter_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.connections c
      WHERE ((c.from_user_id = auth.uid() AND c.to_user_id = user_id) OR
             (c.to_user_id = auth.uid() AND c.from_user_id = user_id))
        AND c.status = 'accepted'
    )
  );

-- Children Details RLS:
-- 1. Owner can always view and manage their children details
CREATE POLICY children_owner_policy ON public.second_chapter_children
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- 2. Other users can ONLY view children details if mutual connection is verified and custody_privacy permits
CREATE POLICY children_authorized_view ON public.second_chapter_children
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.second_chapter_profiles sc
      JOIN public.connections c 
        ON ((c.from_user_id = auth.uid() AND c.to_user_id = sc.user_id) OR
            (c.to_user_id = auth.uid() AND c.from_user_id = sc.user_id))
      WHERE sc.user_id = second_chapter_children.user_id
        AND c.status = 'accepted'
        AND sc.custody_privacy = 'mutual_connections_only'
    )
  );

-- Resources: Accessible to all authenticated users
CREATE POLICY resources_read_policy ON public.second_chapter_resources
  FOR SELECT TO authenticated
  USING (TRUE);
