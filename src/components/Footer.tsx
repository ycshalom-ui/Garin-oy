import { Link } from 'react-router-dom'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[2fr,1fr,1fr] gap-8 mb-8">
          
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">צור קשר</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-400" aria-hidden="true">📧</span>
                <a 
                  href="mailto:garorye1@gmail.com" 
                  className="hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
                  aria-label="שלח אימייל"
                >
                  garorye1@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400" aria-hidden="true">📱</span>
                <a 
                  href="tel:036124477" 
                  className="hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
                  aria-label="התקשר"
                  dir="ltr"
                >
                  03-612-4477
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400" aria-hidden="true">📍</span>
                <span>יוסף קארו 10, אור יהודה</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a 
                  href="https://www.facebook.com/garinoryehuda" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-1"
                  aria-label="עמוד הפייסבוק שלנו"
                >
                  Facebook
                </a>
                <a 
                  href="https://www.youtube.com/@גרעיןתורניאוריהודה" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-1"
                  aria-label="ערוץ היוטיוב שלנו"
                >
                  YouTube
                </a>
              </div>
            </div>
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
