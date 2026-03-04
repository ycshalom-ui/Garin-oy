# 🚀 הוראות יישום מהיר - גרעין תורני אור יהודה

**גרסה:** 2.9 FINAL - Complete Calendar System
**תאריך:** 3 במרץ 2026

---

# ✅ מה יש בתיקייה הזו?

```
✅ כל הקוד של האתר (React + TypeScript)
✅ לוח שנה מלא עם תאריכים עבריים
✅ 5 widgets אירועים קרובים
✅ דף פרטי אירוע מפורט
✅ Username authentication
✅ 2 קבצי SQL מוכנים
✅ הכל responsive ומוכן!
```

---

# 🎯 3 שלבים פשוטים ליישום:

## שלב 1️⃣: SQL (5 דקות)

```
1. פתח: https://supabase.com → הפרויקט שלך
2. לך ל: SQL Editor

3. הרץ את 2 הקבצים לפי הסדר:

   קודם: COMPLETE-ALL-IN-ONE.sql
   ↓
   אחרי: CALENDAR-SYSTEM-COMPLETE.sql

4. תראה הודעה: "🎉 COMPLETE CALENDAR SYSTEM READY!"

5. בדוק:
   SELECT COUNT(*) FROM events_extended;
   → צריך: 5 אירועים
```

---

## שלב 2️⃣: צור משתמש Admin (5 דקות)

```
1. Supabase → Authentication → Users → Add user

2. מלא:
   Email: admin@garinoy.local
   Password: G@ar!nOr!q@w#E
   ☑️ Auto Confirm User ← חובה!

3. העתק את ה-UUID

4. SQL Editor:

INSERT INTO users_profiles (id, username, email, full_name, role)
VALUES (
  'UUID-שהעתקת',
  'admin',
  'admin@garinoy.local',
  'Administrator',
  'admin'
);

5. עכשיו אתה יכול להיכנס:
   Username: admin
   Password: G@ar!nOr!q@w#E
```

---

## שלב 3️⃣: העלה לGitHub (10 דקות)

```bash
cd garin-for-git

# אתחול Git (אם עוד לא):
git init
git branch -M main

# הוסף הכל:
git add .
git commit -m "v2.9 - Complete Calendar System"

# התחבר לGitHub (אם עוד לא):
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# העלה:
git push -u origin main

# Cloudflare יעשה deploy אוטומטי!
```

---

# 📦 מה חדש בגרסה 2.9?

## רכיבים חדשים:

```
src/components/HebrewCalendar.tsx
→ לוח שנה מלא עם תאריכים עבריים + לועזיים

src/components/EventWidgets.tsx
→ 5 אירועים קרובים בכרטיסים לרוחב

src/pages/EventDetail.tsx
→ דף פרטי אירוע עם כל הפרטים

src/pages/EventsNew.tsx
→ דף אירועים משודרג
```

---

## טבלאות חדשות:

```sql
events_extended
→ כל פרטי האירועים (מיקום, נושא, איש קשר, תאריכים עבריים)

parasha_readings
→ פרשות שבוע + זמני שבת

jewish_holidays
→ חגים עבריים אוטומטיים

zmanim_cache
→ זמני תפילה וכניסת/צאת שבת
```

---

# 🎨 תכונות עיקריות:

```
✅ לוח שנה עברי-לועזי מלא
✅ פרשת השבוע אוטומטית (Hebcal API)
✅ זמני כניסת/צאת שבת
✅ 5 אירועים קרובים
✅ "היום"/"מחר"/"בעוד X ימים"
✅ דף פרטי אירוע:
   - תיאור מפורט
   - מיקום + קישור ל-Google Maps
   - איש קשר (טלפון + אימייל)
   - מספר משתתפים
   - כפתור שיתוף
✅ 4 סוגי אירועים:
   - 📅 אירועי גרעין (ירוק)
   - 🎭 חגים (כתום)
   - 🎂 ימי הולדת (ורוד)
   - 📚 שיעורים (כחול)
✅ Responsive מלא (Desktop + Tablet + Mobile)
```

---

# 📊 נתוני דוגמה שכבר בפנים:

```
✅ 5 אירועים קרובים (פורים, סדנאות, טיולים)
✅ 4 פרשות שבוע (מרץ 2026)
✅ 5 חגים עבריים
```

---

# 🆘 בעיות נפוצות:

## "Invalid login credentials"

```
1. ודא ש-Auto Confirm User מסומן
2. ודא שהמשתמש ב-users_profiles
3. נסה:
   SELECT * FROM users_profiles WHERE username = 'admin';
```

---

## "לא רואה אירועים"

```
בדוק:
SELECT * FROM events_extended WHERE is_published = true;

אם אין:
UPDATE events_extended SET is_published = true;
```

---

## "Cloudflare לא עושה deploy"

```
בדוק הגדרות:
- Framework: Vite
- Build command: npm run build
- Output: dist
- Root directory: garin-for-git ← חשוב!
```

---

# 📂 מבנה התיקייה:

```
garin-for-git/
├── src/
│   ├── components/
│   │   ├── HebrewCalendar.tsx ← חדש!
│   │   ├── EventWidgets.tsx ← חדש!
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── EventDetail.tsx ← חדש!
│   │   ├── EventsNew.tsx ← חדש!
│   │   ├── Admin.tsx
│   │   ├── Home.tsx
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
├── public/
│   └── logo.jpg
├── COMPLETE-ALL-IN-ONE.sql ← חדש!
├── CALENDAR-SYSTEM-COMPLETE.sql ← חדש!
├── package.json
└── README-DEPLOY.md (הקובץ הזה)
```

---

# 💡 איך להוסיף אירוע חדש:

```sql
-- SQL Editor:

INSERT INTO events_extended (
  title, description, gregorian_date, gregorian_time,
  hebrew_date, event_type, location, location_address,
  topic, organizer, contact_phone, is_published
)
VALUES (
  'שם האירוע',
  'תיאור מפורט',
  '2026-04-15',            -- תאריך (YYYY-MM-DD)
  '20:00:00',              -- שעה (HH:MM:SS)
  'כ"ב ניסן תשפ"ו',       -- תאריך עברי
  'garin',                 -- סוג: garin/holiday/birthday/lesson
  'בית הכנסת',            -- מקום
  'רח'' הרב קוק 15, אור יהודה',  -- כתובת
  'נושא',                  -- נושא
  'שם המארגן',            -- מארגן
  '03-612-4477',           -- טלפון
  true                     -- פורסם
);
```

---

# ✅ Checklist:

```
□ הרצתי COMPLETE-ALL-IN-ONE.sql
□ הרצתי CALENDAR-SYSTEM-COMPLETE.sql
□ יצרתי משתמש admin ב-Supabase
□ הוספתי את המשתמש ל-users_profiles
□ העליתי ל-GitHub
□ Cloudflare עשה deploy
□ נכנסתי ל-/events ורואה אירועים
□ לחצתי "לוח שנה" ורואה לוח מלא
□ הכל עובד במובייל
```

---

# 🎯 זהו! הכל מוכן!

```
✅ הרץ את 2 קבצי ה-SQL
✅ צור משתמש admin
✅ העלה ל-GitHub
✅ תהנה מהאתר החדש! 🎉
```

---

**שם תיקייה:** `garin-for-git` (תמיד!)

**בהצלחה!** 🚀

© 2026 גרעין תורני אור יהודה
