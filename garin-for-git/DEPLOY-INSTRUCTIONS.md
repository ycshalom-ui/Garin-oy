# 🚀 הוראות העלאה ל-GitHub + Netlify

## 📋 מה יש בתיקייה הזו:

הקבצים מוכנים להעלאה ישירה ל-Git!

```
✅ package.json (בשורש!)
✅ src/
✅ public/
✅ vite.config.ts
✅ SUPABASE-SCHEMA.sql
✅ MIGRATION.sql
✅ כל הקבצים הנדרשים
```

---

## ⚡ 3 שלבים פשוטים:

### 1️⃣ העלה ל-GitHub

```bash
# א. אם יש לך repo קיים:
cd your-repo
rm -rf *                    # מחק הכל
cp -r path/to/these/files/* .   # העתק הכל
git add .
git commit -m "complete website - ready for deploy"
git push

# ב. אם אין לך repo:
# 1. GitHub → New Repository
# 2. העתק את כל הקבצים האלה לתיקייה החדשה
# 3. git init
# 4. git add .
# 5. git commit -m "initial commit"
# 6. git remote add origin YOUR_REPO_URL
# 7. git push -u origin main
```

---

### 2️⃣ הגדר Supabase

```
1. Supabase → SQL Editor
2. הרץ את SUPABASE-SCHEMA.sql (אם DB חדש)
   או הרץ את MIGRATION.sql (אם DB קיים)
3. Supabase → Storage → צור bucket "images" (public)
4. העתק:
   - Project URL
   - Anon Key
```

---

### 3️⃣ הגדר Netlify

```
1. Netlify → New Site from Git
2. Connect to GitHub
3. בחר את ה-Repository
4. Build Settings:
   
   Base directory: (ריק!)
   Build command: npm run build
   Publish directory: dist
   
5. Environment Variables:
   VITE_SUPABASE_URL = [הדבק URL]
   VITE_SUPABASE_ANON_KEY = [הדבק Key]
   
6. Deploy Site!
```

---

## ✅ זהו!

האתר יהיה חי תוך דקות!

---

## 🔧 אם יש בעיה:

### TypeScript Error?
→ כבר תוקן! אין import מיותרים

### SQL Error?
→ השתמש ב-MIGRATION.sql אם יש DB קיים

### Netlify Build Error?
→ וודא ש-Base directory ריק (לא garin-typescript)

---

## 📞 צריך עזרה?

כל הקבצים מוכנים ועובדים!

© 2026 גרעין תורני אור יהודה
