import { useState } from 'react'

export default function JoinForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      // Send to Supabase leads table
      const { error: supabaseError } = await (await import('../lib/supabase')).supabase
        .from('leads')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || 'מעוניין להצטרף לגרעין'
        }])

      if (supabaseError) {
        throw supabaseError
      }

      // Send email via Web3Forms
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_key: '67890abc-1234-5678-90ab-cdef12345678', // Replace with your actual key
            from_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            message: formData.message || 'מעוניין להצטרף לגרעין',
            to_email: 'garorye1@gmail.com',
            subject: `בקשת הצטרפות חדשה - ${formData.firstName} ${formData.lastName}`
          })
        })
      } catch {
        // Email failed but lead saved - still success
      }

      setStatus('success')
      setMessage('✅ הפרטים נשלחו בהצלחה! נחזור אליכם בקרוב.')
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
      setMessage('❌ שגיאה בשליחת הפרטים. אנא נסו שנית או צרו קשר בטלפון.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="שם פרטי *"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />

        <input
          type="text"
          placeholder="שם משפחה *"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
          placeholder="טלפון *"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none"
        />
      </div>

      <textarea
        placeholder="הודעה (אופציונלי)"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        rows={4}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-700 focus:outline-none resize-none"
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {status === 'loading' ? '⏳ שולח...' : '🚀 שלח פרטים'}
      </button>

      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold animate-fade-in ${
          status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="text-center text-sm text-gray-600 mt-4">
        <p>📞 או צרו קשר ישירות: <a href="tel:036124477" className="text-green-700 font-semibold hover:underline">03-612-4477</a></p>
      </div>
    </form>
  )
}
