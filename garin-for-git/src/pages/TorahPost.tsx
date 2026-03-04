import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../types'

export default function TorahPost() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (id) loadPost()
  }, [id])

  async function loadPost() {
    if (!id) return
    const { data } = await supabase.from('posts').select('*').eq('id', id).single()
    if (data) setPost(data)
  }

  if (!post) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-gray-500">טוען...</div></div>

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <article className="max-w-4xl mx-auto px-4">
        <Link to="/parasha" className="inline-block text-blue-professional hover:text-blue-800 mb-8 font-bold">← חזרה לפרשת השבוע</Link>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {post.image_url && (
            <div className="w-full h-96 overflow-hidden">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8 md:p-12">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-professional font-bold rounded-full mb-4">{post.category}</span>
            <h1 className="text-4xl md:text-5xl font-black text-blue-professional mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 border-t border-b border-gray-200 py-4 mb-8">
              <span className="font-bold">{post.author}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-lg max-w-none text-gray-800" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {post.content?.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
