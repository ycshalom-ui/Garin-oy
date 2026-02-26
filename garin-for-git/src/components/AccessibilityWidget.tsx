import { useState } from 'react'

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const resetFontSize = () => {
    setFontSize(100)
    document.documentElement.style.fontSize = '100%'
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const toggleUnderlineLinks = () => {
    setUnderlineLinks(!underlineLinks)
    if (!underlineLinks) {
      document.documentElement.classList.add('underline-links')
    } else {
      document.documentElement.classList.remove('underline-links')
    }
  }

  const resetAll = () => {
    setFontSize(100)
    setHighContrast(false)
    setUnderlineLinks(false)
    document.documentElement.style.fontSize = '100%'
    document.documentElement.classList.remove('high-contrast', 'underline-links')
  }

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg transition focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={isOpen ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות'}
        aria-expanded={isOpen}
        title="נגישות"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
        </svg>
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed left-4 bottom-20 z-50 bg-white rounded-lg shadow-2xl p-6 w-80 border-2 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">נגישות</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="סגור"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size Controls */}
            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                גודל טקסט: {fontSize}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="הקטן טקסט"
                >
                  A-
                </button>
                <button
                  onClick={resetFontSize}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="אפס גודל טקסט"
                >
                  A
                </button>
                <button
                  onClick={increaseFontSize}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="הגדל טקסט"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={toggleHighContrast}
                className={`w-full text-right py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  highContrast
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                aria-label="ניגודיות גבוהה"
                aria-pressed={highContrast}
              >
                <span className="font-semibold">🎨 ניגודיות גבוהה</span>
              </button>
            </div>

            {/* Underline Links */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={toggleUnderlineLinks}
                className={`w-full text-right py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  underlineLinks
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                aria-label="הדגש קישורים"
                aria-pressed={underlineLinks}
              >
                <span className="font-semibold">🔗 הדגש קישורים</span>
              </button>
            </div>

            {/* Reset All */}
            <button
              onClick={resetAll}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="אפס הכל"
            >
              ↺ אפס הכל
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            תואם לת״י 5568 - חוק הנגישות הישראלי
          </p>
        </div>
      )}
    </>
  )
}
