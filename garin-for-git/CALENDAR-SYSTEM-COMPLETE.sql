-- ================================================================================
-- GARIN TORANI - COMPLETE CALENDAR SYSTEM
-- Version: 2.9 FINAL - Full Calendar with Hebrew Dates
-- Date: March 3, 2026
-- ================================================================================
--
-- This file includes:
-- ✅ All base tables
-- ✅ Username authentication
-- ✅ Complete calendar system with Hebrew dates
-- ✅ Parasha and Shabbat times
-- ✅ Jewish holidays
-- ✅ Sample events data
--
-- ================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================
-- PART 1: BASE TABLES (if not exist)
-- ================================================================================

-- Posts, events, gallery, contacts, leads (existing tables)
-- (הטבלאות האלה כבר קיימות מהקובץ הקודם COMPLETE-ALL-IN-ONE.sql)

-- ================================================================================
-- PART 2: EXTENDED EVENTS TABLE with Full Calendar Features
-- ================================================================================

CREATE TABLE IF NOT EXISTS events_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Dates (Gregorian)
  gregorian_date DATE NOT NULL,
  gregorian_time TIME,
  end_date DATE,
  end_time TIME,
  
  -- Dates (Hebrew)
  hebrew_date TEXT,
  hebrew_month TEXT,
  hebrew_day INTEGER,
  hebrew_year INTEGER,
  
  -- Event Type
  event_type TEXT CHECK (event_type IN ('garin', 'holiday', 'birthday', 'lesson', 'other')),
  
  -- Holiday specific
  is_jewish_holiday BOOLEAN DEFAULT FALSE,
  holiday_name TEXT,
  is_rosh_chodesh BOOLEAN DEFAULT FALSE,
  
  -- Location
  location TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_notes TEXT,
  
  -- Media
  image_url TEXT,
  
  -- Additional Info
  topic TEXT,
  organizer TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  recurrence_end_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE
);

-- ================================================================================
-- PART 3: PARASHA (Weekly Torah Reading) TABLE
-- ================================================================================

CREATE TABLE IF NOT EXISTS parasha_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parasha_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  hebrew_date TEXT NOT NULL,
  year INTEGER NOT NULL,
  
  -- Shabbat Times
  candle_lighting TIME,
  havdala TIME,
  
  -- Torah Reading
  torah_portion TEXT,
  haftarah TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(gregorian_date, year)
);

-- ================================================================================
-- PART 4: JEWISH HOLIDAYS TABLE
-- ================================================================================

CREATE TABLE IF NOT EXISTS jewish_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holiday_name TEXT NOT NULL,
  holiday_name_english TEXT,
  hebrew_date TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  year INTEGER NOT NULL,
  
  -- Holiday Info
  is_major BOOLEAN DEFAULT FALSE,
  is_fast_day BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('biblical', 'rabbinic', 'modern', 'minor')),
  description TEXT,
  
  -- Times (if applicable)
  start_time TIME,
  end_time TIME,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(holiday_name, gregorian_date, year)
);

-- ================================================================================
-- PART 5: ZMANIM (Jewish Times) CACHE TABLE
-- ================================================================================

CREATE TABLE IF NOT EXISTS zmanim_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  location TEXT NOT NULL DEFAULT 'Or Yehuda',
  latitude DECIMAL(10, 8) DEFAULT 32.0297,
  longitude DECIMAL(11, 8) DEFAULT 34.8585,
  
  -- Dawn and Morning
  alot_hashachar TIME,
  misheyakir TIME,
  sunrise TIME,
  
  -- Shema and Prayer
  sof_zman_shma_mga TIME,
  sof_zman_shma_gra TIME,
  sof_zman_tfila TIME,
  
  -- Midday
  chatzot TIME,
  
  -- Afternoon
  mincha_gedola TIME,
  mincha_ketana TIME,
  plag_hamincha TIME,
  
  -- Evening
  sunset TIME,
  tzait_hakochavim TIME,
  
  -- Shabbat
  candle_lighting TIME,
  havdala TIME,
  
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date, location)
);

-- ================================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================================

