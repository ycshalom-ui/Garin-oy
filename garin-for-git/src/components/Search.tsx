import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'event'
  url: string
  excerpt?: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleSearch(searchQuery: string) {
    setQuery(searchQuery)
    
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    // Search posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, excerpt, content')
      .eq('published', true)
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .limit(5)

    // Search events
    const { data: events } = await supabase
      .from('events')
      .select('id, title, description')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(5)

    const searchResults: SearchResult[] = []

    posts?.forEach(post => {
      searchResults.push({
        id: post.id,
        title: post.title,
        type: 'post',
        url: `/parasha/${post.id}`,
        excerpt: post.excerpt || post.content?.substring(0, 100)
      })
    })

    events?.forEach(event => {
      searchResults.push({
        id: event.id,
        title: event.title,
        type: 'event',
        url: '/events',
        excerpt: event.description?.substring(0, 100)
      })
    })

    setResults(searchResults)
    setLoading(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 חיפוש באתר..."
          value={query}
          onChange={(e) => {
            handleSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full md:w-80 px-4 py-2 pr-10 border-2 border-gray-200 rounded-full focus:border-blue-professional focus:outline-none"
        />
        <span className="absolute right-3 top-2.5 text-gray-400 text-xl">🔍</span>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full md:w-96 bg-white rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              מחפש...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              לא נמצאו תוצאות עבור "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map(result => (
                <Link
                  key={result.id}
                  to={result.url}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="block p-4 hover:bg-gray-50 rounded-xl transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {result.type === 'post' ? '📝' : '📅'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-professional">{result.title}</h4>
                      {result.excerpt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                      <span className="text-xs text-gray-400 mt-1">
                        {result.type === 'post' ? 'פוסט' : 'אירוע'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
