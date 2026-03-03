import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryItem } from '../types'

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<string[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<'all' | string>('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    loadGallery()
  }, [selectedAlbum])

  async function loadGallery() {
    // Load items
    let query = supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (selectedAlbum !== 'all') {
      query = query.eq('album', selectedAlbum)
    }

    const { data: itemsData } = await query
    if (itemsData) setItems(itemsData)

    // Load unique albums
    const { data: albumsData } = await supabase
      .from('gallery_items')
      .select('album')
    
    if (albumsData) {
      const uniqueAlbums = [...new Set(
        albumsData
          .map(item => item.album)
          .filter(album => album && album.trim() !== '')
      )]
      setAlbums(uniqueAlbums as string[])
    }
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">🖼️ גלריית הגרעין</h1>
        <p className="text-xl text-center text-gray-600 mb-8">תמונות וסרטונים מחיי הקהילה</p>

        {/* Album Filters */}
        {albums.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">בחר אלבום:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedAlbum('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition shadow ${
                  selectedAlbum === 'all'
                    ? 'bg-blue-700 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎯 הכל ({items.length})
              </button>
              {albums.map(album => {
                const count = items.filter(item => item.album === album).length
                return (
                  <button
                    key={album}
                    onClick={() => setSelectedAlbum(album)}
                    className={`px-6 py-3 rounded-lg font-semibold transition shadow ${
                      selectedAlbum === album
                        ? 'bg-green-700 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📁 {album} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition bg-gray-200"
            >
              {item.type === 'image' || item.url?.includes('images/') ? (
                <img
                  src={item.url}
                  alt={item.title || 'תמונה'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : item.type === 'video' || item.url?.includes('videos/') ? (
                <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-purple-100">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                  📸
                </div>
              )}
              
              {/* Overlay with title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                {item.title && (
                  <p className="text-white font-semibold text-sm line-clamp-2">{item.title}</p>
                )}
                {item.album && (
                  <p className="text-white/80 text-xs mt-1">📁 {item.album}</p>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {selectedAlbum === 'all' ? 'אין פריטים בגלריה' : `אין פריטים באלבום "${selectedAlbum}"`}
              </h3>
              <p className="text-gray-500">חזרו בקרוב לתכנים חדשים!</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition z-10"
                aria-label="סגור"
              >
                ✕
              </button>

              {/* Media */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                {selectedItem.type === 'image' || selectedItem.url?.includes('images/') ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title || 'תמונה'}
                    className="w-full max-h-[70vh] object-contain bg-gray-100"
                  />
                ) : selectedItem.type === 'video' || selectedItem.url?.includes('videos/') ? (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] bg-black"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-600">לא ניתן להציג תוכן זה</p>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-6 bg-white">
                  {selectedItem.title && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                  )}
                  {selectedItem.album && (
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <span>📁</span>
                      <span className="font-semibold">{selectedItem.album}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    📅 {new Date(selectedItem.created_at).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Close button bottom */}
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition"
              >
                ✕ סגור
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
