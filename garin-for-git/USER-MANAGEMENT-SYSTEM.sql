-- ===================================================================
-- USER MANAGEMENT SYSTEM
-- ===================================================================
-- This creates a complete user management system with roles
-- Run this in Supabase SQL Editor
-- ===================================================================

-- ===================================================================
-- 1. ENSURE ADMIN USER EXISTS
-- ===================================================================

-- First, create the admin user in Supabase Auth UI:
-- Supabase → Authentication → Users → Add user
-- Email: garorye1@garorye1.com
-- Password: garorye10
-- Auto Confirm: YES

-- Then, get the user's UUID from the users table
-- and run this to set them as admin:

-- UPDATE profiles
-- SET role = 'admin',
--     full_name = 'Administrator'
-- WHERE email = 'garorye1@garorye1.com';

-- ===================================================================
-- 2. CREATE USER MANAGEMENT FUNCTIONS
-- ===================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new user (admin only)
CREATE OR REPLACE FUNCTION create_user_with_role(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT,
  user_role TEXT DEFAULT 'editor'
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only admins can create users'
    );
  END IF;

  -- Validate role
  IF user_role NOT IN ('admin', 'editor', 'user') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid role. Must be admin, editor, or user'
    );
  END IF;

  -- Note: User creation must be done via Supabase Dashboard
  -- This function is a template for future implementation
  
  RETURN json_build_object(
    'success', false,
    'error', 'User creation must be done via Supabase Dashboard. Then use update_user_role to set role.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role (admin only)
CREATE OR REPLACE FUNCTION update_user_role(
  user_id UUID,
  new_role TEXT
)
RETURNS JSON AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only admins can update user roles'
    );
  END IF;

  -- Validate role
  IF new_role NOT IN ('admin', 'editor', 'user') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid role. Must be admin, editor, or user'
    );
  END IF;

  -- Update the role
  UPDATE profiles
  SET role = new_role,
      updated_at = NOW()
  WHERE id = user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'User role updated successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can view all users';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    p.updated_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- 3. CREATE PERMISSIONS VIEWS
-- ===================================================================

-- View to check user permissions
CREATE OR REPLACE VIEW user_permissions AS
SELECT 
  id,
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN true
    ELSE false
  END AS can_manage_users,
  CASE 
    WHEN role IN ('admin', 'editor') THEN true
    ELSE false
  END AS can_create_posts,
  CASE 
    WHEN role IN ('admin', 'editor') THEN true
    ELSE false
  END AS can_create_events,
  CASE 
    WHEN role IN ('admin', 'editor') THEN true
    ELSE false
  END AS can_upload_gallery
FROM profiles;

-- ===================================================================
-- 4. UPDATE RLS POLICIES WITH ROLES
-- ===================================================================

-- Posts: Editors and Admins can manage
DROP POLICY IF EXISTS "Editors can manage posts" ON posts;
CREATE POLICY "Editors can manage posts"
  ON posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Events: Editors and Admins can manage
DROP POLICY IF EXISTS "Editors can manage events" ON events;
CREATE POLICY "Editors can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Gallery: Editors and Admins can manage
DROP POLICY IF EXISTS "Editors can manage gallery" ON gallery_items;
CREATE POLICY "Editors can manage gallery"
  ON gallery_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Profiles: Only admins can update roles
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;
CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- ===================================================================
-- DONE!
-- ===================================================================
-- Now you have:
-- ✅ Role-based access control
-- ✅ Admin can manage users
-- ✅ Editor can create content
-- ✅ User can only view
-- 
-- IMPORTANT:
-- To create new users:
-- 1. Supabase → Authentication → Users → Add user
-- 2. Use update_user_role(user_id, 'editor') to set role
-- ===================================================================
