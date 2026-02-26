import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Post, Event } from '../types'

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
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-blue-professional mb-6">
            גרעין תורני<br />
            <span className="text-green-community">אור יהודה</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            🕍 שליחות! לא רק בהתיישבות - גם בלב העיר
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/events" className="bg-blue-professional text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition shadow-lg">
              📅 האירועים הקרובים
            </Link>
            <a href="https://www.jgive.com/new/he/ils/charity-organizations/3080" target="_blank" rel="noopener noreferrer"
              className="bg-green-community text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg">
              💚 תרמו לגרעין
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ num: '17+', label: 'שנות פעילות' }, { num: '100+', label: 'משפחות בקהילה' }, { num: '30+', label: 'משפחות גרעין' }, { num: '13', label: 'פעילויות' }].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div className="text-4xl font-black text-blue-professional">{stat.num}</div>
              <div className="text-gray-600 font-semibold mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-blue-professional text-center mb-12">השליחות שלנו</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-blue-professional mb-4">קהילה חמה ומגובשת</h3>
              <p className="text-gray-600 leading-relaxed">משפחות צעירות עם ערכים משותפים, תמיכה הדדית ואווירה משפחתית</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-blue-professional mb-4">חינוך איכותי וערכי</h3>
              <p className="text-gray-600 leading-relaxed">7 גני ילדים, בית ספר, תלמוד תורה ומכינת לביא</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">✡️</div>
              <h3 className="text-2xl font-bold text-blue-professional mb-4">תורה חיה ומעשית</h3>
              <p className="text-gray-600 leading-relaxed">שיעורי תורה, שיח תורני, ופעילות יומיומית</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-blue-professional text-center mb-4">סרטון הגרעין</h2>
          <p className="text-xl text-center text-gray-600 mb-12">הכירו את הגרעין שלנו</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/6IuXlkywqzM"
                title="גרעין תורני אור יהודה"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-blue-professional text-center mb-12">אירועים קרובים</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-blue-professional text-white rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-white/20 p-6 text-center">
                  <div className="text-4xl font-black">{new Date(event.date).getDate()}</div>
                  <div className="text-sm opacity-90">{new Date(event.date).toLocaleDateString('he-IL', { month: 'long' })}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{event.time} | {event.location}</p>
                  <p className="opacity-80">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-blue-professional text-center mb-12">מהבלוג שלנו</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} to={`/parasha/${post.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">📝</div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-professional rounded-full text-sm font-bold mb-3">{post.category}</span>
                  <h3 className="text-xl font-bold text-blue-professional mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt || post.content?.substring(0, 100) + '...'}</p>
                  <div className="text-sm text-gray-500">{post.author} • {new Date(post.created_at).toLocaleDateString('he-IL')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
