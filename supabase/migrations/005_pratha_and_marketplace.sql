-- MangalSutra 2.0: Pratha Spirituality & Marketplace Migration
-- Migration 005: Spiritual Paths, Temples, Poojas, Couple Wellbeing, Vendors, Items, and Sandbox Order Ledger

-- 1. Pratha Daily Sankalpa
CREATE TABLE IF NOT EXISTS public.daily_sankalpas (
  date DATE PRIMARY KEY,
  theme TEXT NOT NULL,
  sloka_or_affirmation TEXT NOT NULL,
  meaning TEXT NOT NULL,
  practice_prompt TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 10
);

-- 2. Sacred Temple Experiences
CREATE TABLE IF NOT EXISTS public.temple_experiences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  deity TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  spiritual_significance TEXT NOT NULL,
  marriage_significance TEXT NOT NULL,
  recommended_seva TEXT NOT NULL,
  dress_code TEXT NOT NULL,
  best_timings TEXT NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'advisory_only' CHECK (booking_status IN (
    'available_direct', 'advisory_only', 'seasonal'
  )),
  image_url TEXT NOT NULL
);

-- 3. Vedic & Auspicious Pooja Guides
CREATE TABLE IF NOT EXISTS public.pooja_guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'pre_wedding', 'wedding_sanskar', 'home_auspicious', 'annual_vratha'
  )),
  purpose TEXT NOT NULL,
  duration TEXT NOT NULL,
  recommended_tithi TEXT NOT NULL,
  samagri_list TEXT[] NOT NULL DEFAULT '{}',
  step_by_step_ritual TEXT[] NOT NULL DEFAULT '{}',
  spiritual_meaning TEXT NOT NULL
);

-- 4. 21-Day Couple Journey Tracker
CREATE TABLE IF NOT EXISTS public.couple_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_space_id UUID NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 21),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  completed_by_user_a BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by_user_b BOOLEAN NOT NULL DEFAULT FALSE,
  is_day_completed BOOLEAN GENERATED ALWAYS AS (completed_by_user_a AND completed_by_user_b) STORED,
  completed_at TIMESTAMPTZ,
  CONSTRAINT uq_couple_journey_day UNIQUE (couple_space_id, day_number)
);

-- 5. Auspicious Festivals Calendar
CREATE TABLE IF NOT EXISTS public.festival_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  tithi TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Major Festival', 'Couple Observance', 'Auspicious Muhurat Window'
  )),
  spiritual_significance TEXT NOT NULL,
  couple_recommendation TEXT NOT NULL
);

-- 6. Meditation & Mindful Breathing Sessions
CREATE TABLE IF NOT EXISTS public.meditation_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Couple Coherence', 'Wedding Calm' , 'Morning Vitality', 'Night Relaxation'
  )),
  duration_minutes INTEGER NOT NULL,
  guidance_text TEXT NOT NULL,
  audio_prompt_preview TEXT NOT NULL
);

-- 7. Marketplace Vendors Table
CREATE TABLE IF NOT EXISTS public.marketplace_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  verification_badge TEXT NOT NULL DEFAULT 'Vetted Ethical Partner',
  established_year INTEGER NOT NULL,
  description TEXT NOT NULL
);

-- 8. Marketplace Catalog Items
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'before_marriage', 'wedding_services', 'after_marriage_wellbeing', 'spiritual_puja'
  )),
  subcategory TEXT NOT NULL,
  price_inr NUMERIC(10,2) NOT NULL,
  original_price_inr NUMERIC(10,2),
  vendor_id TEXT NOT NULL REFERENCES public.marketplace_vendors(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_location TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  key_features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  delivery_estimate TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  ethical_tag TEXT
);

-- 9. Marketplace Orders (Truthful Sandbox & Provider Order Ledger)
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  subtotal_inr NUMERIC(10,2) NOT NULL,
  gst_inr NUMERIC(10,2) NOT NULL,
  shipping_inr NUMERIC(10,2) NOT NULL,
  total_inr NUMERIC(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'NetBanking', 'CreditCard', 'Sandbox_Simulated')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Sandbox_Verified', 'Payment_Failed', 'Merchant_Pending')),
  order_status TEXT NOT NULL DEFAULT 'Order_Placed' CHECK (order_status IN (
    'Order_Placed', 'Processing_With_Vendor', 'Dispatched', 'Delivered'
  )),
  is_simulated_notice TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Commercial Tier Plans & Entitlements
CREATE TABLE IF NOT EXISTS public.commercial_tiers (
  id TEXT PRIMARY KEY CHECK (id IN ('free', 'premium', 'verified', 'premium_verified', 'couple')),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  monthly_price_inr INTEGER NOT NULL,
  annual_price_inr INTEGER NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  entitlements JSONB NOT NULL,
  transparency_caveat TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON public.marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user ON public.marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_space ON public.couple_journey_progress(couple_space_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.daily_sankalpas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pooja_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_tiers ENABLE ROW LEVEL SECURITY;

-- Pratha Content: Publicly readable by all authenticated users
CREATE POLICY pratha_read_sankalpa ON public.daily_sankalpas FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY pratha_read_temples ON public.temple_experiences FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY pratha_read_poojas ON public.pooja_guides FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY pratha_read_festivals ON public.festival_events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY pratha_read_meditations ON public.meditation_sessions FOR SELECT TO authenticated USING (TRUE);

-- Couple Journey Progress: Accessible only to couple participants
CREATE POLICY couple_journey_policy ON public.couple_journey_progress
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.couple_spaces s
    WHERE s.id = couple_space_id AND (s.user_a = auth.uid() OR s.user_b = auth.uid())
  ));

-- Marketplace Catalog: Publicly readable
CREATE POLICY market_vendors_read ON public.marketplace_vendors FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY market_items_read ON public.marketplace_items FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY commercial_tiers_read ON public.commercial_tiers FOR SELECT TO authenticated USING (TRUE);

-- Orders: Owner only!
CREATE POLICY orders_owner_policy ON public.marketplace_orders
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
