-- ===================================================================
-- Supabase Schema - Clean Install (Drops old tables)
-- ===================================================================
-- WARNING: This will delete all existing data in these tables!
-- ===================================================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- CREATE TABLES
-- ===================================================================

-- Leads (Contact Form Submissions)
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_contact_method CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- Posts (Torah, Weekly Portion, News, Blog)
CREATE TABLE posts (
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
CREATE TABLE events (
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
CREATE TABLE gallery_items (
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
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles
CREATE TABLE profiles (
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

CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_gallery_tags ON gallery_items USING GIN(tags);
CREATE INDEX idx_gallery_album ON gallery_items(album);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

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
CREATE POLICY "Anyone can insert leads" ON leads 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON leads 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Posts Policies
CREATE POLICY "Public read published posts" ON posts 
  FOR SELECT 
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert posts" ON posts 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their posts" ON posts 
  FOR UPDATE 
  USING (auth.uid() = author_id OR auth.role() = 'authenticated');

CREATE POLICY "Authors can delete their posts" ON posts 
  FOR DELETE 
  USING (auth.uid() = author_id OR auth.role() = 'authenticated');

-- Events Policies
CREATE POLICY "Public read events" ON events 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage events" ON events 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Gallery Policies
CREATE POLICY "Public read gallery" ON gallery_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage gallery" ON gallery_items 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Contacts Policies
CREATE POLICY "Public insert contacts" ON contacts 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contacts" ON contacts 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- ===================================================================
-- STORAGE BUCKETS
-- ===================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (drop old ones first)
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload documents" ON storage.objects;

CREATE POLICY "Public read images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read videos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated upload videos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Public read documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'documents');

CREATE POLICY "Authenticated upload documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ===================================================================
-- FUNCTIONS & TRIGGERS
-- ===================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
