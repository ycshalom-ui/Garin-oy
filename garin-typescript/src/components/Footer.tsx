import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">גרעין תורני אור יהודה</h3>
            <p className="text-white/80">
              שליחות! לא רק בהתיישבות - גם בלב העיר. קהילה חמה ומגובשת במרכז הארץ.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
            <div className="flex flex-col gap-2 text-white/80">
              <Link to="/about" className="hover:text-white transition">אודות הגרעין</Link>
              <Link to="/parasha" className="hover:text-white transition">פרשת השבוע</Link>
              <Link to="/news" className="hover:text-white transition">עדכונים</Link>
              <Link to="/education" className="hover:text-white transition">מוסדות חינוך</Link>
              <Link to="/mechina" className="hover:text-white transition">מכינת לביא</Link>
              <Link to="/sherut-leumi" className="hover:text-white transition">שירות לאומי</Link>
              <Link to="/events" className="hover:text-white transition">אירועים</Link>
              <Link to="/gallery" className="hover:text-white transition">גלריה</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">צור קשר</h3>
            <div className="flex flex-col gap-2 text-white/80">
              <p>📞 03-612-4477</p>
              <p>✉️ garorye1@gmail.com</p>
              <p>📍 יוסף קארו 10, אור יהודה</p>
              <div className="flex gap-4 mt-4">
                <a href="https://www.facebook.com/garinoryehuda" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Facebook
                </a>
                <a href="https://www.youtube.com/@גרעיןתורניאוריהודה" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>© 2026 גרעין תורני אור יהודה - כל הזכויות שמורות</p>
        </div>
      </div>
    </footer>
  )
}
