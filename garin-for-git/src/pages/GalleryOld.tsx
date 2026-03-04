import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryItem } from '../types'

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  async function loadGallery() {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-blue-professional text-center mb-4">גלריית תמונות ווידאו</h1>
        <p className="text-xl text-center text-gray-600 mb-12">רגעים מיוחדים מהגרעין</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} onClick={() => setLightbox(item)} className="aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
              {item.type === 'youtube' ? '▶️' : '📸'}
            </div>
          ))}
        </div>

        {lightbox && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-4 left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition">×</button>
            {lightbox.title && <div className="absolute bottom-8 right-1/2 translate-x-1/2 bg-white/90 px-6 py-3 rounded-full font-bold text-blue-professional">{lightbox.title}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
