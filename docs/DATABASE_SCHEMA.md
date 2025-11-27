# Database Schema Reference

## Supabase Tables

### 1. `app_users` (extends auth.users or separate table)

**Note:** Renamed from `users` to `app_users` to avoid conflict with PayloadCMS `users` table.

```sql
CREATE TABLE public.app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone_number TEXT,
  profile_photo_url TEXT,
  "role" TEXT DEFAULT 'user' CHECK ("role" IN ('user', 'admin')),
  last_quiz_date DATE,
  last_quiz_timestamp TIMESTAMPTZ, -- For 24-hour validity check
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_app_users_email ON public.app_users(email);
CREATE INDEX idx_app_users_role ON public.app_users("role");
CREATE INDEX idx_app_users_last_quiz_date ON public.app_users(last_quiz_date);

-- RLS Policies
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "App users can read own data"
  ON public.app_users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "App users can update own data"
  ON public.app_users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all users (using JWT to avoid infinite recursion)
-- Note: This assumes 'role' is stored in JWT claims
-- Alternative: use a SECURITY DEFINER function if role is not in JWT
CREATE POLICY "Admins can read all app users"
  ON public.app_users FOR SELECT
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );
```

### 2. `daily_quiz`

```sql
CREATE TABLE public.daily_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  answers JSONB NOT NULL, -- Array of 10 answers: [0, 1, 2, 3, 4, ...] (PSS-10, 0-4 scale, reverse scoring for questions 4, 5, 7, 8)
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40), -- PSS-10 score range
  category TEXT NOT NULL CHECK (category IN ('rendah', 'sedang', 'berat')), -- Updated categories
  created_at TIMESTAMPTZ DEFAULT NOW(), -- Critical for 24-hour validity check

  -- Ensure one quiz per user per day
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_daily_quiz_user_id ON public.daily_quiz(user_id);
CREATE INDEX idx_daily_quiz_date ON public.daily_quiz(date);
CREATE INDEX idx_daily_quiz_user_date ON public.daily_quiz(user_id, date);
CREATE INDEX idx_daily_quiz_category ON public.daily_quiz(category);

-- RLS Policies
ALTER TABLE public.daily_quiz ENABLE ROW LEVEL SECURITY;

-- Users can read their own quizzes
CREATE POLICY "Users can read own quizzes"
  ON public.daily_quiz FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quizzes
CREATE POLICY "Users can insert own quizzes"
  ON public.daily_quiz FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all quizzes
CREATE POLICY "Admins can read all quizzes"
  ON public.daily_quiz FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE id = auth.uid() AND "role" = 'admin'
    )
  );
```

### 3. `journal`

```sql
CREATE TABLE public.journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journal_user_id ON public.journal(user_id);
CREATE INDEX idx_journal_date ON public.journal(date);
CREATE INDEX idx_journal_user_date ON public.journal(user_id, date);

-- RLS Policies
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

-- Users can read their own journals
CREATE POLICY "Users can read own journals"
  ON public.journal FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own journals
CREATE POLICY "Users can insert own journals"
  ON public.journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own journals
CREATE POLICY "Users can update own journals"
  ON public.journal FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own journals
CREATE POLICY "Users can delete own journals"
  ON public.journal FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all journals
CREATE POLICY "Admins can read all journals"
  ON public.journal FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE id = auth.uid() AND "role" = 'admin'
    )
  );
```

## Helper Functions

### Update `last_quiz_date` trigger

```sql
CREATE OR REPLACE FUNCTION update_user_last_quiz_date()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.app_users
  SET last_quiz_date = NEW.date,
      last_quiz_timestamp = NEW.created_at -- Store timestamp for 24-hour validity check
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_quiz_date
  AFTER INSERT ON public.daily_quiz
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_quiz_date();
```

### Update `updated_at` trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_app_users_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_journal_updated_at
  BEFORE UPDATE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## TypeScript Types

```typescript
// lib/types/database.ts

export type User = {
  id: string;
  email: string;
  name: string | null;
  phone_number: string | null;
  profile_photo_url: string | null;
  role: 'user' | 'admin';
  last_quiz_date: string | null;
  last_quiz_timestamp: string | null; // For 24-hour validity check
  created_at: string;
  updated_at: string;
};

export type DailyQuiz = {
  id: string;
  user_id: string;
  date: string;
  answers: number[]; // Array of 10 numbers (0-4) for PSS-10, with reverse scoring for questions 4, 5, 7, 8
  score: number; // Range: 0-40
  category: 'rendah' | 'sedang' | 'berat'; // Updated categories
  created_at: string; // Critical for 24-hour validity check
};

export type Journal = {
  id: string;
  user_id: string;
  date: string;
  title: string | null;
  content: string;
  mood: number; // 1-5
  created_at: string;
  updated_at: string;
};
```

## Helper Query: Check 24-Hour Quiz Validity

```sql
-- Check if user has valid quiz within last 24 hours
SELECT * FROM public.daily_quiz
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 1;
```

## Migration Notes

1. Run these SQL scripts in Supabase SQL Editor
2. Test RLS policies with different user roles
3. Verify indexes are created
4. Test triggers work correctly
5. **Important:** The `created_at` timestamp in `daily_quiz` is critical for 24-hour validity checks
6. Update existing `category` values from 'ringan' to 'rendah' if migrating from old schema
7. **RLS Fix:** If you encounter "infinite recursion detected in policy" error, update the admin policy to use JWT claims instead of querying app_users table (see policy definition above)

