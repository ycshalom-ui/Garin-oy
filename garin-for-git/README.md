# 🕍 גרעין תורני אור יהודה - React TypeScript

## 🚀 התקנה מהירה

```bash
npm install
```

## ⚙️ הגדרת Supabase

1. צור פרויקט ב-https://supabase.com
2. הרץ את `SUPABASE-SCHEMA.sql` ב-SQL Editor
3. קבל URL + Anon Key מ-Settings → API
4. צור `.env`:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 🏃 הרצה

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

קבצי ה-build יהיו ב-`dist/`

## 🌐 Deploy ל-Netlify

### דרך 1: Drag & Drop
```bash
npm run build
# גרור את dist/ ל-https://app.netlify.com/drop
```

### דרך 2: GitHub
1. העלה ל-GitHub
2. חבר Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📦 טכנולוגיות

- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🗄️ Supabase
- 🚀 Vite
- 🛣️ React Router
...
## 📁 מבנה

```
src/
├── components/     (Navbar, Footer)
├── pages/          (Home, About, Torah, Events, Gallery, Contact)
├── lib/            (supabase.ts)
├── types/          (index.ts, database.ts)
├── App.tsx
└── main.tsx
```

## ✅ עברית RTL מלאה

כל הכפתורים, הטקסטים והטפסים בעברית!

---

© 2026 גרעין תורני אור יהודה
