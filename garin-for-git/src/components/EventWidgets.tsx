import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Event {
  id: string
  title: string
  description: string
  gregorian_date: string
  gregorian_time: string
  hebrew_date: string
  event_type: string
  location: string
  topic: string
  image_url: string
}

export default function EventWidgets() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUpcomingEvents()
  }, [])

  async function loadUpcomingEvents() {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('events_extended')
        .select('*')
        .gte('gregorian_date', today)
        .eq('is_published', true)
        .order('gregorian_date', { ascending: true })
        .limit(5)
      
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  function getEventIcon(eventType: string) {
    switch (eventType) {
      case 'holiday': return '🎭'
      case 'birthday': return '🎂'
      case 'lesson': return '📚'
      case 'garin': return '📅'
      default: return '📌'
    }
  }

  function getEventColor(eventType: string) {
    switch (eventType) {
      case 'holiday': return 'from-orange-400 to-red-400'
      case 'birthday': return 'from-pink-400 to-purple-400'
      case 'lesson': return 'from-blue-400 to-indigo-400'
      case 'garin': return 'from-green-400 to-teal-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  function formatDate(dateStr: string, hebrewDate?: string) {
    const date = new Date(dateStr)
    const dayName = date.toLocaleDateString('he-IL', { weekday: 'long' })
    const formattedDate = date.toLocaleDateString('he-IL')
    
    return {
      dayName,
      gregorian: formattedDate,
      hebrew: hebrewDate || ''
    }
  }

  function formatTime(timeStr: string) {
    if (!timeStr) return ''
    return timeStr.substring(0, 5) // HH:MM
  }

  function getDaysUntil(dateStr: string) {
    const today = new Date()
    const eventDate = new Date(dateStr)
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'היום'
    if (diffDays === 1) return 'מחר'
    if (diffDays < 7) return `בעוד ${diffDays} ימים`
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">טוען אירועים...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">אין אירועים קרובים</h3>
        <p className="text-gray-500">חזרו בקרוב לעדכונים!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🎯 אירועים קרובים
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {events.map(event => {
          const dateInfo = formatDate(event.gregorian_date, event.hebrew_date)
          const daysUntil = getDaysUntil(event.gregorian_date)
          
          return (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Days until badge */}
              {daysUntil && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  {daysUntil}
                </div>
              )}
              
              {/* Event type icon/header */}
              <div className={`h-32 bg-gradient-to-br ${getEventColor(event.event_type)} flex items-center justify-center text-6xl relative`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative z-10">{getEventIcon(event.event_type)}</span>
              </div>

              {/* Event info */}
              <div className="p-4">
                {/* Date */}
                <div className="text-center mb-3">
                  <div className="text-sm font-semibold text-gray-600">{dateInfo.dayName}</div>
                  <div className="text-lg font-bold text-blue-700">{dateInfo.gregorian}</div>
                  {dateInfo.hebrew && (
                    <div className="text-xs text-gray-500">{dateInfo.hebrew}</div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2 line-clamp-2 min-h-[3.5rem]">
                  {event.title}
                </h3>

                {/* Time */}
                {event.gregorian_time && (
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                    <span>🕐</span>
                    <span>{formatTime(event.gregorian_time)}</span>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                    <span>📍</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                {/* Topic */}
                {event.topic && (
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {event.topic}
                    </span>
                  </div>
                )}

                {/* View details button */}
                <div className="mt-4 text-center">
                  <span className="text-blue-600 text-sm font-semibold group-hover:text-blue-700">
                    לפרטים נוספים ←
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* View all events link */}
      <div className="text-center mt-8">
        <Link
          to="/events"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl"
        >
          צפה בכל האירועים 📅
        </Link>
      </div>
    </div>
  )
}
