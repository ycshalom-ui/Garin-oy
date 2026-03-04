import JoinForm from '../components/JoinForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-green-700 text-center mb-4">הצטרפו אלינו!</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          מעוניינים להצטרף לגרעין או לקבל מידע נוסף? השאירו פרטים ונחזור אליכם בהקדם
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6">פרטי קשר</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">📍</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">כתובת</h3>
                  <p className="text-gray-600">יוסף קארו 10, אור יהודה</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">📞</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">טלפון</h3>
                  <p className="text-gray-600">
                    <a href="tel:036124477" className="hover:text-green-700 transition">
                      03-612-4477
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">✉️</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">דוא"ל</h3>
                  <p className="text-gray-600">
                    <a href="mailto:garorye1@gmail.com" className="hover:text-green-700 transition">
                      garorye1@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">⏰</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">שעות פעילות</h3>
                  <p className="text-gray-600">ראשון-חמישי: 9:00-17:00</p>
                  <p className="text-gray-600">שישי: 9:00-13:00</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-green-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-green-700">קישורים מהירים</h3>
              <div className="space-y-2">
                <a href="/events" className="block text-gray-700 hover:text-green-700 transition">
                  📅 האירועים הקרובים
                </a>
                <a href="/gallery" className="block text-gray-700 hover:text-green-700 transition">
                  🖼️ גלריית תמונות
                </a>
                <a href="/news" className="block text-gray-700 hover:text-green-700 transition">
                  📰 עדכונים ופרשת השבוע
                </a>
              </div>
            </div>
          </div>

          {/* Join Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-green-700 mb-6">השאירו פרטים</h2>
            <JoinForm />
          </div>
        </div>
      </div>
    </div>
  )
}
