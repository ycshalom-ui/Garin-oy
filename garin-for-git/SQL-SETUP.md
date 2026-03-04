# 🎯 הוראות SQL - פשוטות

## קבצי SQL בתיקייה:

### **להריץ (2 קבצים בלבד!):**

1. **FINAL-FIX.sql** ← הרץ ראשון
   - יוצר 3 טבלאות: events_extended, parasha_readings, jewish_holidays
   - מכניס נתוני דוגמה

2. **COMPLETE-CONFIG.sql** ← הרץ שני
   - יוצר את שאר הטבלאות
   - RLS policies
   - Triggers
   - Indexes

---

## הוראות:

```
1. Supabase → SQL Editor
2. Copy את FINAL-FIX.sql
3. Paste → Run
4. ✅ תראה "Done!"

5. Copy את COMPLETE-CONFIG.sql  
6. Paste → Run
7. ✅ תראה "Complete!"

זהו! הכל מוכן!
```

---

## גיבויים:

תיקייה: **sql-backups/**
- כל הגרסאות הקודמות
- לא להריץ!
- רק לגיבוי

---

## אחרי ה-SQL:

צור משתמש Admin:
```
Supabase → Auth → Add user
→ admin@garinoy.local
→ ☑️ Auto Confirm

SQL:
INSERT INTO users_profiles (id, username, email, full_name, role)
VALUES ('UUID', 'admin', 'admin@garinoy.local', 'Administrator', 'admin');
```

זהו! ✅
