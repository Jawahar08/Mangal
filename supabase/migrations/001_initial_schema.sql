-- MangalSutra 2.0: Core Foundation & Schema Migration
-- Migration 001: Accounts, Profiles, Privacy, Connections, Conversations, Messages, and Discovery

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types for strict data validation
DO $$ BEGIN
  CREATE TYPE user_intent AS ENUM ('marriage', 'remarriage', 'dating_leading_to_marriage', 'life_partner', 'parent_guardian');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_gender AS ENUM ('female', 'male', 'non_binary', 'prefer_not_to_say');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE marital_status_type AS ENUM ('never_married', 'divorced', 'widowed', 'separated', 'annulled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Public Matchmaking Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  gender user_gender NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  date_of_birth DATE NOT NULL,
  intent user_intent NOT NULL DEFAULT 'marriage',
  marital_status marital_status_type NOT NULL DEFAULT 'never_married',
  religion TEXT NOT NULL DEFAULT 'Hindu',
  community TEXT DEFAULT '',
  mother_tongue TEXT NOT NULL DEFAULT 'Hindi',
  hometown TEXT DEFAULT '',
  current_city TEXT NOT NULL DEFAULT '',
  current_country TEXT NOT NULL DEFAULT 'India',
  height TEXT DEFAULT '5'' 5"',
  bio TEXT DEFAULT '',
  
  -- Education & Career
  education TEXT NOT NULL DEFAULT 'Graduate',
  education_field TEXT DEFAULT '',
  profession TEXT NOT NULL DEFAULT '',
  company_or_industry TEXT DEFAULT '',
  income_bracket TEXT DEFAULT '',
  income_private BOOLEAN NOT NULL DEFAULT FALSE,

  -- Lifestyle
  diet TEXT NOT NULL DEFAULT 'Vegetarian',
  drinking TEXT NOT NULL DEFAULT 'Never',
  smoking TEXT NOT NULL DEFAULT 'Never',
  fitness TEXT DEFAULT 'Yoga & Walking',
  interests TEXT[] NOT NULL DEFAULT '{}',

  -- Family
  family_type TEXT NOT NULL DEFAULT 'Nuclear',
  family_values TEXT NOT NULL DEFAULT 'Moderate',
  father_occupation TEXT DEFAULT '',
  mother_occupation TEXT DEFAULT '',
  siblings TEXT DEFAULT '',

  -- Second Chapter brief summary (if applicable)
  children_count INTEGER DEFAULT 0,
  custody_status TEXT DEFAULT '',
  second_chapter_learnings TEXT DEFAULT '',

  -- Photos & Privacy
  photo_url TEXT NOT NULL DEFAULT '',
  additional_photos TEXT[] NOT NULL DEFAULT '{}',
  photos_blurred BOOLEAN NOT NULL DEFAULT FALSE,

  -- Structured Layers
  astrology JSONB NOT NULL DEFAULT '{}'::jsonb,
  expectations JSONB NOT NULL DEFAULT '{}'::jsonb,
  trust_profile JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- System & Moderation
  trust_score_level TEXT NOT NULL DEFAULT 'Basic',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Strictly Confidential Private Profiles Table
-- Holds sensitive raw data, national ID hashes, raw biodata, and guardian details
CREATE TABLE IF NOT EXISTS public.private_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone_number TEXT,
  email TEXT,
  raw_biodata_text TEXT,
  extracted_draft JSONB DEFAULT '{}'::jsonb,
  gov_id_hash TEXT,
  is_guardian_managed BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_name TEXT,
  guardian_relation TEXT,
  subject_consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Partner Preferences Table
CREATE TABLE IF NOT EXISTS public.preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_age_min INTEGER NOT NULL DEFAULT 21,
  partner_age_max INTEGER NOT NULL DEFAULT 35,
  partner_height_min TEXT DEFAULT '5'' 0"',
  partner_education TEXT[] DEFAULT '{}',
  partner_profession TEXT[] DEFAULT '{}',
  partner_location TEXT[] DEFAULT '{}',
  dietary_preference TEXT DEFAULT 'open',
  marital_status_accepted marital_status_type[] DEFAULT '{never_married}',
  family_values TEXT DEFAULT 'Moderate',
  children_expectations TEXT DEFAULT 'wants_children',
  financial_philosophy TEXT DEFAULT 'shared_planning',
  relocation_openness TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Connection Requests & Mutual Matches
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_connection_pair UNIQUE (from_user_id, to_user_id),
  CONSTRAINT chk_no_self_connection CHECK (from_user_id <> to_user_id)
);

