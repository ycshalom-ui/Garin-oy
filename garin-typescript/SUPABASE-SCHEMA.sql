-- ===================================================================
-- Supabase Schema - Idempotent & Safe for Re-runs
-- ===================================================================

-- Posts (Torah, Weekly Portion, News)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'עדכון',
  author TEXT DEFAULT 'צוות הגרעין',
  image_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  -- Add image_url if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_url TEXT;
  END IF;

  -- Add tags if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE posts ADD COLUMN tags TEXT[];
  END IF;

  -- Rename is_published to published if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_published'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'published'
  ) THEN
    ALTER TABLE posts RENAME COLUMN is_published TO published;
  END IF;

  -- Add published if missing and is_published doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'published'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Events Calendar
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  url TEXT,
  type TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Forms
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(to_tsvector('hebrew', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Public read posts" ON posts;
DROP POLICY IF EXISTS "Public read events" ON events;
DROP POLICY IF EXISTS "Public read gallery" ON gallery_items;
DROP POLICY IF EXISTS "Public insert contacts" ON contacts;

-- Recreate policies
CREATE POLICY "Public read posts" ON posts 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Public read events" ON events 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read gallery" ON gallery_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public insert contacts" ON contacts 
  FOR INSERT 
  WITH CHECK (true);

-- Storage bucket for post images (safe insert)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload images" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Public read images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ===================================================================
-- Summary
-- ===================================================================
-- This script is safe to run multiple times
-- It will:
-- - Create tables only if they don't exist
-- - Add missing columns to existing tables
-- - Rename is_published to published if needed
-- - Create indexes only if they don't exist
-- - Recreate policies (drops first to avoid conflicts)
-- - Insert storage bucket safely (ON CONFLICT DO NOTHING)
-- ===================================================================
