import { useEffect, useState } from 'react'

interface ShabbatTimes {
  parasha: string
  candleLighting: string
  havdalah: string
  hebrewDate: string
}

export default function ShabbatWidget() {
  const [times, setTimes] = useState<ShabbatTimes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShabbatTimes()
  }, [])

  async function fetchShabbatTimes() {
    try {
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
        hebrewDate: data.date || ''
      })
    } catch (error) {
      console.error('Error fetching Shabbat times:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center border-2 border-green-700" role="status" aria-live="polite">
        <p className="text-gray-600 text-sm" aria-label="טוען זמני שבת">טוען...</p>
      </div>
    )
  }

  if (!times) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-green-700" role="region" aria-label="זמני שבת">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-green-700 mb-1">שבת קודש</h3>
        <p className="text-sm text-gray-700 font-semibold">{times.parasha}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">כניסה:</span>
          <span className="font-bold text-green-700">{times.candleLighting}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">יציאה:</span>
          <span className="font-bold text-green-700">{times.havdalah}</span>
        </div>
      </div>

      {times.hebrewDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">{times.hebrewDate}</p>
        </div>
      )}
    </div>
  )
}
