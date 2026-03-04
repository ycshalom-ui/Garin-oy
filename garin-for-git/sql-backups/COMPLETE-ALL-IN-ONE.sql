-- ================================================================================
-- GARIN TORANI OR YEHUDA - COMPLETE DATABASE SCHEMA
-- Version: 2.7.1 FINAL - All-In-One (Fixed)
-- Date: March 3, 2026
-- ================================================================================
--
-- This single file contains EVERYTHING:
-- ✅ All existing tables
-- ✅ Username-based authentication (with email fallback)
-- ✅ Admin-only user creation
-- ✅ Future phases (2-5) ready
-- ✅ Complete indexes and policies
-- ✅ FIXED: Adds username column if doesn't exist
--
-- Safe to run multiple times!
-- ================================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================
-- PART 1: EXISTING TABLES - CREATE OR ALTER
-- ================================================================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='excerpt') THEN
    ALTER TABLE posts ADD COLUMN excerpt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='category') THEN
    ALTER TABLE posts ADD COLUMN category TEXT CHECK (category IN ('עדכונים', 'פרשת השבוע'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='author') THEN
    ALTER TABLE posts ADD COLUMN author TEXT DEFAULT 'צוות הגרעין';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='image_url') THEN
    ALTER TABLE posts ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='tags') THEN
    ALTER TABLE posts ADD COLUMN tags TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='updated_at') THEN
    ALTER TABLE posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='published') THEN
    ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='description') THEN
    ALTER TABLE events ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='time') THEN
    ALTER TABLE events ADD COLUMN time TIME;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='location') THEN
    ALTER TABLE events ADD COLUMN location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='updated_at') THEN
    ALTER TABLE events ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='album') THEN
    ALTER TABLE gallery ADD COLUMN album TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='type') THEN
    ALTER TABLE gallery ADD COLUMN type TEXT CHECK (type IN ('image', 'video'));
  END IF;
END $$;

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='phone') THEN
    ALTER TABLE contacts ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='subject') THEN
    ALTER TABLE contacts ADD COLUMN subject TEXT;
  END IF;
END $$;

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='message') THEN
    ALTER TABLE leads ADD COLUMN message TEXT;
  END IF;
END $$;

-- ================================================================================
-- PART 2: USERNAME-BASED AUTHENTICATION (ACTIVE)
-- ================================================================================

-- User profiles with USERNAME (and email for compatibility)
CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  phone TEXT,
  notes TEXT
);

-- Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_profiles' AND column_name='username') THEN
    ALTER TABLE users_profiles ADD COLUMN username TEXT;
    RAISE NOTICE '✅ Added username column to users_profiles';
  ELSE
    RAISE NOTICE '✅ Username column already exists in users_profiles';
  END IF;
END $$;

-- Create unique index on username
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
-- ROW LEVEL SECURITY - ADMIN ONLY USER CREATION
-- ================================================================================

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Admins can create any user" ON users_profiles;
DROP POLICY IF EXISTS "Managers can create users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update roles" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update all users" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own basic info" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can delete users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can create users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update users" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own info" ON users_profiles;

-- Create new policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users_profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON users_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ONLY ADMINS CAN CREATE USERS - NO PUBLIC SIGNUP
CREATE POLICY "Only admins can create users"
  ON users_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update other users
CREATE POLICY "Only admins can update all users"
  ON users_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own basic info
CREATE POLICY "Users can update own info"
  ON users_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Only admins can delete users
CREATE POLICY "Only admins can delete users"
  ON users_profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================================================
-- TRIGGER TO PREVENT ROLE CHANGES BY NON-ADMINS
-- ================================================================================

DROP FUNCTION IF EXISTS prevent_role_change() CASCADE;
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON users_profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON users_profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- ================================================================================
-- PART 3: FUTURE PHASES - MEDIA STORAGE
-- ================================================================================

CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alt_text TEXT,
  caption TEXT,
  is_public BOOLEAN DEFAULT TRUE
);

-- ================================================================================
-- PART 4: FUTURE PHASES - ADVANCED EVENTS CALENDAR
-- ================================================================================

CREATE TABLE IF NOT EXISTS events_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  gregorian_date DATE NOT NULL,
  gregorian_time TIME,
  hebrew_date TEXT,
  hebrew_month TEXT,
  hebrew_day INTEGER,
  hebrew_year INTEGER,
  event_type TEXT CHECK (event_type IN ('garin', 'holiday', 'birthday', 'lesson', 'other')),
  is_jewish_holiday BOOLEAN DEFAULT FALSE,
  holiday_name TEXT,
  is_rosh_chodesh BOOLEAN DEFAULT FALSE,
  location TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  recurrence_end_date DATE,
  ical_uid TEXT UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS birthdays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  hebrew_date TEXT,
  hebrew_day INTEGER,
  hebrew_month TEXT,
  birth_year INTEGER,
  notes TEXT,
  is_hebrew_calendar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parasha_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parasha_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  hebrew_date TEXT NOT NULL,
  aliyot JSONB,
  haftarah TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================================
-- PART 5: FUTURE PHASES - JEWISH TIMES (ZMANIM)
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
  tzait_72 TIME,
  candle_lighting TIME,
  havdala TIME,
  molad_day TEXT,
  molad_time TIME,
  molad_chalakim INTEGER,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'hebcal',
  UNIQUE(date, location)
);

