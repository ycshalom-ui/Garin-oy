import { useState } from 'react'
import HebrewCalendar from '../components/HebrewCalendar'
import EventWidgets from '../components/EventWidgets'

export default function Events() {
  const [view, setView] = useState<'widgets' | 'calendar'>('widgets')

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-blue-700 mb-4">
            📅 אירועים ולוח שנה
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            כל האירועים שלנו במקום אחד - תאריכים עבריים ולועזיים
          </p>

          {/* View toggle */}
          <div className="inline-flex bg-white rounded-xl shadow-lg p-2">
            <button
              onClick={() => setView('widgets')}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                view === 'widgets'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 אירועים קרובים
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📆 לוח שנה מלא
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-12">
          {view === 'widgets' ? (
            <EventWidgets />
          ) : (
            <HebrewCalendar />
          )}
        </div>

        {/* Info section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">🕯️</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">זמני שבת</h3>
            <p className="text-gray-600">
              זמני כניסת ויציאת שבת מעודכנים מדי שבוע
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">פרשת השבוע</h3>
            <p className="text-gray-600">
              פרשת השבוע הנוכחית מופיעה בלוח השנה
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">🗓️</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">תאריכים עבריים</h3>
            <p className="text-gray-600">
              כל התאריכים מוצגים גם בעברי וגם בלועזי
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🎨 מקרא צבעים
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-400 rounded"></div>
              <span className="font-semibold">אירוע גרעין</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded"></div>
              <span className="font-semibold">חג</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded"></div>
              <span className="font-semibold">יום הולדת</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded"></div>
              <span className="font-semibold">שיעור</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
