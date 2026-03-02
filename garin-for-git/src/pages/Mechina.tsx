import GoogleMap from '../components/GoogleMap'
import YouTubeEmbed from '../components/YouTubeEmbed'

export default function Mechina() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4 text-center">
          מכינת לביא – אור יהודה
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-center text-gray-600 mb-8 italic">
          "מכינה של אריות – זה מתחיל כאן."
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Opening Statement */}
          <section className="text-center">
            <p className="text-xl md:text-2xl font-bold text-green-700 mb-4">
              לוקחים אחריות. מגלים עוצמות. מתחברים לאמת.
            </p>
          </section>

          {/* Main Content */}
          <section>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>מכינת לביא – אור יהודה</strong> – מכינה תורנית חינוכית בלב גוש דן, פונה אליך: בחור שמחפש יותר.
              יותר עומק, יותר משמעות, יותר הכנה לחיים.
            </p>
            <p className="text-gray-700 leading-relaxed">
              במכינה תעבור תהליך אישי עוצמתי שיחבר אותך לזהות היהודית שלך מתוך בחירה חופשית ואמונה בדרך, עם המון אהבה.
              זהו מסע של בירור, בנייה וחיבור – לעצמך, לערכים שלך, ולריבונו של עולם.
            </p>
          </section>

          {/* YouTube Video */}
          <section>
            <YouTubeEmbed videoId="nLfXdpYhVIU" title="מכינת לביא - סרטון היכרות" />
          </section>

          {/* What Awaits You */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">מה מחכה לך אצלנו?</h2>
            
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>חיי תורה עם עומק ונשמה</strong> – לימוד אמיתי שנוגע בחיים, מלווה בשיחות, סדנאות ופתיחות לשאלות.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>הכנה מנטלית ופיזית לשירות משמעותי</strong> – כולל כושר קרבי, ניווטים, הישרדות, וסדנאות NLP יהודי לחיזוק פנימי.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>אווירה משפחתית</strong> – קהילה תומכת וחמה, עם צוות חינוכי חם ואוהב שמלווה מקרוב ונותן את הנשמה והלב.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>נתינה ועשייה למען אחרים</strong> – ההתנדבות היא חלק בלתי נפרד מהשגרה במגוון מסגרות:
                  <ul className="mt-2 mr-6 space-y-1">
                    <li>🛠 חילוץ והצלה (קורס מחלץ צבאי 02 בשיתוף המועצה)</li>
                    <li>👦 מועדונית לילדים בסיכון</li>
                    <li>❤️ גמ"ח קהילתי – נתינה מהלב בקהילה המקומית</li>
                  </ul>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>מיקום מרכזי בגוש דן</strong> – קל להגיע, קשה לעזוב.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl mt-1">•</span>
                <div>
                  <strong>תשוקה לגדול</strong> – כי אנחנו מאמינים שבתוכך שוכנת אישיות גדולה הרבה יותר ממה שאתה מכיר היום.
                </div>
              </li>
            </ul>
          </section>

          {/* Who Is It For */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">למי זה מתאים?</h2>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl">✓</span>
                <span>לצעירים שמרגישים שיש בהם יותר – ומחפשים מקום לעבור תהליך.</span>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl">✓</span>
                <span>לבחורים שמבינים שכדי לתת את המקסימום בצבא, צריך קודם כל להכיר את עצמך באמת.</span>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl">✓</span>
                <span>לאנשים עם חלומות – שרוצים כלים להגשים אותם.</span>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="text-green-700 text-xl">✓</span>
                <span>ולמי שרוצה לא רק לקחת – אלא גם לתת.</span>
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-4">פרטי התקשרות</h3>
            
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span><strong>מיקום:</strong> משה חייק 34, אור יהודה</span>
              </p>
              
              <div className="border-t border-green-200 pt-3 mt-3">
                <p className="font-semibold mb-2">📞 ליצירת קשר:</p>
                <ul className="space-y-2 mr-6">
                  <li>
                    <strong>ראש המכינה – הרב אופיר שוורצבוים:</strong>{' '}
                    <a href="tel:0544585986" className="text-green-700 hover:text-green-800 transition font-semibold">
                      054-4585986
                    </a>
                  </li>
                  <li>
                    <strong>מנהל – ניצן סגל:</strong>{' '}
                    <a href="tel:0506571118" className="text-green-700 hover:text-green-800 transition font-semibold">
                      050-6571118
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Google Maps */}
        <div className="mt-8">
          <GoogleMap 
            address="משה חייק 34, אור יהודה"
            title="מיקום מכינת לביא"
          />
        </div>
      </div>
    </div>
  )
}
