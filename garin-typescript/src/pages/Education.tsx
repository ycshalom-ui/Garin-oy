export default function Education() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-blue-professional mb-6">
            🏫 מוסדות החינוך שלנו
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            חינוך איכותי וערכי מהגן ועד בית הספר
          </p>
        </div>
      </section>

      {/* Kindergartens Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-blue-professional mb-4">🌱 גני הילדים שלנו</h2>
            <p className="text-xl text-gray-600">7 גני ילדים תורניים באור יהודה</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3">רב גן בכל גן</h3>
              <p className="text-gray-600">לימוד תורה ופרשת שבוע מדי יום</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3">צוות מסור</h3>
              <p className="text-gray-600">גננות ומטפלות מנוסות ואוהבות</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3">פעילויות משותפות</h3>
              <p className="text-gray-600">חגיגות, טיולים ומופעים משותפים</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="text-5xl mb-4">☀️</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3">קייטנות בקיץ</h3>
              <p className="text-gray-600">קייטנות מגניבות בחופשת הקיץ</p>
            </div>
          </div>

          {/* Hours and Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-professional mb-6">שעות הפעילות</h3>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold">ימים א'-ה':</span>
                  <span className="text-blue-professional font-bold">7:30 - 16:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">יום ו':</span>
                  <span className="text-blue-professional font-bold">7:30 - 13:00</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-professional mb-6">למידע והרשמה</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold">טלפון:</p>
                    <p className="text-blue-professional font-bold">03-612-4477</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-bold">דוא"ל:</p>
                    <p className="text-blue-professional font-bold">garorye1@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-blue-professional mb-6 text-center">איפה הגנים?</h3>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.6891234567!2d34.8490123!3d32.0234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzI0LjQiTiAzNMKwNTAnNTYuNCJF!5e0!3m2!1siw!2sil!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום גני הילדים"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* School Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-blue-professional mb-4">🏫 בית ספר סעדיה גאון</h2>
            <p className="text-xl text-gray-600">שיתוף פעולה עם בית הספר המקומי</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-blue-professional mb-6">שיתוף הפעולה שלנו</h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                הגרעין משתף פעולה עם בית הספר סעדיה גאון במגוון תחומים לחיזוק הזהות היהודית והחינוך הערכי.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                התלמידים נהנים מתכנית לימודים עשירה המשלבת לימודי קודש איכותיים עם חינוך חברתי וערכי.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-community mb-6">תחומי שיתוף הפעולה</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h4 className="font-bold text-lg">תלמוד תורה</h4>
                    <p className="text-gray-600">שיעורי תורה נוספים לתלמידים</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✡️</span>
                  <div>
                    <h4 className="font-bold text-lg">זהות יהודית</h4>
                    <p className="text-gray-600">פעילויות לחיזוק הזהות היהודית</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <h4 className="font-bold text-lg">אירועים משותפים</h4>
                    <p className="text-gray-600">חגיגות וטקסים במהלך השנה</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School Contact */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-professional mb-6">פרטי בית הספר</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-bold">כתובת:</p>
                    <p className="text-gray-700">משה הדדי 9, אור יהודה</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold">טלפון:</p>
                    <p className="text-blue-professional font-bold">03-533-1629</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-professional mb-6">תלמוד תורה</h3>
              <p className="text-gray-700 mb-4">
                תלמוד תורה לתלמידי בית הספר - שיעורים אחרי שעות הלימודים בגמרא, משנה ותנ"ך.
              </p>
              <p className="text-gray-700">
                המורים המסורים שלנו מעניקים לתלמידים חוויה של לימוד תורה מהנה ומעשירה.
              </p>
            </div>
          </div>

          {/* School Map */}
          <div>
            <h3 className="text-2xl font-bold text-blue-professional mb-6 text-center">מיקום בית הספר</h3>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.6891234567!2d34.8490123!3d32.0234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzI0LjQiTiAzNMKwNTAnNTYuNCJF!5e0!3m2!1siw!2sil!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום בית הספר סעדיה גאון"
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mt-4">
              משה הדדי 9, אור יהודה
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
