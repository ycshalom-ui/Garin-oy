import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../types'

export default function Torah() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<string>('הכל')

  useEffect(() => {
    loadPosts()
  }, [filter])

  async function loadPosts() {
    let query = supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false })
    if (filter !== 'הכל') query = query.eq('category', filter)
    const { data } = await query
    if (data) setPosts(data)
  }

  const categories = ['הכל', 'פרשת שבוע', 'תורה', 'הלכה', 'עדכון']

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">תורה ופרשת השבוע</h1>
        <p className="text-xl text-center text-gray-600 mb-12">דברי תורה, שיעורים ועדכונים</p>

        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-bold transition ${filter === cat ? 'bg-blue-professional text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} to={`/torah/${post.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">📝</div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-professional rounded-full text-sm font-bold mb-3">{post.category}</span>
                <h3 className="text-xl font-bold text-blue-professional mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || post.content?.substring(0, 120) + '...'}</p>
                <div className="text-sm text-gray-500">{post.author} • {new Date(post.created_at).toLocaleDateString('he-IL')}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
