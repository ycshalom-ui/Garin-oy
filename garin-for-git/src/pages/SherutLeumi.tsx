import YouTubeEmbed from '../components/YouTubeEmbed'
import GoogleMap from '../components/GoogleMap'

export default function SherutLeumi() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">שירות לאומי</h1>
        
        <div className="mb-8">
          <YouTubeEmbed 
            videoId="fBsmt7kleAw"
            title="שירות לאומי - גרעין תורני אור יהודה"
          />
        </div>

        {/* Google Maps */}
        <GoogleMap 
          address="גרעין תורני אור יהודה"
          title="מיקום הגרעין"
        />

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-green-700 mb-4">שירות לאומי בגרעין</h2>
            <p className="text-gray-700 leading-relaxed">
              הגרעין התורני אור יהודה מציע מסגרת ייחודית לבנות שירות לאומי, המשלבת שליחות קהילתית
              עם התפתחות אישית וערכית.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-3">מה כולל השירות?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>עבודה במוסדות חינוך של הגרעין</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>פעילות קהילתית וחברתית</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>לימודי העשרה והכשרה מקצועית</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>חיים קהילתיים עשירים</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-3">למי מתאים?</h3>
            <p className="text-gray-700 leading-relaxed">
              לבנות בוגרות תיכון המעוניינות לשלב שירות משמעותי עם חיי קהילה תורניים,
              להשפיע על הדור הבא ולהתפתח אישית במסגרת תומכת וחמה.
            </p>
          </section>

          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">רוצות להצטרף?</h3>
            <p className="text-gray-700 mb-4">
              נשמח לשמוע מכן ולספר עוד על האפשרויות השונות לשירות לאומי בגרעין.
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:036124477" className="hover:text-green-700 transition">03-612-4477</a>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:garorye1@gmail.com" className="hover:text-green-700 transition">garorye1@gmail.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