-- 5. Photo Access Permission Requests
CREATE TABLE IF NOT EXISTS public.photo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_photo_request UNIQUE (requester_id, target_user_id)
);

-- 6. Authorized Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_two UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_conversation_participants UNIQUE (participant_one, participant_two),
  CONSTRAINT chk_diff_participants CHECK (participant_one <> participant_two)
);

-- 7. Secure Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_prompt_starter BOOLEAN NOT NULL DEFAULT FALSE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Safety, Blocking, and Abuse Reporting
CREATE TABLE IF NOT EXISTS public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('block', 'report')),
  reason TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Saved / Bookmarked Profiles
CREATE TABLE IF NOT EXISTS public.saved_profiles (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  saved_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, saved_profile_id),
  CONSTRAINT chk_no_self_save CHECK (user_id <> saved_profile_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_gender_age ON public.profiles(gender, age);
CREATE INDEX IF NOT EXISTS idx_profiles_religion ON public.profiles(religion);
CREATE INDEX IF NOT EXISTS idx_profiles_intent ON public.profiles(intent);
CREATE INDEX IF NOT EXISTS idx_connections_users ON public.connections(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_safety_reports_reporter ON public.safety_reports(reporter_id);

-- Function: get_discovery_candidates()
-- Server-side discovery matching function with safety block filtering, gender inversion, and pagination
CREATE OR REPLACE FUNCTION public.get_discovery_candidates(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_gender user_gender;
  v_user_intent user_intent;
BEGIN
  -- Retrieve caller's gender and intent
  SELECT gender, intent INTO v_user_gender, v_user_intent FROM public.profiles WHERE id = p_user_id;

  RETURN QUERY
  SELECT p.*
  FROM public.profiles p
  WHERE p.id <> p_user_id
    AND p.is_active = TRUE
    AND p.is_blocked = FALSE
    -- Respect opposite gender preference for heterosexual matching defaults
    AND (
      (v_user_gender = 'male' AND p.gender = 'female') OR
      (v_user_gender = 'female' AND p.gender = 'male') OR
      (v_user_gender IN ('non_binary', 'prefer_not_to_say'))
    )
    -- Exclude blocked relationships in either direction
    AND NOT EXISTS (
      SELECT 1 FROM public.safety_reports r
      WHERE (r.reporter_id = p_user_id AND r.reported_id = p.id AND r.action_type = 'block')
         OR (r.reporter_id = p.id AND r.reported_id = p_user_id AND r.action_type = 'block')
    )
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated users can read active non-blocked profiles; owner can update
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT TO authenticated
  USING (is_active = TRUE);

CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Private Profiles: ONLY the owner can ever select or update!
CREATE POLICY private_profiles_owner_policy ON public.private_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id);

-- Preferences: Only owner can read/write
CREATE POLICY preferences_owner_policy ON public.preferences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Connections: Participants can view and manage their requests
CREATE POLICY connections_select_policy ON public.connections
  FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY connections_insert_policy ON public.connections
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY connections_update_policy ON public.connections
  FOR UPDATE TO authenticated
  USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

-- Conversations & Messages: Strictly restricted to conversation participants
CREATE POLICY conversations_policy ON public.conversations
  FOR ALL TO authenticated
  USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY messages_select_policy ON public.messages
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY messages_insert_policy ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Saved Profiles: Owner only
CREATE POLICY saved_profiles_policy ON public.saved_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
