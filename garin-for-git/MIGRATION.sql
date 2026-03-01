-- ===================================================================
-- Quick Migration - Fix Existing Database
-- ===================================================================
-- Run this if you already have a database and just need to fix:
-- 1. is_published → published
-- 2. Add missing columns (image_url, tags)
-- 3. Fix policies
-- ===================================================================

-- Step 1: Rename is_published to published (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE posts RENAME COLUMN is_published TO published;
    RAISE NOTICE 'Renamed is_published to published';
  ELSE
    RAISE NOTICE 'Column is_published does not exist, skipping rename';
  END IF;
END $$;

-- Step 2: Add missing columns
DO $$ 
BEGIN
  -- Add image_url if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_url TEXT;
    RAISE NOTICE 'Added column image_url';
  END IF;

  -- Add tags if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE posts ADD COLUMN tags TEXT[];
    RAISE NOTICE 'Added column tags';
  END IF;
END $$;

-- Step 3: Add indexes
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- Step 4: Fix policies
DROP POLICY IF EXISTS "Public read posts" ON posts;

CREATE POLICY "Public read posts" ON posts 
  FOR SELECT 
  USING (published = true);

-- Step 5: Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Fix storage policies
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload images" ON storage.objects;

CREATE POLICY "Public read images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ===================================================================
-- Verification
-- ===================================================================
-- Run this to verify the migration worked:
/*
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
*/
-- ===================================================================
