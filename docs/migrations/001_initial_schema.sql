-- Migration: Initial Schema Setup
-- Description: Creates app_users, daily_quiz, and journal tables with RLS policies
-- Note: Using 'app_users' instead of 'users' to avoid conflict with PayloadCMS users table
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Create app_users table (renamed from users to avoid PayloadCMS conflict)
-- ============================================
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  "role" TEXT DEFAULT 'user' CHECK ("role" IN ('user', 'admin')),
  last_quiz_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for app_users
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users("role");
CREATE INDEX IF NOT EXISTS idx_app_users_last_quiz_date ON public.app_users(last_quiz_date);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "App users can read own data" ON public.app_users;
DROP POLICY IF EXISTS "App users can update own data" ON public.app_users;
DROP POLICY IF EXISTS "App users can insert own data" ON public.app_users;
DROP POLICY IF EXISTS "Admins can read all app users" ON public.app_users;

-- RLS Policies for app_users
CREATE POLICY "App users can read own data"
  ON public.app_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "App users can update own data"
  ON public.app_users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "App users can insert own data"
  ON public.app_users FOR INSERT
  WITH CHECK (
    auth.uid() = id AND
    auth.uid() IS NOT NULL
  );

-- Admins can read all users (using JWT to avoid infinite recursion)
CREATE POLICY "Admins can read all app users"
  ON public.app_users FOR SELECT
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- ============================================
-- 2. Create daily_quiz table
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('rendah', 'sedang', 'berat')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for daily_quiz
CREATE INDEX IF NOT EXISTS idx_daily_quiz_user_id ON public.daily_quiz(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_date ON public.daily_quiz(date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_user_date ON public.daily_quiz(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_category ON public.daily_quiz(category);

-- Enable RLS
ALTER TABLE public.daily_quiz ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own quizzes" ON public.daily_quiz;
DROP POLICY IF EXISTS "Users can insert own quizzes" ON public.daily_quiz;
DROP POLICY IF EXISTS "Admins can read all quizzes" ON public.daily_quiz;

-- RLS Policies for daily_quiz
CREATE POLICY "Users can read own quizzes"
  ON public.daily_quiz FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes"
  ON public.daily_quiz FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all quizzes (using JWT to avoid infinite recursion)
CREATE POLICY "Admins can read all quizzes"
  ON public.daily_quiz FOR SELECT
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- ============================================
-- 3. Create journal table
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for journal
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.journal(date);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON public.journal(user_id, date);

-- Enable RLS
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own journals" ON public.journal;
DROP POLICY IF EXISTS "Users can insert own journals" ON public.journal;
DROP POLICY IF EXISTS "Users can update own journals" ON public.journal;
DROP POLICY IF EXISTS "Users can delete own journals" ON public.journal;
DROP POLICY IF EXISTS "Admins can read all journals" ON public.journal;

-- RLS Policies for journal
CREATE POLICY "Users can read own journals"
  ON public.journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journals"
  ON public.journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON public.journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON public.journal FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all journals (using JWT to avoid infinite recursion)
CREATE POLICY "Admins can read all journals"
  ON public.journal FOR SELECT
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- ============================================
-- 4. Create helper functions
-- ============================================

-- Function to automatically create app_users record when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.app_users (id, email, name, "role")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create app_users when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update last_quiz_date
CREATE OR REPLACE FUNCTION update_user_last_quiz_date()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.app_users
  SET last_quiz_date = NEW.date
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Create triggers
-- ============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_last_quiz_date ON public.daily_quiz;
DROP TRIGGER IF EXISTS trigger_update_app_users_updated_at ON public.app_users;
DROP TRIGGER IF EXISTS trigger_update_journal_updated_at ON public.journal;

-- Trigger to update last_quiz_date when quiz is created
CREATE TRIGGER trigger_update_last_quiz_date
  AFTER INSERT ON public.daily_quiz
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_quiz_date();

-- Trigger to update updated_at for app_users
CREATE TRIGGER trigger_update_app_users_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for journal
CREATE TRIGGER trigger_update_journal_updated_at
  BEFORE UPDATE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

