export default function About() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-8">אודות הגרעין</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-blue-professional mb-4">מי אנחנו?</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            גרעין תורני אור יהודה פועל כבר למעלה מ-17 שנים בעיר, ומהווה מרכז קהילתי חם ומגובש 
            למשפחות צעירות שבוחרות לחיות חיים עם משמעות.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-green-community mb-4">החזון שלנו</h3>
            <p className="text-gray-700">
              להקים קהילה תורנית חמה בלב העיר, שמשלבת בין לימוד תורה עמוק לפעילות קהילתית מגוונת.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-green-community mb-4">הערכים שלנו</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ תורה ולימוד</li>
              <li>✅ חינוך איכותי</li>
              <li>✅ חסד וקהילה</li>
              <li>✅ ציונות ואהבת ישראל</li>
            </ul>
          </div>
        </div>

        {/* Office Details and Location */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">משרדי הגרעין</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-4">פרטי התקשרות</h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg">יוסף קארו 10, אור יהודה</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <a href="tel:036124477" className="hover:text-green-700 transition text-lg">03-612-4477</a>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:garorye1@gmail.com" className="hover:text-green-700 transition break-all text-lg">
                    garorye1@gmail.com
                  </a>
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">שעות פעילות</h3>
                <div className="space-y-2 text-gray-700">
                  <p>📅 ראשון - חמישי: 9:00 - 17:00</p>
                  <p>📅 שישי: 9:00 - 13:00</p>
                  <p className="text-sm text-gray-600 mt-3">💡 מומלץ לתאם פגישה מראש</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">מיקום</h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.036!2d34.862!3d32.026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzMzLjYiTiAzNMKwNTEnNDMuMiJF!5e0!3m2!1siw!2sil!4v1234567890"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מיקום משרדי הגרעין - יוסף קארו 10, אור יהודה"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
