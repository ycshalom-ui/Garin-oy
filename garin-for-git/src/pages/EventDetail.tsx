import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface EventDetail {
  id: string
  title: string
  description: string
  gregorian_date: string
  gregorian_time?: string
  end_date?: string
  end_time?: string
  hebrew_date?: string
  event_type: string
  location?: string
  location_address?: string
  location_lat?: number
  location_lng?: number
  location_notes?: string
  topic?: string
  organizer?: string
  contact_phone?: string
  contact_email?: string
  image_url?: string
  max_participants?: number
  current_participants?: number
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadEvent()
    }
  }, [id])

  async function loadEvent() {
    try {
      const { data, error } = await supabase
        .from('events_extended')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error loading event:', error)
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
      case 'holiday': return 'from-orange-400 to-red-500'
      case 'birthday': return 'from-pink-400 to-purple-500'
      case 'lesson': return 'from-blue-400 to-indigo-500'
      case 'garin': return 'from-green-400 to-teal-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  function formatDate(dateStr: string, hebrewDate?: string) {
    const date = new Date(dateStr)
    const dayName = date.toLocaleDateString('he-IL', { weekday: 'long' })
    const formattedDate = date.toLocaleDateString('he-IL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    
    return {
      dayName,
      gregorian: formattedDate,
      hebrew: hebrewDate || ''
    }
  }

  function formatTime(timeStr?: string) {
    if (!timeStr) return ''
    return timeStr.substring(0, 5)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-xl text-gray-600">טוען אירוע...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">אירוע לא נמצא</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-700 font-semibold">
            חזרה לאירועים ←
          </Link>
        </div>
      </div>
    )
  }

  const dateInfo = formatDate(event.gregorian_date, event.hebrew_date)
  const startTime = formatTime(event.gregorian_time)
  const endTime = formatTime(event.end_time)

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/events" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
        >
          ← חזרה לאירועים
        </Link>

        {/* Event card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`h-48 bg-gradient-to-br ${getEventColor(event.event_type)} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 text-center text-white">
              <div className="text-8xl mb-4">{getEventIcon(event.event_type)}</div>
              <h1 className="text-4xl font-bold drop-shadow-lg">{event.title}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Date and Time section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Date */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📅</span>
                  <h3 className="text-xl font-bold text-blue-700">תאריך</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{dateInfo.dayName}</p>
                  <p className="text-2xl font-bold text-blue-900">{dateInfo.gregorian}</p>
                  {dateInfo.hebrew && (
                    <p className="text-lg text-blue-700">{dateInfo.hebrew}</p>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🕐</span>
                  <h3 className="text-xl font-bold text-green-700">שעה</h3>
                </div>
                <div className="space-y-2">
                  {startTime ? (
                    <>
                      <p className="text-2xl font-bold text-green-900">
                        {startTime}
                        {endTime && ` - ${endTime}`}
                      </p>
                      {event.end_date && event.end_date !== event.gregorian_date && (
                        <p className="text-sm text-green-700">
                          עד: {formatDate(event.end_date).gregorian}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">השעה תעודכן בהמשך</p>
                  )}
                </div>
              </div>
            </div>

            {/* Topic */}
            {event.topic && (
              <div className="mb-6">
                <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold">
                  🎯 נושא: {event.topic}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 תיאור</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="mb-8 bg-orange-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📍</span>
                  <h3 className="text-2xl font-bold text-orange-700">מיקום</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-semibold text-gray-800">{event.location}</p>
                  {event.location_address && (
                    <p className="text-lg text-gray-700 flex items-start gap-2">
                      <span>🏠</span>
                      <span>{event.location_address}</span>
                    </p>
                  )}
                  {event.location_notes && (
                    <p className="text-gray-600 flex items-start gap-2">
                      <span>💡</span>
                      <span>{event.location_notes}</span>
                    </p>
                  )}
                  {/* Google Maps link */}
                  {event.location_address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                    >
                      <span>🗺️</span>
                      <span>פתח ב-Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Organizer and Contact */}
            {(event.organizer || event.contact_phone || event.contact_email) && (
              <div className="mb-8 bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👤</span>
                  <h3 className="text-2xl font-bold text-blue-700">יצירת קשר</h3>
                </div>
                <div className="space-y-3">
                  {event.organizer && (
                    <p className="text-lg">
                      <span className="font-semibold">מארגן:</span> {event.organizer}
                    </p>
                  )}
                  {event.contact_phone && (
                    <p className="text-lg flex items-center gap-2">
                      <span>📞</span>
                      <a href={`tel:${event.contact_phone}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                        {event.contact_phone}
                      </a>
                    </p>
                  )}
                  {event.contact_email && (
                    <p className="text-lg flex items-center gap-2">
                      <span>📧</span>
                      <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                        {event.contact_email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Participants */}
            {event.max_participants && (
              <div className="mb-8 bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👥</span>
                  <h3 className="text-2xl font-bold text-green-700">משתתפים</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white rounded-lg overflow-hidden">
                    <div 
                      className="h-8 bg-green-500 transition-all duration-500"
                      style={{ width: `${((event.current_participants || 0) / event.max_participants) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {event.current_participants || 0} / {event.max_participants}
                  </div>
                </div>
                {event.current_participants && event.current_participants >= event.max_participants && (
                  <p className="mt-3 text-red-600 font-semibold">האירוע מלא</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center pt-6 border-t-2">
              <Link
                to="/events"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                חזרה לאירועים
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description || '',
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('הקישור הועתק!')
                  }
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                שתף 🔗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