CREATE TABLE IF NOT EXISTS rosh_chodesh (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hebrew_month TEXT NOT NULL,
  hebrew_year INTEGER NOT NULL,
  gregorian_date_1 DATE NOT NULL,
  gregorian_date_2 DATE,
  is_two_days BOOLEAN DEFAULT FALSE,
  molad_day TEXT,
  molad_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jewish_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holiday_name TEXT NOT NULL,
  holiday_name_english TEXT,
  hebrew_date TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  year INTEGER NOT NULL,
  is_major BOOLEAN DEFAULT FALSE,
  is_fast_day BOOLEAN DEFAULT FALSE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================================

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_extended_gregorian_date ON events_extended(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_events_extended_event_type ON events_extended(event_type);
CREATE INDEX IF NOT EXISTS idx_events_extended_is_published ON events_extended(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_album ON gallery(album);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(type);
CREATE INDEX IF NOT EXISTS idx_users_profiles_username ON users_profiles(username);
CREATE INDEX IF NOT EXISTS idx_users_profiles_role ON users_profiles(role);
CREATE INDEX IF NOT EXISTS idx_users_profiles_is_active ON users_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_zmanim_cache_date ON zmanim_cache(date);
CREATE INDEX IF NOT EXISTS idx_zmanim_cache_location ON zmanim_cache(location);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_date ON jewish_holidays(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_year ON jewish_holidays(year);

-- ================================================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_extended_updated_at ON events_extended;
CREATE TRIGGER update_events_extended_updated_at
  BEFORE UPDATE ON events_extended
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP FUNCTION IF EXISTS log_user_activity() CASCADE;
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_activity_log (user_id, action, resource_type, resource_id)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- SAMPLE DATA
-- ================================================================================

INSERT INTO zmanim_cache (
  date, location, latitude, longitude,
  alot_hashachar, sunrise, sof_zman_shma_mga, sof_zman_shma_gra,
  sof_zman_tfila, chatzot, mincha_gedola, mincha_ketana,
  plag_hamincha, sunset, tzait_hakochavim,
  candle_lighting, havdala
) VALUES (
  '2026-03-03', 'Or Yehuda', 32.0297, 34.8585,
  '05:23:00', '06:17:00', '08:44:00', '09:20:00',
  '10:16:00', '12:33:00', '13:04:00', '15:47:00',
  '16:56:00', '18:33:00', '19:10:00',
  '18:15:00', '19:16:00'
) ON CONFLICT (date, location) DO NOTHING;

-- ================================================================================
-- ADMIN USER CREATION INSTRUCTIONS
-- ================================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '  DATABASE MIGRATION COMPLETED SUCCESSFULLY! ✅';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Version: 2.7.1 FINAL - Username Authentication (Fixed)';
  RAISE NOTICE 'Date: March 3, 2026';
  RAISE NOTICE '';
  RAISE NOTICE '────────────────────────────────────────────────────────────';
  RAISE NOTICE '  NEXT STEP: Create Admin User';
  RAISE NOTICE '────────────────────────────────────────────────────────────';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to: Supabase Dashboard → Authentication → Users';
  RAISE NOTICE '   Click: Add user → Create new user';
  RAISE NOTICE '';
  RAISE NOTICE '2. Enter credentials:';
  RAISE NOTICE '   Email: admin@garinoy.local';
  RAISE NOTICE '   Password: G@ar!nOr!q@w#E';
  RAISE NOTICE '   ☑️ Auto Confirm User (IMPORTANT!)';
  RAISE NOTICE '';
  RAISE NOTICE '3. Copy the User UUID';
  RAISE NOTICE '';
  RAISE NOTICE '4. Run this SQL (replace UUID):';
  RAISE NOTICE '';
  RAISE NOTICE '   INSERT INTO users_profiles (id, username, email, full_name, role)';
  RAISE NOTICE '   VALUES (';
  RAISE NOTICE '     ''YOUR-USER-UUID-HERE'',';
  RAISE NOTICE '     ''admin'',';
  RAISE NOTICE '     ''admin@garinoy.local'',';
  RAISE NOTICE '     ''Administrator'',';
  RAISE NOTICE '     ''admin''';
  RAISE NOTICE '   );';
  RAISE NOTICE '';
  RAISE NOTICE '────────────────────────────────────────────────────────────';
  RAISE NOTICE '  Login Credentials:';
  RAISE NOTICE '────────────────────────────────────────────────────────────';
  RAISE NOTICE '';
  RAISE NOTICE '   Website: your-site.com/admin';
  RAISE NOTICE '   Username: admin';
  RAISE NOTICE '   Password: G@ar!nOr!q@w#E';
  RAISE NOTICE '';
  RAISE NOTICE '   ⚠️  IMPORTANT: Change password after first login!';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '  Features:';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '  ✅ Username-based authentication';
  RAISE NOTICE '  ✅ Email column kept for compatibility';
  RAISE NOTICE '  ✅ Username column added automatically if missing';
  RAISE NOTICE '  ✅ Only admin can create users (no public signup)';
  RAISE NOTICE '  ✅ Secure RLS policies';
  RAISE NOTICE '  ✅ All tables ready';
  RAISE NOTICE '  ✅ Future phases ready (media, events, zmanim)';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ================================================================================
-- END OF SCHEMA
-- ================================================================================
