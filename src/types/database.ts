export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          category: string
          author: string
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string
          excerpt?: string | null
          category?: string
          author?: string
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          category?: string
          author?: string
          published?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          date: string
          time?: string
          location?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          created_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          title: string | null
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          url: string
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          url?: string
          type?: string
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          created_at?: string
        }
      }
    }
  }
}
