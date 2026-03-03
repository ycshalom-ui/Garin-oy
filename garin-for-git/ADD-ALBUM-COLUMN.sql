-- ===================================================================
-- Add Album Column to Gallery
-- ===================================================================
-- This adds the 'album' column to gallery_items table
-- Run this in Supabase SQL Editor
-- ===================================================================

-- Add album column if it doesn't exist
ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS album TEXT;

-- ===================================================================
-- Storage Policies for Gallery Uploads
-- ===================================================================

-- Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to upload videos
CREATE POLICY IF NOT EXISTS "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow public read access to images
CREATE POLICY IF NOT EXISTS "Public can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow public read access to videos
CREATE POLICY IF NOT EXISTS "Public can read videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- ===================================================================
-- Done!
-- ===================================================================
-- Now you can:
-- 1. Upload images and videos from Admin Panel
-- 2. Assign them to albums
-- 3. View them in the Gallery page
-- ===================================================================
