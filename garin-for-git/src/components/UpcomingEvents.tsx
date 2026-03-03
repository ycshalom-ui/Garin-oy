import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Event } from '../types'

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3)

      if (data) setEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-700">
        <h3 className="font-bold text-lg text-blue-700 mb-3">אירועים קרובים</h3>
        <p className="text-gray-600 text-sm">טוען...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-700">
        <h3 className="font-bold text-lg text-blue-700 mb-3">אירועים קרובים</h3>
        <p className="text-gray-600 text-sm">אין אירועים קרובים כרגע</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-700">
      <h3 className="font-bold text-lg text-blue-700 mb-4">אירועים קרובים</h3>
      
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
            <div className="flex gap-3">
              {/* Date Badge */}
              <div className="bg-blue-100 rounded-lg p-2 text-center min-w-[50px] h-fit">
                <div className="text-xl font-bold text-blue-700">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-[10px] text-blue-600 font-semibold">
                  {new Date(event.date).toLocaleDateString('he-IL', { month: 'short' })}
                </div>
              </div>
              
              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                  {event.title}
                </h4>
                {event.time && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <span>🕐</span>
                    <span>{event.time}</span>
                  </p>
                )}
                {event.location && (
                  <p className="text-xs text-gray-600 flex items-center gap-1 line-clamp-1">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        to="/events" 
        className="block mt-4 text-center text-blue-700 font-semibold text-sm hover:text-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
      >
        כל האירועים ←
      </Link>
    </div>
  )
}
