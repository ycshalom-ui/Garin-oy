import { Link } from 'react-router-dom'
import { useState } from 'react'
import Search from './Search'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" role="navigation" aria-label="תפריט ראשי">
      {/* Skip to main content - accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded">
        דלג לתוכן הראשי
      </a>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-2 py-1" 
            aria-label="דף הבית - גרעין תורני אור יהודה"
          >
            <img 
              src="/logo.jpg" 
              alt="לוגו גרעין תורני אור יהודה" 
              className="h-16 w-auto"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </Link>

          {/* Desktop Navigation with Search */}
          <div className="hidden lg:flex items-center gap-6" role="menubar">
            <Search />
            <Link to="/" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" role="menuitem">בית</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" role="menuitem">אודות</Link>
            <Link to="/news" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1 whitespace-nowrap" role="menuitem">עדכונים ופרשת השבוע</Link>
            <Link to="/education" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" role="menuitem">חינוך</Link>
            <Link to="/mechina" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1 whitespace-nowrap" role="menuitem">מכינת לביא</Link>
            <Link to="/sherut-leumi" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1 whitespace-nowrap" role="menuitem">שירות לאומי</Link>
            <Link to="/events" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" role="menuitem">אירועים</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" role="menuitem">גלריה</Link>
          </div>

          {/* Mobile Menu Button - Improved with label */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-3 rounded-lg bg-green-700 hover:bg-green-800 transition focus:outline-none focus:ring-2 focus:ring-green-500 text-white shadow-lg"
            aria-label={isOpen ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span className="text-sm font-bold">{isOpen ? 'סגור' : 'תפריט'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Side Drawer */}
          <div 
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
            role="menu"
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="לוגו" 
                  className="h-12 w-auto rounded-lg shadow"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="text-white">
                  <h2 className="font-bold text-lg">תפריט ראשי</h2>
                  <p className="text-sm text-green-100">גרעין תורני אור יהודה</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                aria-label="סגור תפריט"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              <Link 
                to="/" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">🏠</span>
                <span>בית</span>
              </Link>

              <Link 
                to="/about" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">ℹ️</span>
                <span>אודות</span>
              </Link>

              <Link 
                to="/news" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">📰</span>
                <span>עדכונים ופרשת השבוע</span>
              </Link>

              <Link 
                to="/education" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">🎓</span>
                <span>חינוך</span>
              </Link>

              <Link 
                to="/mechina" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">📚</span>
                <span>מכינת לביא</span>
              </Link>

              <Link 
                to="/sherut-leumi" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">🎖️</span>
                <span>שירות לאומי</span>
              </Link>

              <Link 
                to="/events" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">📅</span>
                <span>אירועים</span>
              </Link>

              <Link 
                to="/gallery" 
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition font-semibold"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">🖼️</span>
                <span>גלריה</span>
              </Link>
            </div>

            {/* Drawer Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                © 2026 גרעין תורני אור יהודה
              </p>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
