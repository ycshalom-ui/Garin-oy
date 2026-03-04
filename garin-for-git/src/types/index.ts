export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  category: string
  author: string
  image_url?: string
  tags?: string[]
  published: boolean
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  created_at: string
}

export interface GalleryItem {
  id: string
  title?: string
  url: string
  type: 'image' | 'video' | 'youtube'
  album?: string
  tags?: string[]
  created_at: string
}

export interface Contact {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}
