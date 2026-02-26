import { Link } from 'react-router-dom'
import { useState } from 'react'
import Search from './Search'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50" role="navigation" aria-label="תפריט ראשי">
      {/* Skip to main content - accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-green-700 focus:rounded">
        דלג לתוכן הראשי
      </a>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo and Title */}
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1" 
            aria-label="דף הבית - גרעין תורני אור יהודה"
          >
            <img 
              src="/logo.jpg" 
              alt="לוגו גרעין תורני אור יהודה" 
              className="h-14 w-auto"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <span className="text-xl md:text-2xl font-bold">גרעין תורני אור יהודה</span>
          </Link>

          {/* Desktop Navigation with Search */}
          <div className="hidden lg:flex items-center gap-6" role="menubar">
            <Search />
            <Link to="/" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">בית</Link>
            <Link to="/about" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">אודות</Link>
            <Link to="/parasha" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">פרשת השבוע</Link>
            <Link to="/education" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">חינוך</Link>
            <Link to="/mechina" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">מכינת לביא</Link>
            <Link to="/sherut-leumi" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">שירות לאומי</Link>
            <Link to="/events" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">אירועים</Link>
            <Link to="/gallery" className="hover:text-blue-200 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" role="menuitem">גלריה</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 rounded-lg hover:bg-green-800 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={isOpen ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4 space-y-2" role="menu">
            <Link to="/" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>בית</Link>
            <Link to="/about" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>אודות</Link>
            <Link to="/parasha" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>פרשת השבוע</Link>
            <Link to="/news" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>עדכונים</Link>
            <Link to="/education" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>חינוך</Link>
            <Link to="/mechina" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>מכינת לביא</Link>
            <Link to="/sherut-leumi" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>שירות לאומי</Link>
            <Link to="/events" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>אירועים</Link>
            <Link to="/gallery" className="block py-2 hover:bg-green-800 rounded px-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300" role="menuitem" onClick={() => setIsOpen(false)}>גלריה</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
