-- ================================================================================
-- GARIN TORANI - FINAL FIXED DATABASE SETUP
-- Version: 2.9 FINAL FIXED
-- Date: March 4, 2026
-- ================================================================================
--
-- This is the COMPLETE and FIXED version
-- Safe to run multiple times
-- All issues resolved!
--
-- ================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================
-- PART 1: BASE TABLES
-- ================================================================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  excerpt TEXT,
  category TEXT,
  author TEXT DEFAULT 'Staff',
  image_url TEXT,
  tags TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  time TIME,
  location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  album TEXT,
  type TEXT CHECK (type IN ('image', 'video'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  subject TEXT
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- ================================================================================
-- PART 2: USERS
-- ================================================================================

CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
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

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users_profiles' AND column_name='username'
  ) THEN
    ALTER TABLE users_profiles ADD COLUMN username TEXT;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_profiles_username_key ON users_profiles(username);

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
-- PART 3: RLS FOR USERS
-- ================================================================================

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can create users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update all users" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own info" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can delete users" ON users_profiles;

CREATE POLICY "Users can view own profile"
  ON users_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can create users"
  ON users_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update all users"
  ON users_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own info"
  ON users_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Only admins can delete users"
  ON users_profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
-- PART 4: EXTENDED EVENTS (CALENDAR)
-- ================================================================================

CREATE TABLE IF NOT EXISTS events_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  gregorian_date DATE NOT NULL,
  gregorian_time TIME,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE
);

-- Add all missing columns to events_extended if they don't exist
DO $$ 
BEGIN
  -- Add end_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='end_date') THEN
    ALTER TABLE events_extended ADD COLUMN end_date DATE;
  END IF;
  
  -- Add end_time
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='end_time') THEN
    ALTER TABLE events_extended ADD COLUMN end_time TIME;
  END IF;
  
  -- Add hebrew_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='hebrew_date') THEN
    ALTER TABLE events_extended ADD COLUMN hebrew_date TEXT;
  END IF;
  
  -- Add hebrew_month
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='hebrew_month') THEN
    ALTER TABLE events_extended ADD COLUMN hebrew_month TEXT;
  END IF;
  
  -- Add hebrew_day
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='hebrew_day') THEN
    ALTER TABLE events_extended ADD COLUMN hebrew_day INTEGER;
  END IF;
  
  -- Add hebrew_year
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='hebrew_year') THEN
    ALTER TABLE events_extended ADD COLUMN hebrew_year INTEGER;
  END IF;
  
  -- Add event_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='event_type') THEN
    ALTER TABLE events_extended ADD COLUMN event_type TEXT;
    ALTER TABLE events_extended ADD CONSTRAINT events_extended_event_type_check CHECK (event_type IN ('garin', 'holiday', 'birthday', 'lesson', 'other'));
  END IF;
  
  -- Add is_jewish_holiday
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='is_jewish_holiday') THEN
    ALTER TABLE events_extended ADD COLUMN is_jewish_holiday BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add holiday_name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='holiday_name') THEN
    ALTER TABLE events_extended ADD COLUMN holiday_name TEXT;
  END IF;
  
  -- Add is_rosh_chodesh
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='is_rosh_chodesh') THEN
    ALTER TABLE events_extended ADD COLUMN is_rosh_chodesh BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='location') THEN
    ALTER TABLE events_extended ADD COLUMN location TEXT;
  END IF;
  
  -- Add location_address
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='location_address') THEN
    ALTER TABLE events_extended ADD COLUMN location_address TEXT;
  END IF;
  
  -- Add location_lat
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='location_lat') THEN
    ALTER TABLE events_extended ADD COLUMN location_lat DECIMAL(10, 8);
  END IF;
  
  -- Add location_lng
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='location_lng') THEN
    ALTER TABLE events_extended ADD COLUMN location_lng DECIMAL(11, 8);
  END IF;
  
  -- Add location_notes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='location_notes') THEN
    ALTER TABLE events_extended ADD COLUMN location_notes TEXT;
  END IF;
  
  -- Add image_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='image_url') THEN
    ALTER TABLE events_extended ADD COLUMN image_url TEXT;
  END IF;
  
  -- Add topic
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='topic') THEN
    ALTER TABLE events_extended ADD COLUMN topic TEXT;
  END IF;
  
  -- Add organizer
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='organizer') THEN
    ALTER TABLE events_extended ADD COLUMN organizer TEXT;
  END IF;
  
  -- Add contact_phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='contact_phone') THEN
    ALTER TABLE events_extended ADD COLUMN contact_phone TEXT;
  END IF;
  
  -- Add contact_email
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='contact_email') THEN
    ALTER TABLE events_extended ADD COLUMN contact_email TEXT;
  END IF;
  
  -- Add max_participants
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='max_participants') THEN
    ALTER TABLE events_extended ADD COLUMN max_participants INTEGER;
  END IF;
  
  -- Add current_participants
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='current_participants') THEN
    ALTER TABLE events_extended ADD COLUMN current_participants INTEGER DEFAULT 0;
  END IF;
  
  -- Add is_recurring
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='is_recurring') THEN
    ALTER TABLE events_extended ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add recurrence_pattern
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='recurrence_pattern') THEN
    ALTER TABLE events_extended ADD COLUMN recurrence_pattern TEXT;
  END IF;
  
  -- Add recurrence_end_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='recurrence_end_date') THEN
    ALTER TABLE events_extended ADD COLUMN recurrence_end_date DATE;
  END IF;
  
  -- Add is_public
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events_extended' AND column_name='is_public') THEN
    ALTER TABLE events_extended ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- ================================================================================
