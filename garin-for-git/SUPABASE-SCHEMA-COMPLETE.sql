-- ===================================================================
-- Supabase Schema - Complete System
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- TABLES
-- ===================================================================

-- Leads (Contact Form Submissions)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_contact_method CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- Posts (Torah, Weekly Portion, News, Blog)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'עדכון',
  author TEXT DEFAULT 'צוות הגרעין',
  author_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events Calendar
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  album TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contacts (kept for backwards compatibility)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles (for admin management)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===================================================================
-- INDEXES
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_gallery_tags ON gallery_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_gallery_album ON gallery_items(album);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- POLICIES
-- ===================================================================

-- Leads Policies
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
CREATE POLICY "Authenticated users can view leads" ON leads 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Posts Policies
DROP POLICY IF EXISTS "Public read published posts" ON posts;
CREATE POLICY "Public read published posts" ON posts 
  FOR SELECT 
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
CREATE POLICY "Authenticated users can insert posts" ON posts 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authors can update their posts" ON posts;
CREATE POLICY "Authors can update their posts" ON posts 
  FOR UPDATE 
  USING (auth.uid() = author_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authors can delete their posts" ON posts;
CREATE POLICY "Authors can delete their posts" ON posts 
  FOR DELETE 
  USING (auth.uid() = author_id OR auth.role() = 'authenticated');

-- Events Policies
DROP POLICY IF EXISTS "Public read events" ON events;
CREATE POLICY "Public read events" ON events 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
CREATE POLICY "Authenticated users can manage events" ON events 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Gallery Policies
DROP POLICY IF EXISTS "Public read gallery" ON gallery_items;
CREATE POLICY "Public read gallery" ON gallery_items 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON gallery_items;
CREATE POLICY "Authenticated users can manage gallery" ON gallery_items 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Contacts Policies
DROP POLICY IF EXISTS "Public insert contacts" ON contacts;
CREATE POLICY "Public insert contacts" ON contacts 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view contacts" ON contacts;
CREATE POLICY "Authenticated users can view contacts" ON contacts 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- ===================================================================
-- STORAGE BUCKETS
-- ===================================================================

-- Create buckets (safe insert)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
CREATE POLICY "Public read images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated upload images" ON storage.objects;
CREATE POLICY "Authenticated upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
CREATE POLICY "Public read videos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Authenticated upload videos" ON storage.objects;
CREATE POLICY "Authenticated upload videos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
CREATE POLICY "Public read documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Authenticated upload documents" ON storage.objects;
CREATE POLICY "Authenticated upload documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ===================================================================
-- FUNCTIONS
-- ===================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- NOTES
-- ===================================================================
-- This schema supports:
-- - Contact form leads with validation
-- - Full blog/news system with tags, images, videos
-- - Event management
-- - Gallery with albums and tags
-- - User authentication and profiles
-- - RLS for security
-- - Storage for media files
-- - Full-text search ready (add GIN indexes on tsvector columns if needed)
-- ===================================================================
