-- ================================================================================
-- GARIN TORANI OR YEHUDA - Complete Database Setup
-- Version: 3.0 FINAL - Single File Setup
-- Date: March 4, 2026
-- ================================================================================
--
-- This file contains EVERYTHING you need:
-- - All base tables (posts, events, gallery, contacts, leads)
-- - Username authentication system (users_profiles)
-- - Complete calendar system (events_extended, parasha_readings, jewish_holidays)
-- - All RLS policies, triggers, and indexes
-- - Sample data (4 parasha, 5 events, 5 holidays)
--
-- SAFE TO RUN: Uses IF NOT EXISTS and checks before adding columns
-- ================================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================
-- BASE TABLES
-- ================================================================================

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  author TEXT DEFAULT 'Staff',
  image_url TEXT,
  tags TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (basic)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  time TIME,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  album TEXT,
  type TEXT CHECK (type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================================
-- USERS & AUTHENTICATION
-- ================================================================================

-- Users profiles
CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  created_by UUID REFERENCES auth.users(id),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add username if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_profiles' AND column_name='username') THEN
    ALTER TABLE users_profiles ADD COLUMN username TEXT;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_profiles_username_key ON users_profiles(username);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================================
-- CALENDAR SYSTEM - Extended Events
-- ================================================================================

-- Create base table
CREATE TABLE IF NOT EXISTS events_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  gregorian_date DATE NOT NULL,
  gregorian_time TIME,
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all calendar columns if they don't exist
DO $$ 
DECLARE
  col_name TEXT;
BEGIN
  -- Add columns one by one with checks
  FOR col_name IN 
    SELECT unnest(ARRAY[
      'end_date', 'end_time', 'hebrew_date', 'hebrew_month', 'hebrew_day', 'hebrew_year',
      'event_type', 'is_jewish_holiday', 'holiday_name', 'is_rosh_chodesh',
      'location', 'location_address', 'location_lat', 'location_lng', 'location_notes',
      'image_url', 'topic', 'organizer', 'contact_phone', 'contact_email',
      'max_participants', 'current_participants', 'is_recurring', 'recurrence_pattern',
      'recurrence_end_date', 'is_public'
    ])
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name=col_name) THEN
      CASE col_name
        WHEN 'end_date' THEN ALTER TABLE events_extended ADD COLUMN end_date DATE;
        WHEN 'end_time' THEN ALTER TABLE events_extended ADD COLUMN end_time TIME;
        WHEN 'hebrew_date' THEN ALTER TABLE events_extended ADD COLUMN hebrew_date TEXT;
        WHEN 'hebrew_month' THEN ALTER TABLE events_extended ADD COLUMN hebrew_month TEXT;
        WHEN 'hebrew_day' THEN ALTER TABLE events_extended ADD COLUMN hebrew_day INTEGER;
        WHEN 'hebrew_year' THEN ALTER TABLE events_extended ADD COLUMN hebrew_year INTEGER;
        WHEN 'event_type' THEN ALTER TABLE events_extended ADD COLUMN event_type TEXT;
        WHEN 'is_jewish_holiday' THEN ALTER TABLE events_extended ADD COLUMN is_jewish_holiday BOOLEAN DEFAULT FALSE;
        WHEN 'holiday_name' THEN ALTER TABLE events_extended ADD COLUMN holiday_name TEXT;
        WHEN 'is_rosh_chodesh' THEN ALTER TABLE events_extended ADD COLUMN is_rosh_chodesh BOOLEAN DEFAULT FALSE;
        WHEN 'location' THEN ALTER TABLE events_extended ADD COLUMN location TEXT;
        WHEN 'location_address' THEN ALTER TABLE events_extended ADD COLUMN location_address TEXT;
        WHEN 'location_lat' THEN ALTER TABLE events_extended ADD COLUMN location_lat DECIMAL(10, 8);
        WHEN 'location_lng' THEN ALTER TABLE events_extended ADD COLUMN location_lng DECIMAL(11, 8);
        WHEN 'location_notes' THEN ALTER TABLE events_extended ADD COLUMN location_notes TEXT;
        WHEN 'image_url' THEN ALTER TABLE events_extended ADD COLUMN image_url TEXT;
        WHEN 'topic' THEN ALTER TABLE events_extended ADD COLUMN topic TEXT;
        WHEN 'organizer' THEN ALTER TABLE events_extended ADD COLUMN organizer TEXT;
        WHEN 'contact_phone' THEN ALTER TABLE events_extended ADD COLUMN contact_phone TEXT;
        WHEN 'contact_email' THEN ALTER TABLE events_extended ADD COLUMN contact_email TEXT;
        WHEN 'max_participants' THEN ALTER TABLE events_extended ADD COLUMN max_participants INTEGER;
        WHEN 'current_participants' THEN ALTER TABLE events_extended ADD COLUMN current_participants INTEGER DEFAULT 0;
        WHEN 'is_recurring' THEN ALTER TABLE events_extended ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
        WHEN 'recurrence_pattern' THEN ALTER TABLE events_extended ADD COLUMN recurrence_pattern TEXT;
        WHEN 'recurrence_end_date' THEN ALTER TABLE events_extended ADD COLUMN recurrence_end_date DATE;
        WHEN 'is_public' THEN ALTER TABLE events_extended ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
      END CASE;
    END IF;
  END LOOP;