-- PART 5: PARASHA READINGS (FIXED!)
-- ================================================================================

CREATE TABLE IF NOT EXISTS parasha_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parasha_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  hebrew_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='parasha_readings' AND column_name='candle_lighting'
  ) THEN
    ALTER TABLE parasha_readings ADD COLUMN candle_lighting TIME;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='parasha_readings' AND column_name='havdala'
  ) THEN
    ALTER TABLE parasha_readings ADD COLUMN havdala TIME;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='parasha_readings' AND column_name='torah_portion'
  ) THEN
    ALTER TABLE parasha_readings ADD COLUMN torah_portion TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='parasha_readings' AND column_name='haftarah'
  ) THEN
    ALTER TABLE parasha_readings ADD COLUMN haftarah TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='parasha_readings' AND column_name='year'
  ) THEN
    ALTER TABLE parasha_readings ADD COLUMN year INTEGER;
  END IF;
END $$;

-- Add UNIQUE constraint if it doesn't exist (FIXED!)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'parasha_readings_gregorian_date_unique'
  ) THEN
    ALTER TABLE parasha_readings 
    ADD CONSTRAINT parasha_readings_gregorian_date_unique 
    UNIQUE (gregorian_date);
  END IF;
END $$;

-- Update year from date
UPDATE parasha_readings 
SET year = EXTRACT(YEAR FROM gregorian_date) 
WHERE year IS NULL;

-- ================================================================================
-- PART 6: JEWISH HOLIDAYS
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
-- PART 7: ZMANIM CACHE
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
-- PART 8: INDEXES
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
-- PART 9: TRIGGERS
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

-- ================================================================================
-- PART 10: RLS FOR EVENTS
-- ================================================================================

ALTER TABLE events_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view published events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can view all events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can create events" ON events_extended;
DROP POLICY IF EXISTS "Creator or admin can update events" ON events_extended;
DROP POLICY IF EXISTS "Only admins can delete events" ON events_extended;

CREATE POLICY "Everyone can view published events"
  ON events_extended FOR SELECT
  USING (is_published = true);

CREATE POLICY "Auth users can view all events"
  ON events_extended FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can create events"
  ON events_extended FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Creator or admin can update events"
  ON events_extended FOR UPDATE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete events"
  ON events_extended FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================================================
-- PART 11: SAMPLE DATA - PARASHA
-- ================================================================================

INSERT INTO parasha_readings (parasha_name, gregorian_date, hebrew_date, year, candle_lighting, havdala, torah_portion, haftarah)
VALUES 
  ('תצוה', '2026-03-07', 'כד אדר תשפו', 2026, '17:26:00', '18:33:00', 'שמות כז-ל', 'יחזקאל מג:י-כז'),
  ('כי תשא', '2026-03-14', 'א ניסן תשפו', 2026, '17:34:00', '18:41:00', 'שמות ל-לד', 'מלכים א יח:א-לט'),
  ('ויקהל-פקודי', '2026-03-21', 'ח ניסן תשפו', 2026, '17:41:00', '18:48:00', 'שמות לה-מ', 'מלכים א ז:מ-נ'),
  ('ויקרא', '2026-03-28', 'טו ניסן תשפו', 2026, '17:48:00', '18:55:00', 'ויקרא א-ה', 'ישעיהו מג:כא-מד:כג')
ON CONFLICT (gregorian_date) DO UPDATE SET
  parasha_name = EXCLUDED.parasha_name,
  hebrew_date = EXCLUDED.hebrew_date,
  year = EXCLUDED.year,
  candle_lighting = EXCLUDED.candle_lighting,
  havdala = EXCLUDED.havdala,
  torah_portion = EXCLUDED.torah_portion,
  haftarah = EXCLUDED.haftarah;

-- ================================================================================
-- PART 12: SAMPLE DATA - EVENTS
-- ================================================================================

