export default function SherutLeumi() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-blue-professional mb-6">
            👭 שירות לאומי
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            20 בנות משרתות למען הקהילה באור יהודה
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-blue-professional">20</div>
            <div className="text-gray-600 font-semibold mt-2">בנות שירות</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-blue-professional">6</div>
            <div className="text-gray-600 font-semibold mt-2">תחומי פעילות</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-blue-professional">100+</div>
            <div className="text-gray-600 font-semibold mt-2">ילדים שמלווים</div>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-professional text-center mb-12">הכירו את בנות השירות</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/fBsmt7kleAw"
                title="בנות שירות לאומי גרעין אור יהודה"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-professional text-center mb-12">תחומי השירות</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">📚</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">חינוך</h3>
              <p className="text-gray-600 text-center">
                ליווי וחינוך בגני הילדים ובבית הספר
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">💚</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">רווחה</h3>
              <p className="text-gray-600 text-center">
                עבודה עם משפחות במצוקה וסיוע בקהילה
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">✡️</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">זהות יהודית</h3>
              <p className="text-gray-600 text-center">
                חיזוק זהות יהודית דרך פעילות ולימוד
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">👴</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">קשישים</h3>
              <p className="text-gray-600 text-center">
                ליווי וטיפול בקשישים בעיר
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">⚽</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">בני עקיבא</h3>
              <p className="text-gray-600 text-center">
                הנחיית קבוצות בתנועת בני עקיבא
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4 text-center">🏘️</div>
              <h3 className="text-xl font-bold text-blue-professional mb-3 text-center">קהילה</h3>
              <p className="text-gray-600 text-center">
                פעילויות קהילתיות ואירועים
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-blue-professional mb-6">למה שירות לאומי בגרעין?</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                שירות לאומי בגרעין תורני אור יהודה מציע לבנות חוויה משמעותית של תרומה לקהילה, צמיחה אישית וחיבור לערכי התורה.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                הבנות משולבות במגוון תחומים - חינוך, רווחה, זהות יהודית ועוד, תוך ליווי צמוד והדרכה מקצועית.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                השירות כולל גם שיעורי תורה, פעילויות חברתיות ובניית קבוצה חמה ומגובשת.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-professional mb-6">למידע נוסף</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold">טלפון משרד הגרעין</p>
                    <p className="text-blue-professional font-bold">03-612-4477</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-bold">דוא"ל</p>
                    <p className="text-blue-professional font-bold">garorye1@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎥</span>
                  <div>
                    <p className="font-bold">ערוץ YouTube</p>
                    <a 
                      href="https://www.youtube.com/@גרעיןתורניאוריהודה" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-professional font-bold hover:underline"
                    >
                      לערוץ שלנו
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-blue-professional mb-6 text-center">איפה אנחנו?</h3>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.9!2d34.8551!3d32.0226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzIxLjQiTiAzNMKwNTEnMTguNCJF!5e0!3m2!1siw!2sil!4v2"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="משרדי הגרעין - יוסף קארו 10, אור יהודה"
            ></iframe>
          </div>
          <p className="text-center text-gray-600 mt-4 font-bold">
            📍 יוסף קארו 10, אור יהודה
          </p>
        </div>
      </section>
    </div>
  )
}
