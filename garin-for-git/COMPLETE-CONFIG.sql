-- Complete Configuration - Run after FINAL-FIX.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base tables
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  author TEXT DEFAULT 'Staff',
  image_url TEXT,
  tags TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  time TIME,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  album TEXT,
  type TEXT CHECK (type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  created_by UUID REFERENCES auth.users(id),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_profiles_username_key ON users_profiles(username);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_gallery_album ON gallery(album);
CREATE INDEX IF NOT EXISTS idx_events_extended_gregorian_date ON events_extended(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_parasha_readings_date ON parasha_readings(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_jewish_holidays_date ON jewish_holidays(gregorian_date);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_extended_updated_at ON events_extended;
CREATE TRIGGER update_events_extended_updated_at BEFORE UPDATE ON events_extended FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for users_profiles
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can create users" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can update all users" ON users_profiles;
DROP POLICY IF EXISTS "Users can update own info" ON users_profiles;
DROP POLICY IF EXISTS "Only admins can delete users" ON users_profiles;

CREATE POLICY "Users can view own profile" ON users_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON users_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can create users" ON users_profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update all users" ON users_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own info" ON users_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Only admins can delete users" ON users_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role THEN
    IF NOT EXISTS (SELECT 1 FROM users_profiles WHERE id = auth.uid() AND role = 'admin') THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON users_profiles;
CREATE TRIGGER prevent_role_change_trigger BEFORE UPDATE ON users_profiles FOR EACH ROW EXECUTE FUNCTION prevent_role_change();

-- RLS for events_extended
ALTER TABLE events_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view published events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can view all events" ON events_extended;
DROP POLICY IF EXISTS "Auth users can create events" ON events_extended;

CREATE POLICY "Everyone can view published events" ON events_extended FOR SELECT USING (is_published = true);
CREATE POLICY "Auth users can view all events" ON events_extended FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can create events" ON events_extended FOR INSERT WITH CHECK (auth.role() = 'authenticated');

SELECT 'Complete! All tables, RLS, triggers, and indexes ready.' as status;
