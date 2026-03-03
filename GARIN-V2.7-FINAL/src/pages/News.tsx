import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../types'

export default function News() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'פרשת השבוע' | 'עדכונים'>('all')

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  async function loadPosts() {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .in('category', ['פרשת השבוע', 'עדכונים'])
      .order('created_at', { ascending: false })
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }
    
    const { data } = await query
    if (data) setPosts(data)
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">עדכונים ופרשת השבוע</h1>
        <p className="text-xl text-center text-gray-600 mb-8">כל מה שחדש וקורה אצלנו</p>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setSelectedCategory('פרשת השבוע')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'פרשת השבוע'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📖 פרשת השבוע
          </button>
          <button
            onClick={() => setSelectedCategory('עדכונים')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'עדכונים'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📰 עדכונים
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/parasha/${post.id}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition"
            >
              <div className={`h-48 flex items-center justify-center text-6xl ${
                post.category === 'פרשת השבוע'
                  ? 'bg-gradient-to-br from-green-100 to-blue-100'
                  : 'bg-gradient-to-br from-orange-100 to-yellow-100'
              }`}>
                {post.category === 'פרשת השבוע' ? '📖' : '📰'}
              </div>
              <div className="p-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
                  post.category === 'פרשת השבוע'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {post.category}
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
              <div className="text-6xl mb-4">
                {selectedCategory === 'פרשת השבוע' ? '📖' : selectedCategory === 'עדכונים' ? '📰' : '📚'}
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {selectedCategory === 'all' ? 'אין פוסטים כרגע' : `אין ${selectedCategory} כרגע`}
              </h3>
              <p className="text-gray-500">חזרו בקרוב לתכנים חדשים!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
