-- ============================================
-- HARVARD POOPS - DATABASE SCHEMA
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Go to: Dashboard → SQL Editor → New query → Paste and Run

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (Extended User Info)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Required signup fields
  full_name TEXT NOT NULL,
  year TEXT NOT NULL CHECK (year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
  house TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,

  -- Referral code tracking
  referral_codes_generated INTEGER DEFAULT 0,
  referral_codes_remaining INTEGER DEFAULT 3,
  referred_by_code TEXT,

  -- Metadata
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN DEFAULT false
);

-- Index for fast email lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read their own profile, insert on signup
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- REFERRAL CODES TABLE
-- ============================================
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for fast lookups
CREATE INDEX idx_referral_code ON referral_codes(code);
CREATE INDEX idx_referral_creator ON referral_codes(created_by);

-- Enable Row Level Security
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can read codes (to validate), users can create codes
CREATE POLICY "Anyone can read referral codes"
  ON referral_codes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create referral codes"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "System can update codes when used"
  ON referral_codes FOR UPDATE
  USING (true);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  cover_image_url TEXT,

  -- Event Type & Status
  type TEXT CHECK (type IN ('party', 'contest', 'tailgate', 'mixer', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Features Enabled
  has_rsvp BOOLEAN DEFAULT false,
  has_voting BOOLEAN DEFAULT false,
  has_playlist BOOLEAN DEFAULT false,
  has_chat BOOLEAN DEFAULT false,
  has_qr_code BOOLEAN DEFAULT false,

  -- External Links
  playlist_url TEXT,

  -- Host Info
  host_id UUID REFERENCES auth.users(id) NOT NULL,
  host_name TEXT
);

-- Indexes for common queries
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_host ON events(host_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can view published events, only host can edit
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================
-- RSVPS TABLE
-- ============================================
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  additional_data JSONB,

  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_rsvps_event ON rsvps(event_id);
CREATE INDEX idx_rsvps_user ON rsvps(user_id);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view RSVPs"
  ON rsvps FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can RSVP"
  ON rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  option_label TEXT NOT NULL,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  UNIQUE(event_id, option_id, voter_id)
);

CREATE INDEX idx_votes_event ON votes(event_id);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

ALTER TABLE events ADD COLUMN voting_options JSONB DEFAULT '[]'::jsonb;
-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT false
);

CREATE INDEX idx_chat_event_time ON chat_messages(event_id, created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Initial Referral Codes
-- ============================================
-- Insert 10 master codes for initial signups
-- These codes are not tied to any user and can be used by the first wave of users
INSERT INTO referral_codes (code, created_by, is_used) VALUES
  ('HP-LAUNCH2025', NULL, false),
  ('HP-CRIMSON01', NULL, false),
  ('HP-HARVARD02', NULL, false),
  ('HP-POOPS03', NULL, false),
  ('HP-EVENTS04', NULL, false),
  ('HP-SOCIAL05', NULL, false),
  ('HP-CAMPUS06', NULL, false),
  ('HP-PARTY07', NULL, false),
  ('HP-SQUAD08', NULL, false),
  ('HP-VIBES09', NULL, false);

-- ============================================
-- SCHEMA COMPLETE ✅
-- ============================================
-- You should see "Success. No rows returned" message
-- Now you can close the SQL Editor and continue with the setup
