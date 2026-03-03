import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface CalendarEvent {
  id: string
  title: string
  gregorian_date: string
  hebrew_date: string
  event_type: string
  topic?: string
}

interface HebrewDate {
  hebrew: string
  hd: number
  hm: string
  hy: number
}

export default function HebrewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [hebrewDates, setHebrewDates] = useState<Map<string, HebrewDate>>(new Map())
  const [shabbatTimes, setShabbatTimes] = useState<any>(null)
  const [parasha, setParasha] = useState<string>('')

  useEffect(() => {
    loadEvents()
    loadHebrewDates()
    loadShabbatInfo()
  }, [currentDate])

  async function loadEvents() {
    // Load events for current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // TODO: Load from Supabase
    // const { data } = await supabase
    //   .from('events_extended')
    //   .select('*')
    //   .gte('gregorian_date', startOfMonth.toISOString().split('T')[0])
    //   .lte('gregorian_date', endOfMonth.toISOString().split('T')[0])
    
    // setEvents(data || [])
  }

  async function loadHebrewDates() {
    // Load Hebrew dates for current month from Hebcal API
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    
    try {
      const response = await fetch(
        `https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=1&g2h=1`
      )
      const data = await response.json()
      
      // Store Hebrew date info
      const dateMap = new Map<string, HebrewDate>()
      // TODO: Fetch for all days in month
      setHebrewDates(dateMap)
    } catch (error) {
      console.error('Error loading Hebrew dates:', error)
    }
  }

  async function loadShabbatInfo() {
    // Load Shabbat times and Parasha from Hebcal API
    try {
      const response = await fetch(
        `https://www.hebcal.com/shabbat?cfg=json&geo=city&city=Or%20Yehuda&M=on`
      )
      const data = await response.json()
      
      if (data.items) {
        const candleLighting = data.items.find((item: any) => item.category === 'candles')
        const havdalah = data.items.find((item: any) => item.category === 'havdalah')
        const parashaItem = data.items.find((item: any) => item.category === 'parashat')
        
        setShabbatTimes({
          candleLighting: candleLighting?.title || '',
          havdalah: havdalah?.title || ''
        })
        
        setParasha(parashaItem?.title || '')
      }
    } catch (error) {
      console.error('Error loading Shabbat info:', error)
    }
  }

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startDayOfWeek }
  }

  function goToPreviousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  function goToNextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  function getEventsForDay(day: number) {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    return events.filter(event => event.gregorian_date === dateStr)
  }

  function getEventColor(eventType: string) {
    switch (eventType) {
      case 'holiday': return 'bg-orange-500'
      case 'birthday': return 'bg-pink-500'
      case 'lesson': return 'bg-blue-500'
      case 'garin': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
  
  // Create calendar grid
  const calendarDays = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="min-h-24 bg-gray-50"></div>)
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    const isToday = 
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    
    calendarDays.push(
      <div
        key={day}
        className={`min-h-24 border border-gray-200 p-2 ${
          isToday ? 'bg-blue-50 border-blue-500 border-2' : 'bg-white'
        } hover:bg-gray-50 transition`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
            {day}
          </span>
          <span className="text-xs text-gray-500">
            {/* Hebrew date placeholder */}
            {/* {hebrewDates.get(`${day}`)?.hebrew || ''} */}
          </span>
        </div>
        
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map(event => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className={`block text-xs px-2 py-1 rounded text-white ${getEventColor(event.event_type)} hover:opacity-80 transition truncate`}
            >
              {event.title}
            </Link>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{dayEvents.length - 3} נוספים
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-700">{monthName}</h2>
          {shabbatTimes && parasha && (
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">📖 {parasha}</span>
              <span className="mx-2">•</span>
              <span>🕯️ {shabbatTimes.candleLighting}</span>
              <span className="mx-2">•</span>
              <span>✨ {shabbatTimes.havdalah}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            ◀
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            היום
          </button>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
          <div key={day} className={`text-center font-bold py-2 ${
            day === 'שבת' ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200">
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">אירוע גרעין</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm">חג</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-sm">יום הולדת</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">שיעור</span>
        </div>
      </div>
    </div>
  )
}
