import { useState } from 'react'

export default function ContactFormWithEmail() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // Send email using Web3Forms (free service)
      const emailResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '67890abc-1234-5678-90ab-cdef12345678', // Replace with your actual key from web3forms.com
          from_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          to_email: 'garorye1@gmail.com',
          subject: `הודעה חדשה מאתר הגרעין - ${formData.name}`
        })
      })

      const emailResult = await emailResponse.json()

      if (emailResult.success) {
        setStatus('success')
        setMessage('✅ ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        throw new Error('Email sending failed')
      }
    } catch (error) {
      console.error('Error sending contact form:', error)
      setStatus('error')
      setMessage('❌ שגיאה בשליחת ההודעה. אנא נסה שנית או צור קשר בטלפון.')
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-blue-professional mb-4">שלח לנו הודעה</h3>
      <p className="text-gray-600 mb-6">נשמח לשמוע ממך! מלא את הפרטים ונחזור אליך בהקדם.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="שם מלא *"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />

        <input
          type="email"
          placeholder="אימייל *"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />

        <input
          type="tel"
          placeholder="טלפון"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />

        <textarea
          placeholder="ההודעה שלך *"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none resize-none"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'שולח...' : '📧 שלח הודעה'}
        </button>

        {message && (
          <div className={`p-4 rounded-xl text-center font-semibold ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-gray-700">
        <p className="font-bold mb-2">📞 דרכי התקשרות נוספות:</p>
        <p>• טלפון: 03-612-4477</p>
        <p>• אימייל: garorye1@gmail.com</p>
        <p>• כתובת: יוסף קארו 10, אור יהודה</p>
      </div>
    </div>
  )
}