END $$;

-- ================================================================================
-- CALENDAR SYSTEM - Parasha Readings
-- ================================================================================

-- Create base table
CREATE TABLE IF NOT EXISTS parasha_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parasha_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  hebrew_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parasha_readings' AND column_name='candle_lighting') THEN
    ALTER TABLE parasha_readings ADD COLUMN candle_lighting TIME;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parasha_readings' AND column_name='havdala') THEN
    ALTER TABLE parasha_readings ADD COLUMN havdala TIME;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parasha_readings' AND column_name='torah_portion') THEN
    ALTER TABLE parasha_readings ADD COLUMN torah_portion TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parasha_readings' AND column_name='haftarah') THEN
    ALTER TABLE parasha_readings ADD COLUMN haftarah TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parasha_readings' AND column_name='year') THEN
    ALTER TABLE parasha_readings ADD COLUMN year INTEGER;
  END IF;
END $$;

-- Add unique constraint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'parasha_readings_gregorian_date_unique') THEN
    ALTER TABLE parasha_readings ADD CONSTRAINT parasha_readings_gregorian_date_unique UNIQUE (gregorian_date);
    RAISE NOTICE 'Added UNIQUE constraint on gregorian_date';
  ELSE
    RAISE NOTICE 'UNIQUE constraint already exists';
  END IF;
END $$;

-- Update year from date
UPDATE parasha_readings SET year = EXTRACT(YEAR FROM gregorian_date) WHERE year IS NULL;

-- Wait for constraint to be applied
SELECT pg_sleep(0.1);

-- Verify constraint exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'parasha_readings_gregorian_date_unique') THEN
    RAISE EXCEPTION 'Failed to add UNIQUE constraint - stopping here';
  END IF;
END $$;

-- ================================================================================
-- CALENDAR SYSTEM - Jewish Holidays
-- ================================================================================

CREATE TABLE IF NOT EXISTS jewish_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holiday_name TEXT NOT NULL,
  holiday_name_english TEXT,
  hebrew_date TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  year INTEGER NOT NULL,
  is_major BOOLEAN DEFAULT FALSE,
  is_fast_day BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('biblical', 'rabbinic', 'modern', 'minor')),
  description TEXT,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(holiday_name, gregorian_date, year)
);

-- ================================================================================
-- CALENDAR SYSTEM - Zmanim Cache
-- ================================================================================

CREATE TABLE IF NOT EXISTS zmanim_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  location TEXT NOT NULL DEFAULT 'Or Yehuda',
  latitude DECIMAL(10, 8) DEFAULT 32.0297,
  longitude DECIMAL(11, 8) DEFAULT 34.8585,
  alot_hashachar TIME,
  misheyakir TIME,
  sunrise TIME,
  sof_zman_shma_mga TIME,
  sof_zman_shma_gra TIME,
  sof_zman_tfila TIME,
  chatzot TIME,
  mincha_gedola TIME,
  mincha_ketana TIME,
  plag_hamincha TIME,
  sunset TIME,
  tzait_hakochavim TIME,
  candle_lighting TIME,
  havdala TIME,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, location)
);

