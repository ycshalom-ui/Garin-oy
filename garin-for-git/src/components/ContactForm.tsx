import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    honeypot: '' // Anti-spam field
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const validatePhone = (phone: string) => {
    // Basic Israeli phone validation
    const phoneRegex = /^0[2-9]\d{7,8}$/
    return phoneRegex.test(phone.replace(/[-\s]/g, ''))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check (anti-spam)
    if (formData.honeypot) {
      return
    }

    // Validation
    if (!formData.first_name || !formData.last_name) {
      setMessage({ type: 'error', text: 'נא למלא שם פרטי ושם משפחה' })
      return
    }

    if (!formData.phone && !formData.email) {
      setMessage({ type: 'error', text: 'נא למלא טלפון או אימייל' })
      return
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setMessage({ type: 'error', text: 'מספר טלפון לא תקין' })
      return
    }

    if (formData.email && !validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'כתובת אימייל לא תקינה' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || null,
          email: formData.email || null,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      setMessage({ type: 'success', text: 'תודה! פנייתך נקלטה בהצלחה ונחזור אליך בקרוב' })
      setFormData({ first_name: '', last_name: '', phone: '', email: '', honeypot: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setMessage({ type: 'error', text: 'אירעה שגיאה. נא לנסות שוב מאוחר יותר' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-green-400 mb-4">השאירו פרטים ונחזור אליכם</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold text-gray-300 mb-1">
              שם פרטי <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold text-gray-300 mb-1">
              שם משפחה <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-1">
              טלפון
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="050-1234567"
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
              אימייל
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-900/50 text-green-300 border border-green-700' 
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`} role="alert">
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="שלח טופס יצירת קשר"
        >
          {loading ? 'שולח...' : 'שלח'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          * שדות חובה. נדרש למלא טלפון או אימייל
        </p>
      </form>
    </div>
  )
}
