import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Contact } from '../types'

export default function ContactPage() {
  const [formData, setFormData] = useState<Contact>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<string>('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('שולח...')
    const { error } = await supabase.from('contacts').insert([formData])
    if (error) {
      setStatus('שגיאה בשליחה. אנא נסה שוב.')
    } else {
      setStatus('✅ ההודעה נשלחה בהצלחה!')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">צור קשר</h1>
        <p className="text-xl text-center text-gray-600 mb-12">נשמח לשמוע מכם!</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-blue-professional mb-6">פרטי קשר</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">📍</span>
                <div><h3 className="font-bold text-lg mb-1">כתובת</h3><p className="text-gray-600">יוסף קארו 10, אור יהודה</p></div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">📞</span>
                <div><h3 className="font-bold text-lg mb-1">טלפון</h3><p className="text-gray-600">03-612-4477</p></div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">✉️</span>
                <div><h3 className="font-bold text-lg mb-1">דוא"ל</h3><p className="text-gray-600">garorye1@gmail.com</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-blue-professional mb-6">שלחו לנו הודעה</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="שם מלא" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none" />
              <input type="email" placeholder="דוא״ל" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none" />
              <input type="tel" placeholder="טלפון" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none" />
              <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none">
                <option value="">בחר נושא...</option>
                <option>הצטרפות לגרעין</option>
                <option>פעילויות ואירועים</option>
                <option>שאלה כללית</option>
                <option>שיתוף פעולה</option>
              </select>
              <textarea placeholder="תוכן ההודעה" rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none resize-none"></textarea>
              <button type="submit" className="w-full bg-blue-professional text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">שלח הודעה</button>
              {status && <p className="text-center font-bold">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
