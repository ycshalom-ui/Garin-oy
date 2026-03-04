# 🚀 גרעין תורני אור יהודה - מדריך הפעלה

**גרסה:** 3.0 FINAL
**תאריך:** 4 במרץ 2026

---

## 📦 מה יש בתיקייה:

```
✅ כל קוד האתר (React + TypeScript)
✅ לוח שנה עברי מלא
✅ 5 אירועים קרובים (widgets)
✅ דף פרטי אירוע
✅ Username authentication
✅ קובץ SQL אחד מושלם: SETUP-DATABASE.sql
✅ גיבויי SQL בתיקייה: sql-backups/
```

---

## 🎯 3 שלבים להפעלה:

### 1️⃣ הרץ SQL (5 דקות)

```
קובץ: SETUP-DATABASE.sql

1. פתח את הקובץ
2. Supabase → SQL Editor
3. Copy הכל (Ctrl+A, Ctrl+C)
4. Paste (Ctrl+V)
5. Run
6. תראה: "DATABASE SETUP COMPLETE!"
```

### 2️⃣ צור Admin (2 דקות)

```
1. Supabase → Auth → Add user
   Email: admin@garinoy.local
   Password: (בחר סיסמה)
   ☑️ Auto Confirm User

2. העתק UUID → SQL Editor:

INSERT INTO users_profiles (id, username, email, full_name, role)
VALUES ('UUID', 'admin', 'admin@garinoy.local', 'Administrator', 'admin');
```

### 3️⃣ העלה ל-GitHub (5 דקות)

```bash
git add .
git commit -m "v3.0 - Complete setup"
git push
```

---

## ✅ מה כלול:

### קוד:
- לוח שנה עברי מלא
- 5 אירועים קרובים
- דף פרטי אירוע
- Responsive מלא

### בסיס נתונים:
- SETUP-DATABASE.sql ← הקובץ להרצה!
- sql-backups/ ← גיבויים (לא להריץ)

---

## 🎯 זהו!

קובץ אחד → 3 שלבים → 10 דקות → אתר חי! 🚀

---

© 2026 גרעין תורני אור יהודה
