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

        <div className="grid md:grid-cols-2 gap-8">
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
      </div>
    </div>
  )
}
