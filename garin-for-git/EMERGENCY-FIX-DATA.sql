-- ================================================================================
-- EMERGENCY FIX - Add Constraint and Insert Data
-- ================================================================================
-- Run this if you got the "no unique constraint" error
-- ================================================================================

-- STEP 1: Add UNIQUE constraint (with error handling)
DO $$
BEGIN
  -- Drop constraint if exists (to start fresh)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'parasha_readings_gregorian_date_unique') THEN
    ALTER TABLE parasha_readings DROP CONSTRAINT parasha_readings_gregorian_date_unique;
    RAISE NOTICE 'Dropped existing constraint';
  END IF;
  
  -- Add it fresh
  ALTER TABLE parasha_readings ADD CONSTRAINT parasha_readings_gregorian_date_unique UNIQUE (gregorian_date);
  RAISE NOTICE 'Added UNIQUE constraint successfully';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error adding constraint: %', SQLERRM;
END $$;

-- STEP 2: Verify it exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'parasha_readings_gregorian_date_unique') THEN
    RAISE EXCEPTION 'UNIQUE constraint still missing - cannot continue';
  ELSE
    RAISE NOTICE 'Constraint verified - proceeding with INSERT';
  END IF;
END $$;

-- STEP 3: Insert parasha data
INSERT INTO parasha_readings (parasha_name, gregorian_date, hebrew_date, year, candle_lighting, havdala, torah_portion, haftarah)
VALUES 
  ('תצוה', '2026-03-07', 'כד אדר תשפו', 2026, '17:26:00', '18:33:00', 'שמות כז-ל', 'יחזקאל מג:י-כז'),
  ('כי תשא', '2026-03-14', 'א ניסן תשפו', 2026, '17:34:00', '18:41:00', 'שמות ל-לד', 'מלכים א יח:א-לט'),
  ('ויקהל-פקודי', '2026-03-21', 'ח ניסן תשפו', 2026, '17:41:00', '18:48:00', 'שמות לה-מ', 'מלכים א ז:מ-נ'),
  ('ויקרא', '2026-03-28', 'טו ניסן תשפו', 2026, '17:48:00', '18:55:00', 'ויקרא א-ה', 'ישעיהו מח:כא-מד:כג')
ON CONFLICT (gregorian_date) DO UPDATE SET 
  parasha_name=EXCLUDED.parasha_name, 
  hebrew_date=EXCLUDED.hebrew_date, 
  year=EXCLUDED.year, 
  candle_lighting=EXCLUDED.candle_lighting, 
  havdala=EXCLUDED.havdala, 
  torah_portion=EXCLUDED.torah_portion, 
  haftarah=EXCLUDED.haftarah;

-- STEP 4: Insert events
INSERT INTO events_extended (title, description, gregorian_date, gregorian_time, hebrew_date, event_type, location, location_address, topic, organizer, contact_phone, is_published)
VALUES
  ('ערב פורים - מגילת אסתר', 'קריאת מגילת אסתר בליווי הסבר ופעילויות לילדים. נא להגיע במסכות!', '2026-03-23', '19:30:00', 'יג אדר תשפו', 'holiday', 'בית הכנסת הגדול', 'רח הרב קוק 15, אור יהודה', 'מגילת אסתר', 'רבי כהן', '03-612-4477', true),
  ('סדנת אפייה לפסח', 'סדנת אפייה למצות ומאפים לפסח. מתאים לכל המשפחה!', '2026-03-25', '16:00:00', 'טו אדר תשפו', 'lesson', 'מטבח הגרעין', 'רח ירושלים 8, אור יהודה', 'הכנות לפסח', 'שרה לוי', '052-1234567', true),
  ('מסיבת פורים לילדים', 'מסיבת פורים עם הפעלות, משחקים, פעילויות יצירה ומשלוח מנות!', '2026-03-24', '10:00:00', 'יד אדר תשפו', 'garin', 'מרכז הקהילה', 'רח הרצל 25, אור יהודה', 'פורים', 'דוד כהן', '03-555-1234', true),
  ('שיעור הכנה לפסח', 'שיעור מקיף על הלכות פסח, הכשרת המטבח וחודש ניסן', '2026-03-30', '20:00:00', 'יז ניסן תשפו', 'lesson', 'בית המדרש', 'רח בן גוריון 12, אור יהודה', 'הלכות פסח', 'הרב אברהם', '054-9876543', true),
  ('טיול בית הבד העתיק', 'טיול משפחתי לבית הבד העתיק בתל קציר. נא להביא כובע ומים!', '2026-04-02', '09:00:00', 'יט ניסן תשפו', 'garin', 'תל קציר', 'תל קציר, עמק בית שאן', 'טיול חול המועד', 'משה דוד', '050-1112233', true)
ON CONFLICT DO NOTHING;

-- STEP 5: Insert holidays
INSERT INTO jewish_holidays (holiday_name, holiday_name_english, hebrew_date, gregorian_date, year, is_major, category, description)
VALUES
  ('פורים', 'Purim', 'יד אדר תשפו', '2026-03-24', 2026, true, 'rabbinic', 'חג הפורים - קריאת המגילה, משלוח מנות ומתנות לאביונים'),
  ('פסח', 'Pesach', 'טו ניסן תשפו', '2026-04-04', 2026, true, 'biblical', 'חג הפסח - זכר ליציאת מצרים'),
  ('יום העצמאות', 'Independence Day', 'ה אייר תשפו', '2026-04-23', 2026, true, 'modern', 'יום העצמאות למדינת ישראל'),
  ('לג בעומר', 'Lag BaOmer', 'יח אייר תשפו', '2026-05-06', 2026, false, 'minor', 'לג בעומר - הילולת רבי שמעון בר יוחאי'),
  ('שבועות', 'Shavuot', 'ו סיוון תשפו', '2026-05-23', 2026, true, 'biblical', 'חג השבועות - מתן תורה')
ON CONFLICT (holiday_name, gregorian_date, year) DO UPDATE SET 
  holiday_name_english=EXCLUDED.holiday_name_english, 
  hebrew_date=EXCLUDED.hebrew_date, 
  is_major=EXCLUDED.is_major, 
  category=EXCLUDED.category, 
  description=EXCLUDED.description;

-- SUCCESS!
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '  SUCCESS! Data inserted!';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '4 parasha readings, 5 events, 5 holidays';
  RAISE NOTICE 'Check: SELECT * FROM parasha_readings;';
  RAISE NOTICE '================================================================';
END $$;
