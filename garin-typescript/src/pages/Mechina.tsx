export default function Mechina() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-blue-professional mb-6">
            🦁 מכינת לביא
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            מכינה קדם צבאית - תורה, מנהיגות וכושר גופני
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-blue-professional mb-6">על המכינה</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                מכינת לביא היא מכינה קדם צבאית ייחודית המשלבת לימוד תורה עם הכנה פיזית ומנטלית לשירות צבאי משמעותי.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                המכינה מכשירה צעירים ללקיחת אחריות, מנהיגות ושירות משמעותי בצה"ל תוך חיבור עמוק לערכי התורה והציונות הדתית.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-green-community mb-6">פרטי התקשרות</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-bold">הרב אופיר שוורצבוים</p>
                    <p className="text-gray-600">ראש המכינה</p>
                    <p className="text-blue-professional font-bold">054-458-5986</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-bold">ניצן סגל</p>
                    <p className="text-gray-600">רכז המכינה</p>
                    <p className="text-blue-professional font-bold">050-657-1118</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-bold">כתובת</p>
                    <p className="text-gray-600">משה חייק 34, אור יהודה</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <h2 className="text-3xl font-bold text-blue-professional text-center mb-12">מה לומדים במכינה?</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">💪</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">כושר גופני</h3>
              <p className="text-gray-600 text-center">
                אימונים מקצועיים להכנה פיזית מיטבית לצבא
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">📚</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">לימוד תורה</h3>
              <p className="text-gray-600 text-center">
                שיעורי תורה עמוקים בגמרא, הלכה ומחשבה יהודית
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">👥</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">מנהיגות</h3>
              <p className="text-gray-600 text-center">
                פיתוח מנהיגות, אחריות ויכולת קבלת החלטות
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">🏕️</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">פעילות שטח</h3>
              <p className="text-gray-600 text-center">
                מסעות, ניווט ופעילויות בשטח
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">🤝</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">אחווה</h3>
              <p className="text-gray-600 text-center">
                בניית קבוצה מגובשת וחברויות לכל החיים
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">💚</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">התנדבות</h3>
              <p className="text-gray-600 text-center">
                פעילות קהילתית וחסד בעיר
              </p>
            </div>
          </div>

          {/* Volunteer Work */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl mb-16">
            <h3 className="text-2xl font-bold text-blue-professional mb-6 text-center">פעילות התנדבותית</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🚨</div>
                <h4 className="font-bold text-blue-professional mb-2">חילוץ והצלה</h4>
                <p className="text-gray-600">התנדבות בארגוני חירום</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">👶</div>
                <h4 className="font-bold text-blue-professional mb-2">מועדונית</h4>
                <p className="text-gray-600">עבודה עם ילדים בסיכון</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">💝</div>
                <h4 className="font-bold text-blue-professional mb-2">גמ"ח</h4>
                <p className="text-gray-600">פעילות חסד בקהילה</p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <h3 className="text-2xl font-bold text-blue-professional mb-6 text-center">איפה אנחנו?</h3>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.6891234567!2d34.8490123!3d32.0234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzI0LjQiTiAzNMKwNTAnNTYuNCJF!5e0!3m2!1siw!2sil!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום מכינת לביא"
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mt-4">
              משה חייק 34, אור יהודה
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
