import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../types'

export default function News() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .eq('category', 'עדכון')
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data)
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">📰 עדכונים מהגרעין</h1>
        <p className="text-xl text-center text-gray-600 mb-12">כל מה שחדש וקורה אצלנו</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/parasha/${post.id}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                📰
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-3">
                  עדכון
                </span>
                <h3 className="text-xl font-bold text-blue-professional mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt || post.content?.substring(0, 120) + '...'}
                </p>
                <div className="text-sm text-gray-500">
                  {post.author} • {new Date(post.created_at).toLocaleDateString('he-IL')}
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">אין עדכונים כרגע</h3>
              <p className="text-gray-500">חזרו בקרוב לעדכונים חדשים!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
