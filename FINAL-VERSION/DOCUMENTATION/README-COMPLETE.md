# 📚 מדריך מלא - גרעין תורני אור יהודה

## 🎯 סקירה כללית

האתר הושלם בהצלחה ב-1 במרץ 2026!

### ✨ תכונות עיקריות:
- ✅ 11 שיפורים ראשוניים (סרטון, חיפוש, מפות, וכו')
- ✅ גלריה מתקדמת עם אלבומים ותמונות/סרטונים
- ✅ תפריט מובייל משופר (Side Drawer)
- ✅ שליחת אימייל אוטומטי מטופס צור קשר
- ✅ Admin Panel מלא
- ✅ נגישות (7 תכונות)

---

# 📋 טכנולוגיות

## Frontend:
- **React 18** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## Backend:
- **Supabase** - Database + Auth + Storage
- **Web3Forms** - Email sending (חינמי!)

## Deployment:
- **GitHub** - Source control
- **Cloudflare Pages** - Hosting + CDN

---

# 🗄️ מבנה מסד הנתונים

## טבלאות (Supabase):

### 1. `posts`
```sql
- id (uuid)
- title (text)
- content (text)
- excerpt (text)
- category (text) → 'פרשת השבוע' | 'עדכונים'
- author (text)
- image_url (text)
- published (boolean)
- created_at (timestamp)
```

### 2. `events`
```sql
- id (uuid)
- title (text)
- description (text)
- date (date)
- time (text)
- location (text)
- created_at (timestamp)
```

### 3. `gallery_items`
```sql
- id (uuid)
- title (text)
- album (text) ← חשוב!
- type ('image' | 'video')
- url (text)
- created_at (timestamp)
```

### 4. `profiles`
```sql
- id (uuid) → מקושר ל-auth.users
- email (text)
- full_name (text)
- role (text) → 'admin' | 'editor' | 'user'
- created_at (timestamp)
```

### 5. `leads` (Contact Form)
```sql
- id (uuid)
- first_name (text)
- last_name (text)
- phone (text)
- email (text)
- message (text)
- created_at (timestamp)
```

---

# 👤 ניהול משתמשים

## Admin User:
```
Username: Administrator
Email: garorye1@garorye1.com
Password: garorye10
Role: admin
```

## הרשאות לפי תפקיד:

### Admin (מנהל):
- ✅ ניהול משתמשים
- ✅ יצירת/עריכת פוסטים
- ✅ יצירת/עריכת אירועים
- ✅ העלאת תמונות/סרטונים לגלריה
- ✅ צפייה בפניות (Leads)
- ✅ גישה מלאה לכל המערכת

### Editor (עורך):
- ✅ יצירת/עריכת פוסטים
- ✅ יצירת/עריכת אירועים
- ✅ העלאת תמונות/סרטונים לגלריה
- ❌ ניהול משתמשים

### User (משתמש):
- ✅ צפייה בלבד

---

# 📧 שליחת אימייל (Contact Form)

## Web3Forms Setup:

### 1. הרשם ב-Web3Forms:
```
https://web3forms.com
→ Sign up (חינמי!)
→ קבל Access Key
```

### 2. החלף את ה-Key:
```typescript
// בקובץ: ContactFormWithEmail.tsx
access_key: 'YOUR_WEB3FORMS_KEY_HERE'
```

### 3. האימייל מגיע ל:
```
garorye1@gmail.com
```

### 4. Template:
```
Subject: הודעה חדשה מאתר הגרעין - [שם]
From: [name]
Email: [email]
Phone: [phone]
Message: [message]
```

---

# 🎨 תפריט מובייל (Side Drawer)

## תכונות:
- ✅ נפתח מהצד (RTL - מימין לשמאל)
- ✅ רקע כהה (Backdrop)
- ✅ כפתור ירוק בולט עם טקסט "תפריט"
- ✅ אייקונים לכל דף
- ✅ סגירה על ידי:
  - לחיצה על X
  - לחיצה על הרקע
  - בחירת קישור

## קוד:
```
src/components/NavbarImproved.tsx
```

---

# 🖼️ גלריה - מדריך שימוש

## להעלות תמונה/סרטון:

### 1. כניסה ל-Admin:
```
/admin → התחבר
```

### 2. טאב "גלריה":
```
כותרת: "מסיבת פורים" (אופציונלי)
אלבום: "פורים 2026" (חובה!)
סוג: תמונה / סרטון
קובץ: [בחר קובץ]
→ העלה
```

### 3. הגלריה:
```
/gallery
→ בחר אלבום
→ לחץ על תמונה
→ Lightbox נפתח!
```

---

# 🔐 אבטחה (Security)

## Row Level Security (RLS):

### Posts:
```sql
- Public: רק פוסטים published
- Authenticated: CRUD מלא
```

### Events:
```sql
- Public: קריאה בלבד
- Authenticated: CRUD מלא
```

### Gallery:
```sql
- Public: קריאה בלבד
- Authenticated: CRUD מלא
```

### Leads:
```sql
- Public: INSERT בלבד
- Authenticated: קריאה בלבד
```

## Storage:
```
Buckets: images, videos, documents
Public: קריאה
Authenticated: CRUD
```

---

# 🚀 Deployment

## GitHub → Cloudflare Flow:

### 1. Local Changes:
```bash
git add .
git commit -m "Your message"
git push
```

### 2. Cloudflare Auto-Deploy:
```
→ Webhook triggered
→ Build starts (2-3 min)
→ Deploy to production
```

### 3. Check:
```
Cloudflare → Deployments
→ Status: Success ✅
```

---

# 🛠️ Troubleshooting

## Build Failed:

### TypeScript Errors:
```bash
# בדוק:
src/types/index.ts
→ וודא שיש album?: string ב-GalleryItem
```

### Missing Dependencies:
```bash
npm install
npm run build
```

## Supabase Errors:

### Table Not Found:
```sql
-- הרץ:
COMPLETE-SCHEMA-FINAL.sql
```

### Missing Column:
```sql
ALTER TABLE gallery_items
ADD COLUMN album TEXT;
```

## Email Not Sending:

### Web3Forms:
```
1. בדוק שיש Access Key
2. וודא ש-to_email נכון
3. בדוק Console ל-errors
```

---

# 📁 קבצים חשובים

## SQL Files:
```
COMPLETE-SCHEMA-FINAL.sql → Schema מלא
ADD-ALBUM-COLUMN.sql → הוספת album
CREATE-ADMIN-USER.sql → יצירת admin
```

## Components:
```
NavbarImproved.tsx → תפריט צד מובייל
ContactFormWithEmail.tsx → טופס עם אימייל
Gallery.tsx → גלריה מתקדמת
Admin.tsx → Admin Panel
```

## Pages:
```
Home.tsx → דף הבית
News.tsx → פרשה + עדכונים
Gallery.tsx → גלריה
About.tsx → אודות + משרד
```

---

# 🔄 גיבויים

## Weekly Backup:

### 1. Supabase:
```
Supabase → Database → Backups
→ Download SQL
```

### 2. Storage:
```
Supabase → Storage → Download all
```

### 3. GitHub:
```
Automatic (every push)
```

---

# 📞 תמיכה

## צריך עזרה?

### 1. בדוק את ה-logs:
```
Cloudflare → Deployments → View logs
```

### 2. בדוק Supabase:
```
Supabase → Logs → API
```

### 3. צור Issue:
```
GitHub → Issues → New
```

---

# ✅ Checklist תחזוקה שבועית

- [ ] בדוק Supabase Backup
- [ ] בדוק Cloudflare Deployments
- [ ] בדוק Storage Usage
- [ ] בדוק Leads חדשות
- [ ] בדוק שהאתר עובד
- [ ] בדוק Mobile Navigation
- [ ] בדוק Email sending

---

# 🎉 הושלם!

**תאריך:** 1 במרץ 2026
**סטטוס:** Production Ready ✅
**גרסה:** 2.0

© 2026 גרעין תורני אור יהודה