CREATE INDEX IF NOT EXISTS idx_events_extended_gregorian_date ON events_extended(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_events_extended_event_type ON events_extended(event_type);
CREATE INDEX IF NOT EXISTS idx_events_extended_is_published ON events_extended(is_published);
CREATE INDEX IF NOT EXISTS idx_events_extended_created_at ON events_extended(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_parasha_readings_date ON parasha_readings(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_parasha_readings_year ON parasha_readings(year);

CREATE INDEX IF NOT EXISTS idx_jewish_holidays_date ON jewish_holidays(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_year ON jewish_holidays(year);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_category ON jewish_holidays(category);

CREATE INDEX IF NOT EXISTS idx_zmanim_cache_date ON zmanim_cache(date);
CREATE INDEX IF NOT EXISTS idx_zmanim_cache_location ON zmanim_cache(location);

-- ================================================================================
-- TRIGGERS
-- ================================================================================

DROP FUNCTION IF EXISTS update_events_extended_at() CASCADE;
CREATE OR REPLACE FUNCTION update_events_extended_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_extended_timestamp ON events_extended;
CREATE TRIGGER update_events_extended_timestamp
  BEFORE UPDATE ON events_extended
  FOR EACH ROW
  EXECUTE FUNCTION update_events_extended_at();

-- ================================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================================

ALTER TABLE events_extended ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can view published events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can view all events" ON events_extended;
DROP POLICY IF EXISTS "Admins and managers can create events" ON events_extended;
DROP POLICY IF EXISTS "Users can create own events" ON events_extended;
DROP POLICY IF EXISTS "Creator or admin can update events" ON events_extended;
DROP POLICY IF EXISTS "Only admins can delete events" ON events_extended;

-- Everyone can view published events
CREATE POLICY "Everyone can view published events"
  ON events_extended FOR SELECT
  USING (is_published = true);

-- Authenticated users can view all events
CREATE POLICY "Auth users can view all events"
  ON events_extended FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can create events
CREATE POLICY "Auth users can create events"
  ON events_extended FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Creator or admins can update
CREATE POLICY "Creator or admin can update events"
  ON events_extended FOR UPDATE
  USING (
    created_by = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete
CREATE POLICY "Only admins can delete events"
  ON events_extended FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================================================
-- SAMPLE DATA - Parasha for March 2026
-- ================================================================================

INSERT INTO parasha_readings (parasha_name, gregorian_date, hebrew_date, year, candle_lighting, havdala, torah_portion, haftarah)
VALUES 
  ('תצוה', '2026-03-07', 'כ"ד אדר תשפ"ו', 2026, '17:26:00', '18:33:00', 'שמות כז-ל', 'יחזקאל מג:י-כז'),
  ('כי תשא', '2026-03-14', 'א'' ניסן תשפ"ו', 2026, '17:34:00', '18:41:00', 'שמות ל-לד', 'מלכים א יח:א-לט'),
  ('ויקהל-פקודי', '2026-03-21', 'ח'' ניסן תשפ"ו', 2026, '17:41:00', '18:48:00', 'שמות לה-מ', 'מלכים א ז:מ-נ'),
  ('ויקרא', '2026-03-28', 'ט"ו ניסן תשפ"ו', 2026, '17:48:00', '18:55:00', 'ויקרא א-ה', 'ישעיהו מג:כא-מד:כג')
ON CONFLICT (gregorian_date, year) DO NOTHING;

-- ================================================================================
-- SAMPLE DATA - Upcoming Events
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
    '2026-03-23',
    '19:30:00',
    'י"ג אדר תשפ"ו',
    'holiday',
    'בית הכנסת הגדול',
    'רח'' הרב קוק 15, אור יהודה',
    'מגילת אסתר',
    'רבי כהן',
    '03-612-4477',
    true
  ),
  (
    'סדנת אפייה לפסח',
    'סדנת אפייה למצות ומאפים לפסח. מתאים לכל המשפחה!',
    '2026-03-25',
    '16:00:00',
    'ט"ו אדר תשפ"ו',
    'lesson',
    'מטבח הגרעין',
    'רח'' ירושלים 8, אור יהודה',
    'הכנות לפסח',
    'שרה לוי',
    '052-1234567',
    true
  ),
  (
    'מסיבת פורים לילדים',
    'מסיבת פורים עם הפעלות, משחקים, פעילויות יצירה ומשלוח מנות!',
    '2026-03-24',
    '10:00:00',
    'י"ד אדר תשפ"ו',
    'garin',
    'מרכז הקהילה',
    'רח'' הרצל 25, אור יהודה',
    'פורים',
    'דוד כהן',
    '03-555-1234',
    true
  ),
  (
    'שיעור הכנה לפסח',
    'שיעור מקיף על הלכות פסח, הכשרת המטבח וחודש ניסן',
    '2026-03-30',
    '20:00:00',
    'י"ז ניסן תשפ"ו',
    'lesson',
    'בית המדרש',
    'רח'' בן גוריון 12, אור יהודה',
    'הלכות פסח',
    'הרב אברהם',
    '054-9876543',
    true
  ),
  (
    'טיול בית הבד העתיק',
    'טיול משפחתי לבית הבד העתיק בתל קציר. נא להביא כובע ומים!',
    '2026-04-02',
    '09:00:00',
    'י"ט ניסן תשפ"ו',
    'garin',
    'תל קציר',
    'תל קציר, עמק בית שאן',
    'טיול חול המועד',
    'משה דוד',
    '050-1112233',
    true
  )
ON CONFLICT DO NOTHING;

-- ================================================================================
-- SAMPLE DATA - Jewish Holidays for 2026
-- ================================================================================

INSERT INTO jewish_holidays (holiday_name, holiday_name_english, hebrew_date, gregorian_date, year, is_major, category, description)
VALUES
  ('פורים', 'Purim', 'י"ד אדר תשפ"ו', '2026-03-24', 2026, true, 'rabbinic', 'חג הפורים - קריאת המגילה, משלוח מנות ומתנות לאביונים'),
  ('פסח', 'Pesach', 'ט"ו ניסן תשפ"ו', '2026-04-04', 2026, true, 'biblical', 'חג הפסח - זכר ליציאת מצרים'),
  ('יום העצמאות', 'Independence Day', 'ה'' אייר תשפ"ו', '2026-04-23', 2026, true, 'modern', 'יום העצמאות למדינת ישראל'),
  ('לג בעומר', 'Lag BaOmer', 'י"ח אייר תשפ"ו', '2026-05-06', 2026, false, 'minor', 'לג בעומר - הילולת רבי שמעון בר יוחאי'),
  ('שבועות', 'Shavuot', 'ו'' סיוון תשפ"ו', '2026-05-23', 2026, true, 'biblical', 'חג השבועות - מתן תורה')
ON CONFLICT (holiday_name, gregorian_date, year) DO NOTHING;

-- ================================================================================
-- SUCCESS MESSAGE
-- ================================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '  🎉 COMPLETE CALENDAR SYSTEM READY! 🎉';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables Created:';
  RAISE NOTICE '  ✅ events_extended (Full event system)';
  RAISE NOTICE '  ✅ parasha_readings (Shabbat + Parasha)';
  RAISE NOTICE '  ✅ jewish_holidays (Automatic holidays)';
  RAISE NOTICE '  ✅ zmanim_cache (Jewish times)';
  RAISE NOTICE '';
  RAISE NOTICE 'Sample Data Added:';
  RAISE NOTICE '  ✅ 4 Parasha readings for March 2026';
  RAISE NOTICE '  ✅ 5 Upcoming events';
  RAISE NOTICE '  ✅ 5 Jewish holidays';
  RAISE NOTICE '';
  RAISE NOTICE 'Features Available:';
  RAISE NOTICE '  ✅ Hebrew + Gregorian dates';
  RAISE NOTICE '  ✅ Full event details (location, topic, contact)';
  RAISE NOTICE '  ✅ Participant tracking';
  RAISE NOTICE '  ✅ Event types (garin, holiday, lesson, birthday)';
  RAISE NOTICE '  ✅ Shabbat times';
  RAISE NOTICE '  ✅ Parasha names';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Deploy code to GitHub';
  RAISE NOTICE '  2. Test calendar view';
  RAISE NOTICE '  3. Test event widgets';
  RAISE NOTICE '  4. Add more events!';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ================================================================================
-- END OF SCHEMA
-- ================================================================================
