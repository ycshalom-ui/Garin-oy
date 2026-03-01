import { Link } from 'react-router-dom'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr,1fr,2fr] gap-8 mb-8">
          
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">גרעין תורני אור יהודה</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              קהילה תורנית מבוססת ערכים, המחזקת את הקשר לתורה, עם ישראל וארץ ישראל.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">קישורים מהירים</h3>
            <nav className="space-y-2 text-gray-300 text-sm" aria-label="קישורים מהירים">
              <Link to="/" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">דף הבית</Link>
              <Link to="/about" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">אודות</Link>
              <Link to="/parasha" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">פרשת השבוע</Link>
              <Link to="/news" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">עדכונים</Link>
              <Link to="/events" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">אירועים</Link>
              <Link to="/education" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">חינוך</Link>
              <Link to="/mechina" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">מכינת לביא</Link>
              <Link to="/sherut-leumi" className="block hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded">שירות לאומי</Link>
            </nav>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">צור קשר</h3>
            <ContactForm />
          </div>
        </div>

        {/* Contact Details Bar */}
        <div className="border-t border-gray-700 pt-6 pb-6">
          <div className="flex flex-wrap justify-center gap-6 text-gray-300 text-sm">
            <a href="tel:036124477" className="flex items-center gap-2 hover:text-green-400 transition">
              <span>📱</span>
              <span>03-612-4477</span>
            </a>
            <a href="mailto:garorye1@gmail.com" className="flex items-center gap-2 hover:text-green-400 transition">
              <span>📧</span>
              <span>garorye1@gmail.com</span>
            </a>
            <span className="flex items-center gap-2">
              <span>📍</span>
              <span>יוסף קארו 10, אור יהודה</span>
            </span>
            <a href="https://www.facebook.com/garinoryehuda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-400 transition">
              <span>📘</span>
              <span>Facebook</span>
            </a>
            <a href="https://www.youtube.com/@גרעיןתורניאוריהודה" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-400 transition">
              <span>▶️</span>
              <span>YouTube</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} גרעין תורני אור יהודה. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}
