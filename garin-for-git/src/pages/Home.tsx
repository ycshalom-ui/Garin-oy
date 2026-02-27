import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Post, Event } from '../types'
import ShabbatWidget from '../components/ShabbatWidget'
import UpcomingEvents from '../components/UpcomingEvents'
import YouTubeEmbed from '../components/YouTubeEmbed'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
    
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3)
    
    if (postsData) setPosts(postsData)
    if (eventsData) setEvents(eventsData)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Cleaner, Smaller */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-green-700 mb-4">
            גרעין תורני אור יהודה
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            שליחות! לא רק בהתיישבות - גם בלב העיר
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/events" 
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="צפה באירועים הקרובים"
            >
              📅 האירועים הקרובים
            </Link>
            <a 
              href="https://www.jgive.com/new/he/ils/charity-organizations/3080" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="תרום לגרעין"
            >
              💝 תרמו לגרעין
            </a>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          
          {/* Main Content */}
          <div className="space-y-12">
            
            {/* Mission */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">המשימה שלנו</h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  גרעין תורני אור יהודה הוא קהילה חמה המבוססת על ערכי תורה וציונות דתית.
                  אנו פועלים לחיזוק הקשר בין תורה, עם ישראל וארץ ישראל בלב השרון.
                </p>
                <p>
                  הגרעין מפעיל מוסדות חינוך, מכינה קדם-צבאית, שירות לאומי ופעילויות קהילתיות מגוונות.
                </p>
              </div>
            </section>

            {/* Video */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">הכירו אותנו</h2>
              <YouTubeEmbed 
                videoId="79Aiv0NeWFA"
                title="הכירו את גרעין תורני אור יהודה"
              />
            </section>

            {/* Recent Posts */}
            {posts.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">פרשת השבוע</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {posts.map(post => (
                    <Link
                      key={post.id}
                      to={`/parasha/${post.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {post.image_url && (
                        <div className="h-40 overflow-hidden">
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mb-2">
                          {post.category}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link 
                    to="/parasha" 
                    className="inline-block text-green-700 font-semibold hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2"
                  >
                    צפה בכל הפרשות ←
                  </Link>
                </div>
              </section>
            )}

            {/* Stats */}
            <section className="bg-gradient-to-br from-green-700 to-blue-700 rounded-lg shadow-xl p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">הגרעין במספרים</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100+</div>
                  <div className="text-white/90">משפחות בקהילה</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">30</div>
                  <div className="text-white/90">משפחות בגרעין</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">17</div>
                  <div className="text-white/90">שנות פעילות</div>
                </div>
              </div>
            </section>

            {/* Upcoming Events */}
            {events.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">אירועים קרובים</h2>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 rounded-lg p-3 text-center min-w-[60px]">
                          <div className="text-2xl font-bold text-green-700">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-green-600">
                            {new Date(event.date).toLocaleDateString('he-IL', { month: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          {event.location && (
                            <p className="text-gray-500 text-sm">📍 {event.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link 
                    to="/events" 
                    className="inline-block text-green-700 font-semibold hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2"
                  >
                    כל האירועים ←
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Shabbat Widget (Desktop only) */}
          <aside className="hidden lg:block" aria-label="מידע נוסף">
            <div className="sticky top-24 space-y-6">
              <ShabbatWidget />
              
              {/* Upcoming Events Widget */}
              <UpcomingEvents />
              
              {/* Quick Contact */}
              <div className="bg-white rounded-lg shadow-md p-4 border-2 border-green-700">
                <h3 className="font-bold text-lg text-green-700 mb-3">צור קשר מהיר</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <a href="tel:036124477" className="hover:text-green-700 transition">03-612-4477</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📧</span>
                    <a href="mailto:garorye1@gmail.com" className="hover:text-green-700 transition break-all">
                      garorye1@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Shabbat Widget */}
          <div className="lg:hidden">
            <ShabbatWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
