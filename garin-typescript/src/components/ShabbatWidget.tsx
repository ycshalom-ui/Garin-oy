import { useEffect, useState } from 'react'

interface ShabbatTimes {
  parasha: string
  candleLighting: string
  havdalah: string
  hebrewDate: string
  gregorianDate: string
}

export default function ShabbatWidget() {
  const [times, setTimes] = useState<ShabbatTimes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShabbatTimes()
  }, [])

  async function fetchShabbatTimes() {
    try {
      // Or Yehuda coordinates: 32.0237, 34.8587
      // Using Hebcal API for accurate times
      const response = await fetch(
        'https://www.hebcal.com/shabbat?cfg=json&geonameid=293703&M=on&lg=he'
      )
      const data = await response.json()

      const candleLighting = data.items.find((item: any) => item.category === 'candles')
      const havdalah = data.items.find((item: any) => item.category === 'havdalah')
      const parasha = data.items.find((item: any) => item.category === 'parashat')

      setTimes({
        parasha: parasha?.hebrew || 'פרשת השבוע',
        candleLighting: candleLighting?.date ? new Date(candleLighting.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '',
        havdalah: havdalah?.date ? new Date(havdalah.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '',
        hebrewDate: data.date || '',
        gregorianDate: new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      })
    } catch (error) {
      console.error('Error fetching Shabbat times:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600 font-bold">טוען זמני שבת...</p>
      </div>
    )
  }

  if (!times) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-black mb-2">🕯️ שבת קודש</h3>
        <p className="text-white/90 font-bold text-lg">{times.parasha}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🕯️</div>
          <h4 className="font-bold text-lg mb-2">כניסת שבת</h4>
          <p className="text-3xl font-black">{times.candleLighting}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⭐</div>
          <h4 className="font-bold text-lg mb-2">צאת שבת</h4>
          <p className="text-3xl font-black">{times.havdalah}</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white/90 font-bold mb-1">{times.hebrewDate}</p>
          <p className="text-white/70 text-sm">{times.gregorianDate}</p>
          <p className="text-white/70 text-sm mt-2">📍 אור יהודה</p>
        </div>
      </div>

      <div className="mt-6 text-center text-white/60 text-sm">
        מתעדכן אוטומטית מדי שבוע
      </div>
    </div>
  )
}