-- ================================================================================
-- INDEXES
-- ================================================================================

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_gallery_album ON gallery(album);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(type);
CREATE INDEX IF NOT EXISTS idx_users_profiles_username ON users_profiles(username);
CREATE INDEX IF NOT EXISTS idx_users_profiles_role ON users_profiles(role);
CREATE INDEX IF NOT EXISTS idx_users_profiles_is_active ON users_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_events_extended_gregorian_date ON events_extended(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_events_extended_event_type ON events_extended(event_type);
CREATE INDEX IF NOT EXISTS idx_events_extended_is_published ON events_extended(is_published);
CREATE INDEX IF NOT EXISTS idx_parasha_readings_date ON parasha_readings(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_date ON jewish_holidays(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_zmanim_cache_date ON zmanim_cache(date);

-- ================================================================================
-- TRIGGERS
-- ================================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_extended_updated_at ON events_extended;
CREATE TRIGGER update_events_extended_updated_at BEFORE UPDATE ON events_extended FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================================
-- RLS POLICIES - Users
-- ================================================================================

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can create users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update all users" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own info" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can delete users" ON users_profiles;

CREATE POLICY "Users can view own profile" ON users_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON users_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can create users" ON users_profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update all users" ON users_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own info" ON users_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Only admins can delete users" ON users_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Role change prevention
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role THEN
    IF NOT EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin') THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON users_profiles;
CREATE TRIGGER prevent_role_change_trigger BEFORE UPDATE ON users_profiles FOR EACH ROW EXECUTE FUNCTION prevent_role_change();

-- ================================================================================
-- RLS POLICIES - Events
-- ================================================================================

ALTER TABLE events_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view published events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can view all events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can create events" ON events_extended;
DROP POLICY IF EXISTS "Creator or admin can update events" ON events_extended;
DROP POLICY IF EXISTS "Only admins can delete events" ON events_extended;

CREATE POLICY "Everyone can view published events" ON events_extended FOR SELECT USING (is_published = true);
CREATE POLICY "Auth users can view all events" ON events_extended FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can create events" ON events_extended FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creator or admin can update events" ON events_extended FOR UPDATE USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete events" ON events_extended FOR DELETE USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ================================================================================
-- SAMPLE DATA
-- ================================================================================

-- Parasha readings
INSERT INTO parasha_readings (parasha_name, gregorian_date, hebrew_date, year, candle_lighting, havdala, torah_portion, haftarah)
VALUES 
  ('תצוה', '2026-03-07', 'כד אדר תשפו', 2026, '17:26:00', '18:33:00', 'שמות כז-ל', 'יחזקאל מג:י-כז'),
  ('כי תשא', '2026-03-14', 'א ניסן תשפו', 2026, '17:34:00', '18:41:00', 'שמות ל-לד', 'מלכים א יח:א-לט'),
  ('ויקהל-פקודי', '2026-03-21', 'ח ניסן תשפו', 2026, '17:41:00', '18:48:00', 'שמות לה-מ', 'מלכים א ז:מ-נ'),
  ('ויקרא', '2026-03-28', 'טו ניסן תשפו', 2026, '17:48:00', '18:55:00', 'ויקרא א-ה', 'ישעיהו מג:כא-מד:כג')
ON CONFLICT (gregorian_date) DO UPDATE SET parasha_name=EXCLUDED.parasha_name, hebrew_date=EXCLUDED.hebrew_date, year=EXCLUDED.year, candle_lighting=EXCLUDED.candle_lighting, havdala=EXCLUDED.havdala, torah_portion=EXCLUDED.torah_portion, haftarah=EXCLUDED.haftarah;

-- Events
INSERT INTO events_extended (title, description, gregorian_date, gregorian_time, hebrew_date, event_type, location, location_address, topic, organizer, contact_phone, is_published)
VALUES
  ('ערב פורים - מגילת אסתר', 'קריאת מגילת אסתר בליווי הסבר ופעילויות לילדים. נא להגיע במסכות!', '2026-03-23', '19:30:00', 'יג אדר תשפו', 'holiday', 'בית הכנסת הגדול', 'רח הרב קוק 15, אור יהודה', 'מגילת אסתר', 'רבי כהן', '03-612-4477', true),
  ('סדנת אפייה לפסח', 'סדנת אפייה למצות ומאפים לפסח. מתאים לכל המשפחה!', '2026-03-25', '16:00:00', 'טו אדר תשפו', 'lesson', 'מטבח הגרעין', 'רח ירושלים 8, אור יהודה', 'הכנות לפסח', 'שרה לוי', '052-1234567', true),
  ('מסיבת פורים לילדים', 'מסיבת פורים עם הפעלות, משחקים, פעילויות יצירה ומשלוח מנות!', '2026-03-24', '10:00:00', 'יד אדר תשפו', 'garin', 'מרכז הקהילה', 'רח הרצל 25, אור יהודה', 'פורים', 'דוד כהן', '03-555-1234', true),
  ('שיעור הכנה לפסח', 'שיעור מקיף על הלכות פסח, הכשרת המטבח וחודש ניסן', '2026-03-30', '20:00:00', 'יז ניסן תשפו', 'lesson', 'בית המדרש', 'רח בן גוריון 12, אור יהודה', 'הלכות פסח', 'הרב אברהם', '054-9876543', true),
  ('טיול בית הבד העתיק', 'טיול משפחתי לבית הבד העתיק בתל קציר. נא להביא כובע ומים!', '2026-04-02', '09:00:00', 'יט ניסן תשפו', 'garin', 'תל קציר', 'תל קציר, עמק בית שאן', 'טיול חול המועד', 'משה דוד', '050-1112233', true)
ON CONFLICT DO NOTHING;

-- Holidays
INSERT INTO jewish_holidays (holiday_name, holiday_name_english, hebrew_date, gregorian_date, year, is_major, category, description)
VALUES
  ('פורים', 'Purim', 'יד אדר תשפו', '2026-03-24', 2026, true, 'rabbinic', 'חג הפורים - קריאת המגילה, משלוח מנות ומתנות לאביונים'),
  ('פסח', 'Pesach', 'טו ניסן תשפו', '2026-04-04', 2026, true, 'biblical', 'חג הפסח - זכר ליציאת מצרים'),
  ('יום העצמאות', 'Independence Day', 'ה אייר תשפו', '2026-04-23', 2026, true, 'modern', 'יום העצמאות למדינת ישראל'),
  ('לג בעומר', 'Lag BaOmer', 'יח אייר תשפו', '2026-05-06', 2026, false, 'minor', 'לג בעומר - הילולת רבי שמעון בר יוחאי'),
  ('שבועות', 'Shavuot', 'ו סיוון תשפו', '2026-05-23', 2026, true, 'biblical', 'חג השבועות - מתן תורה')
ON CONFLICT (holiday_name, gregorian_date, year) DO UPDATE SET holiday_name_english=EXCLUDED.holiday_name_english, hebrew_date=EXCLUDED.hebrew_date, is_major=EXCLUDED.is_major, category=EXCLUDED.category, description=EXCLUDED.description;

-- ================================================================================
-- SUCCESS MESSAGE
-- ================================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '  DATABASE SETUP COMPLETE!';
  RAISE NOTICE '================================================================';
  RAISE NOTICE 'Tables: posts, events, gallery, contacts, leads, users_profiles, events_extended, parasha_readings, jewish_holidays, zmanim_cache';
  RAISE NOTICE 'Sample data: 4 parasha, 5 events, 5 holidays';
  RAISE NOTICE 'Next: Create admin user in Supabase Auth, then add to users_profiles';
  RAISE NOTICE '================================================================';
END $$;
