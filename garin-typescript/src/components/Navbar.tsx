import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <nav className="bg-blue-professional text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            🕍 גרעין תורני אור יהודה
          </Link>

          <div className="hidden md:flex gap-8">
            <Link to="/" className="hover:text-green-community transition">דף הבית</Link>
            <Link to="/about" className="hover:text-green-community transition">אודות</Link>
            <Link to="/parasha" className="hover:text-green-community transition">פרשת השבוע</Link>
            <Link to="/news" className="hover:text-green-community transition">עדכונים</Link>
            <Link to="/education" className="hover:text-green-community transition">מוסדות חינוך</Link>
            <Link to="/mechina" className="hover:text-green-community transition">מכינת לביא</Link>
            <Link to="/sherut-leumi" className="hover:text-green-community transition">שירות לאומי</Link>
            <Link to="/events" className="hover:text-green-community transition">אירועים</Link>
            <Link to="/gallery" className="hover:text-green-community transition">גלריה</Link>
            <Link to="/contact" className="hover:text-green-community transition">צור קשר</Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">דף הבית</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">אודות</Link>
            <Link to="/parasha" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">פרשת השבוע</Link>
            <Link to="/news" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">עדכונים</Link>
            <Link to="/education" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">מוסדות חינוך</Link>
            <Link to="/mechina" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">מכינת לביא</Link>
            <Link to="/sherut-leumi" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">שירות לאומי</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">אירועים</Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">גלריה</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-green-community transition">צור קשר</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
