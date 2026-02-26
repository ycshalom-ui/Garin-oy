import { Link } from 'react-router-dom'
import { useState } from 'react'
import Search from './Search'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <nav className="bg-green-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <img src="/logo.png" alt="לוגו גרעין תורני" className="h-12 w-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <span>גרעין תורני אור יהודה</span>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link to="/" className="hover:text-blue-600 transition">דף הבית</Link>
            <Link to="/about" className="hover:text-blue-600 transition">אודות</Link>
            <Link to="/parasha" className="hover:text-blue-600 transition">פרשת השבוע</Link>
            <Link to="/news" className="hover:text-blue-600 transition">עדכונים</Link>
            <Link to="/education" className="hover:text-blue-600 transition">מוסדות חינוך</Link>
            <Link to="/mechina" className="hover:text-blue-600 transition">מכינת לביא</Link>
            <Link to="/sherut-leumi" className="hover:text-blue-600 transition">שירות לאומי</Link>
            <Link to="/events" className="hover:text-blue-600 transition">אירועים</Link>
            <Link to="/gallery" className="hover:text-blue-600 transition">גלריה</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">צור קשר</Link>
          </div>

          <div className="hidden md:block mr-4">
            <Search />
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
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">דף הבית</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">אודות</Link>
            <Link to="/parasha" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">פרשת השבוע</Link>
            <Link to="/news" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">עדכונים</Link>
            <Link to="/education" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">מוסדות חינוך</Link>
            <Link to="/mechina" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">מכינת לביא</Link>
            <Link to="/sherut-leumi" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">שירות לאומי</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">אירועים</Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">גלריה</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">צור קשר</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
