-- MangalSutra 2.0: Marriage Intelligence & Couple Space Migration
-- Migration 003: Talk Before Marriage, Private Reflections, Couple Space Dual Opt-In, Risk Signals, and Journey Milestones

-- 1. Talk Before You Marry Topics & Private vs. Shared Reflections
CREATE TABLE IF NOT EXISTS public.talk_before_marriage_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Money & Finances', 'Parents & Family Duties', 'Children & Parenting', 
    'Career & Relocation', 'Living Arrangements', 'Conflict & Communication', 
    'Spirituality & Festivals', 'Future Ambitions'
  )),
  prompt TEXT NOT NULL,
  guidance TEXT NOT NULL,
  user_private_reflection TEXT NOT NULL DEFAULT '',
  is_shared_with_partner BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'private_draft', 'shared')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_partner_topic UNIQUE (user_id, partner_id, topic_id)
);

-- 2. Couple Space State (Enforces Mutual Dual Opt-In)
CREATE TABLE IF NOT EXISTS public.couple_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_a_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  user_b_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  is_couple_mode_active BOOLEAN GENERATED ALWAYS AS (user_a_opt_in AND user_b_opt_in) STORED,
  activated_at TIMESTAMPTZ,
  active_topic TEXT NOT NULL DEFAULT 'know_each_other' CHECK (active_topic IN (
    'know_each_other', 'money', 'family', 'home', 'children', 
    'spirituality', 'intimacy', 'wellbeing', 'career', 'future'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_couple_pair UNIQUE (user_a, user_b),
  CONSTRAINT chk_couple_distinct CHECK (user_a <> user_b)
);

-- 3. Couple Shared Notes (Only active when both partners have opted in)
CREATE TABLE IF NOT EXISTS public.couple_shared_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_space_id UUID NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Relationship Risk Signals
-- Non-punitive, supportive discussion prompts with evidentiary provenance
CREATE TABLE IF NOT EXISTS public.relationship_risk_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN (
    'Advisory (Green)', 'Needs Discussion (Amber)', 'Important Conversation (Rose)'
  )),
  observation TEXT NOT NULL,
  evidence_source TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  questions_to_ask TEXT[] NOT NULL DEFAULT '{}',
  professional_support_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Journey Milestones
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_space_id UUID NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  milestone_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('Pre-Marriage', 'Engagement & Wedding', 'Post-Marriage')),
  sort_order INTEGER NOT NULL,
  completed_by_user_a BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by_user_b BOOLEAN NOT NULL DEFAULT FALSE,
  is_mutual_completed BOOLEAN GENERATED ALWAYS AS (completed_by_user_a AND completed_by_user_b) STORED,
  completed_at TIMESTAMPTZ,
  CONSTRAINT uq_couple_milestone UNIQUE (couple_space_id, milestone_id)
);

-- 6. First 100 Days Reflections
CREATE TABLE IF NOT EXISTS public.hundred_days_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_space_id UUID NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  prompt_id TEXT NOT NULL,
  day_range TEXT NOT NULL CHECK (day_range IN ('Days 1–7', 'Days 8–30', 'Days 31–60', 'Days 61–90', 'Days 91–100')),
  theme TEXT NOT NULL,
  question TEXT NOT NULL,
  user_a_response TEXT NOT NULL DEFAULT '',
  user_a_shared BOOLEAN NOT NULL DEFAULT FALSE,
  user_b_response TEXT NOT NULL DEFAULT '',
  user_b_shared BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_couple_100day_prompt UNIQUE (couple_space_id, prompt_id)
);

-- 7. Annual Marriage Health Checks
CREATE TABLE IF NOT EXISTS public.annual_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_space_id UUID NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  communication_harmony TEXT NOT NULL,
  financial_stress_level TEXT NOT NULL,
  emotional_closeness TEXT NOT NULL,
  spiritual_connection TEXT NOT NULL,
  joint_goals TEXT NOT NULL DEFAULT '',
  last_checked_date DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT uq_couple_annual_check UNIQUE (couple_space_id, year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tbym_user ON public.talk_before_marriage_topics(user_id, partner_id);
CREATE INDEX IF NOT EXISTS idx_couple_spaces_users ON public.couple_spaces(user_a, user_b);
CREATE INDEX IF NOT EXISTS idx_risk_signals_users ON public.relationship_risk_signals(user_id, partner_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.talk_before_marriage_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_shared_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hundred_days_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_health_checks ENABLE ROW LEVEL SECURITY;

-- Talk Before Marriage RLS:
-- 1. Owner can always read and update their own reflection
CREATE POLICY tbym_owner_policy ON public.talk_before_marriage_topics
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- 2. Partner can SELECT ONLY IF is_shared_with_partner is TRUE
CREATE POLICY tbym_partner_view ON public.talk_before_marriage_topics
  FOR SELECT TO authenticated
  USING (auth.uid() = partner_id AND is_shared_with_partner = TRUE);

-- Couple Spaces:
CREATE POLICY couple_space_participants ON public.couple_spaces
  FOR ALL TO authenticated
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Couple Notes: Visible only to participants of an active space
CREATE POLICY couple_notes_policy ON public.couple_shared_notes
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.couple_spaces s
    WHERE s.id = couple_space_id 
      AND (s.user_a = auth.uid() OR s.user_b = auth.uid())
      AND s.is_couple_mode_active = TRUE
  ));

-- Relationship Risk Signals: Accessible only to the user who requested intelligence
CREATE POLICY risk_signals_owner ON public.relationship_risk_signals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Journey Milestones: Visible only to couple participants
CREATE POLICY milestones_policy ON public.journey_milestones
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.couple_spaces s
    WHERE s.id = couple_space_id AND (s.user_a = auth.uid() OR s.user_b = auth.uid())
  ));

-- Hundred Days Prompts:
CREATE POLICY hundred_days_policy ON public.hundred_days_prompts
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.couple_spaces s
    WHERE s.id = couple_space_id AND (s.user_a = auth.uid() OR s.user_b = auth.uid())
  ));

-- Annual Health Checks:
CREATE POLICY annual_health_policy ON public.annual_health_checks
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.couple_spaces s
    WHERE s.id = couple_space_id AND (s.user_a = auth.uid() OR s.user_b = auth.uid())
  ));
