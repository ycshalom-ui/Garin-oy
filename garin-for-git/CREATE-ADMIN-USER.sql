-- ===================================================================
-- Create Admin User - garorye1
-- ===================================================================
-- This creates the admin user in Supabase Auth
-- Run this in Supabase SQL Editor
-- ===================================================================

-- IMPORTANT: This is a manual SQL script
-- You'll need to create the user through Supabase Dashboard instead:
--
-- 1. Supabase → Authentication → Users
-- 2. Add user → Email sign-up
-- 3. Email: garorye1@garorye1.com (or any email)
-- 4. Password: garorye10
-- 5. Click "Create user"
-- 6. Copy the user's UUID
-- 7. Then run the SQL below (replace USER_UUID with the actual UUID)

-- After creating the user in Auth, run this to add admin profile:
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  'USER_UUID_HERE', -- Replace with actual user UUID from Auth
  'garorye1@garorye1.com',
  'Admin',
  'admin',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    updated_at = now();

-- Grant admin all permissions
-- (RLS policies already allow admin full access)

-- ===================================================================
-- OR: Create user via Auth API (recommended)
-- ===================================================================
-- Use this approach instead for better security:
--
-- 1. Go to Supabase Dashboard
-- 2. Authentication → Users → Add User
-- 3. Email: garorye1@garorye1.com
-- 4. Password: garorye10
-- 5. Auto Confirm User: YES
-- 6. The system will automatically create a profile with role='admin'
--
-- ===================================================================
