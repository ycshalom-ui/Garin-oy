-- ===================================================================
-- Supabase Migration - Final Fix (handles author/author_id issue)
-- ===================================================================

-- Add missing columns to posts
DO $$ 
BEGIN
  -- Add tags if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE posts ADD COLUMN tags TEXT[];
  END IF;

  -- Add video_url if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN video_url TEXT;
  END IF;

  -- Add updated_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;

  -- Add author_id if missing (but keep author)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE posts ADD COLUMN author_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add missing columns to gallery_items
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_items' AND column_name = 'tags'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN tags TEXT[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_items' AND column_name = 'album'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN album TEXT;
  END IF;
END $$;

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_contact_method CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- Create profiles table if it doesn't exist
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
-- RLS ENABLE
-- ===================================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- POLICIES (fixed to work with existing schema)
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

-- Posts Policies (FIXED - works with both author and author_id)
DROP POLICY IF EXISTS "Public read published posts" ON posts;
CREATE POLICY "Public read published posts" ON posts 
  FOR SELECT 
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
CREATE POLICY "Authenticated users can insert posts" ON posts 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update posts" ON posts;
CREATE POLICY "Authenticated users can update posts" ON posts 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON posts;
CREATE POLICY "Authenticated users can delete posts" ON posts 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

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

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
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

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '✅ All missing columns added';
  RAISE NOTICE '✅ All data preserved';
  RAISE NOTICE '✅ Policies fixed for existing schema';
  RAISE NOTICE '========================================';
END $$;
