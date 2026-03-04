-- Drop and recreate ONLY the 3 problematic tables
DROP TABLE IF EXISTS events_extended CASCADE;
DROP TABLE IF EXISTS parasha_readings CASCADE;
DROP TABLE IF EXISTS jewish_holidays CASCADE;

-- Create with ALL columns
CREATE TABLE events_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  gregorian_date DATE NOT NULL,
  gregorian_time TIME,
  hebrew_date TEXT,
  event_type TEXT,
  location TEXT,
  location_address TEXT,
  topic TEXT,
  organizer TEXT,
  contact_phone TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE parasha_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parasha_name TEXT NOT NULL,
  gregorian_date DATE NOT NULL UNIQUE,
  hebrew_date TEXT NOT NULL,
  year INTEGER,
  candle_lighting TIME,
  havdala TIME,
  torah_portion TEXT,
  haftarah TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE jewish_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holiday_name TEXT NOT NULL,
  holiday_name_english TEXT,
  hebrew_date TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  year INTEGER NOT NULL,
  is_major BOOLEAN DEFAULT FALSE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(holiday_name, gregorian_date, year)
);

-- Insert data
INSERT INTO parasha_readings VALUES 
  (uuid_generate_v4(), 'תצוה', '2026-03-07', 'כד אדר תשפו', 2026, '17:26', '18:33', 'שמות כז-ל', 'יחזקאל מג:י-כז', NOW()),
  (uuid_generate_v4(), 'כי תשא', '2026-03-14', 'א ניסן תשפו', 2026, '17:34', '18:41', 'שמות ל-לד', 'מלכים א יח:א-לט', NOW()),
  (uuid_generate_v4(), 'ויקהל-פקודי', '2026-03-21', 'ח ניסן תשפו', 2026, '17:41', '18:48', 'שמות לה-מ', 'מלכים א ז:מ-נ', NOW()),
  (uuid_generate_v4(), 'ויקרא', '2026-03-28', 'טו ניסן תשפו', 2026, '17:48', '18:55', 'ויקרא א-ה', 'ישעיהו מג:כא-מד:כג', NOW());

INSERT INTO events_extended (title, description, gregorian_date, gregorian_time, hebrew_date, event_type, location, location_address, topic, organizer, contact_phone, is_published) VALUES
  ('ערב פורים', 'מגילת אסתר', '2026-03-23', '19:30', 'יג אדר תשפו', 'holiday', 'בית כנסת', 'רח הרב קוק 15', 'פורים', 'רבי כהן', '03-612-4477', true),
  ('פורים לילדים', 'מסיבה', '2026-03-24', '10:00', 'יד אדר תשפו', 'garin', 'מרכז קהילה', 'רח הרצל 25', 'פורים', 'דוד', '03-555-1234', true);

INSERT INTO jewish_holidays VALUES
  (uuid_generate_v4(), 'פורים', 'Purim', 'יד אדר תשפו', '2026-03-24', 2026, true, 'rabbinic', 'חג הפורים', NOW()),
  (uuid_generate_v4(), 'פסח', 'Pesach', 'טו ניסן תשפו', '2026-04-04', 2026, true, 'biblical', 'חג הפסח', NOW());

SELECT 'Done!' as status;
