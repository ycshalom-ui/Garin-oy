import GoogleMap from '../components/GoogleMap'

export default function Mechina() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">מכינת לביא</h1>

        {/* Google Maps */}
        <GoogleMap 
          address="מכינת לביא, אור יהודה"
          title="מיקום מכינת לביא"
        />

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-green-700 mb-4">על המכינה</h2>
            <p className="text-gray-700 leading-relaxed">
              מכינת לביא היא מכינה קדם-צבאית המשלבת לימודי תורה, התפתחות אישית והכנה לשירות צבאי משמעותי.
              המכינה פועלת במסגרת הגרעין התורני אור יהודה ומהווה שנת הכנה איכותית לקראת השירות הצבאי.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-3">תכני הלימודים</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">לימודי קודש</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• תנ"ך ומחשבת ישראל</li>
                  <li>• הלכה ומוסר</li>
                  <li>• פרשת השבוע</li>
                  <li>• חוגי עיון</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">הכנה צבאית</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• כושר גופני</li>
                  <li>• הדרכה והנהגה</li>
                  <li>• סדנאות מקצועיות</li>
                  <li>• פעילות שטח</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-3">חיי קהילה</h3>
            <p className="text-gray-700 leading-relaxed">
              החניכים חיים בקהילת הגרעין, משתתפים בפעילויות קהילתיות, מנחים בתנועות נוער
              ותורמים לחיי הקהילה בעיר.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-3">למי מתאים?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>בוגרי תיכון המעוניינים בשנת הכנה איכותית לצבא</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>בעלי מוטיבציה להוביל ולהשפיע</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-700 mt-1">✓</span>
                <span>מחפשים שילוב של תורה, ציונות ושירות משמעותי</span>
              </li>
            </ul>
          </section>

          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">מעוניינים להצטרף?</h3>
            <p className="text-gray-700 mb-4">
              נשמח לפגוש אתכם, לספר עוד על המכינה ולענות על כל שאלה.
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
