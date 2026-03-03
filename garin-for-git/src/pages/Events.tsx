import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Event } from '../types'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true })
    if (data) setEvents(data)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">אירועים קרובים</h1>
        <p className="text-xl text-center text-gray-600 mb-12">כל מה שקורה בגרעין - עדכני תמיד</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-blue-professional text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="bg-white/20 p-6 text-center">
                <div className="text-5xl font-black">{new Date(event.date).getDate()}</div>
                <div className="opacity-90">{new Date(event.date).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="opacity-90 mb-2">🕐 {event.time}</p>
                <p className="opacity-90 mb-4">📍 {event.location}</p>
                <p className="opacity-80">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