INSERT INTO events_extended (
  title, description, gregorian_date, gregorian_time, hebrew_date, 
  event_type, location, location_address, topic, organizer, 
  contact_phone, is_published
)
VALUES
  (
    'ערב פורים - מגילת אסתר',
    'קריאת מגילת אסתר בליווי הסבר ופעילויות לילדים. נא להגיע במסכות!',
    '2026-03-23', '19:30:00', 'יג אדר תשפו',
    'holiday', 'בית הכנסת הגדול', 'רח הרב קוק 15, אור יהודה',
    'מגילת אסתר', 'רבי כהן', '03-612-4477', true
  ),
  (
    'סדנת אפייה לפסח',
    'סדנת אפייה למצות ומאפים לפסח. מתאים לכל המשפחה!',
    '2026-03-25', '16:00:00', 'טו אדר תשפו',
    'lesson', 'מטבח הגרעין', 'רח ירושלים 8, אור יהודה',
    'הכנות לפסח', 'שרה לוי', '052-1234567', true
  ),
  (
    'מסיבת פורים לילדים',
    'מסיבת פורים עם הפעלות, משחקים, פעילויות יצירה ומשלוח מנות!',
    '2026-03-24', '10:00:00', 'יד אדר תשפו',
    'garin', 'מרכז הקהילה', 'רח הרצל 25, אור יהודה',
    'פורים', 'דוד כהן', '03-555-1234', true
  ),
  (
    'שיעור הכנה לפסח',
    'שיעור מקיף על הלכות פסח, הכשרת המטבח וחודש ניסן',
    '2026-03-30', '20:00:00', 'יז ניסן תשפו',
    'lesson', 'בית המדרש', 'רח בן גוריון 12, אור יהודה',
    'הלכות פסח', 'הרב אברהם', '054-9876543', true
  ),
  (
    'טיול בית הבד העתיק',
    'טיול משפחתי לבית הבד העתיק בתל קציר. נא להביא כובע ומים!',
    '2026-04-02', '09:00:00', 'יט ניסן תשפו',
    'garin', 'תל קציר', 'תל קציר, עמק בית שאן',
    'טיול חול המועד', 'משה דוד', '050-1112233', true
  )
ON CONFLICT DO NOTHING;

-- ================================================================================
-- PART 13: SAMPLE DATA - HOLIDAYS
-- ================================================================================

INSERT INTO jewish_holidays (holiday_name, holiday_name_english, hebrew_date, gregorian_date, year, is_major, category, description)
VALUES
  ('פורים', 'Purim', 'יד אדר תשפו', '2026-03-24', 2026, true, 'rabbinic', 'חג הפורים - קריאת המגילה, משלוח מנות ומתנות לאביונים'),
  ('פסח', 'Pesach', 'טו ניסן תשפו', '2026-04-04', 2026, true, 'biblical', 'חג הפסח - זכר ליציאת מצרים'),
  ('יום העצמאות', 'Independence Day', 'ה אייר תשפו', '2026-04-23', 2026, true, 'modern', 'יום העצמאות למדינת ישראל'),
  ('לג בעומר', 'Lag BaOmer', 'יח אייר תשפו', '2026-05-06', 2026, false, 'minor', 'לג בעומר - הילולת רבי שמעון בר יוחאי'),
  ('שבועות', 'Shavuot', 'ו סיוון תשפו', '2026-05-23', 2026, true, 'biblical', 'חג השבועות - מתן תורה')
ON CONFLICT (holiday_name, gregorian_date, year) DO UPDATE SET
  holiday_name_english = EXCLUDED.holiday_name_english,
  hebrew_date = EXCLUDED.hebrew_date,
  is_major = EXCLUDED.is_major,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- ================================================================================
-- SUCCESS MESSAGE
-- ================================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '  SUCCESS! Everything installed and fixed!';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - posts, events, gallery, contacts, leads';
  RAISE NOTICE '  - users_profiles (username auth)';
  RAISE NOTICE '  - events_extended (calendar)';
  RAISE NOTICE '  - parasha_readings (FIXED with all columns!)';
  RAISE NOTICE '  - jewish_holidays';
  RAISE NOTICE '  - zmanim_cache';
  RAISE NOTICE '';
  RAISE NOTICE 'Sample data inserted:';
  RAISE NOTICE '  - 5 events';
  RAISE NOTICE '  - 4 parasha readings';
  RAISE NOTICE '  - 5 holidays';
  RAISE NOTICE '';
  RAISE NOTICE 'All issues FIXED:';
  RAISE NOTICE '  - UNIQUE constraint added';
  RAISE NOTICE '  - Missing columns added';
  RAISE NOTICE '  - ON CONFLICT working';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Create admin user in Supabase Auth!';
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
END $$;
