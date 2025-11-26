# Implementation Plan - Mindful Nakes

## Pre-Development Setup Checklist

### Phase 0: Foundation & Environment Setup

#### 1. **Supabase Setup**
- [x] Create Supabase project
- [x] Get Supabase URL and anon key
- [x] Install Supabase client: `pnpm add @supabase/supabase-js @supabase/ssr`
- [x] Create `.env.local` with Supabase credentials
- [x] Set up Supabase Auth (email/password)

#### 2. **Database Schema Setup**
- [x] Create `users` table in Supabase (extend auth.users or create public.users) - Created as `app_users` in migration
- [x] Create `daily_quiz` table
- [x] Create `journal` table
- [x] Set up Row Level Security (RLS) policies
- [x] Create database indexes for performance
- **Note:** Migration file exists at `docs/migrations/001_initial_schema.sql` - needs to be run in Supabase SQL Editor

#### 3. **PayloadCMS Collections Setup**
- [x] Create `Articles` collection
- [x] Create `Videos` collection
- [x] Create `Audio` collection
- [x] Configure fields: title, content, media, tags, recommended_state

#### 4. **Project Structure Setup**
- [x] Create `/lib/supabase` for Supabase client utilities
- [x] Create `/lib/db` for database queries/helpers
- [x] Create `/app/api` structure for server actions
- [x] Set up middleware for quiz blocking logic
- [x] Create TypeScript types for database schemas

---

## Phase 1: Authentication & Core Infrastructure (Week 1)

### 1.1 Authentication System
- [x] Create `/app/login` page
- [x] Create `/app/register` page
- [x] Implement Supabase Auth integration
- [x] Create auth middleware
- [x] Set up session management
- [x] Implement auto-logout on idle

### 1.2 Database Utilities
- [x] Create `lib/supabase/client.ts` (browser client)
- [x] Create `lib/supabase/server.ts` (server client)
- [x] Create `lib/db/users.ts` (user queries)
- [x] Create `lib/db/quiz.ts` (quiz queries)
- [x] Create `lib/db/journal.ts` (journal queries)

### 1.3 Middleware & Routing
- [x] Create `middleware.ts` with quiz blocking logic
- [x] Set up protected routes
- [ ] **Update middleware for 24-hour validity check** (instead of daily check)
- [ ] Implement logic: if quiz completed within 24 hours → allow homepage access
- [x] Implement redirect logic (quiz → journal/consultation)

---

## Phase 2: Daily Quiz Feature (Week 2)

### 2.1 Quiz Data & Logic
- [x] **Update quiz questions JSON to PSS-10 format** (10 questions, confirmed with PSS-10 standard)
- [x] Create quiz scoring logic (sum calculation with reverse scoring, range 0-40)
- [x] **Update category mapping** (0-13: rendah, 14-26: sedang, 27-40: berat)
- [x] Create TypeScript types for quiz
- [x] **Implement 24-hour validity check logic** (check `created_at` timestamp in middleware)

### 2.2 Quiz UI
- [x] Create `/app/quiz` page (with authentication check)
- [x] Build quiz form component (Likert 0-4 scale for PSS-10)
- [x] Implement form validation (10 questions required)
- [x] Add progress indicator (1/10, 2/10, etc. with percentage bar)
- [x] Handle quiz submission (server action with validation)
- [x] **Create quiz result display component** (shows score, category, recommendations)

### 2.3 Quiz Result Flow
- [x] Create result calculation server action (with reverse scoring for questions 4, 5, 7, 8)
- [x] Save quiz to database with `created_at` timestamp (for 24-hour validity)
- [x] **Implement recommendations display based on score:**
  - Rendah (0-13): Deep Breathing, Read Tips
  - Sedang (14-26): Mindfulness, Read Tips, Consider Consultation
  - Berat (27-40): Mindfulness, Read Tips, Professional Help Warning + Links
- [x] Implement redirect logic:
  - Rendah/Sedang → `/journal`
  - Berat → `/consultation`
- [x] Create `/app/consultation` page (recommendation message with Halodoc/Alodokter links)

---

## Phase 3: Journaling Feature (Week 2-3)

### 3.1 Journal UI
- [ ] Create `/app/journal` page
- [ ] Build journal form (title, content, mood 1-5)
- [ ] Implement form validation
- [ ] Add date picker (default: today)

### 3.2 Journal Logic
- [ ] Create journal save server action
- [ ] Link journal to quiz (optional: auto-link to today's quiz)
- [ ] Implement "required after quiz" logic

---

## Phase 4: Homepage & Progress Tracking (Week 3)

### 4.1 Homepage (Beranda)
- [ ] Create `/app` or `/app/home` page (homepage)
- [ ] Display last assessment score result prominently
- [ ] Show user's current stress category status
- [ ] Create navigation hub to all features
- [ ] Add quick access to main features (Mindfulness, Journal, Progress, Profile)

### 4.2 Check Progress (Cek Progres)
- [ ] Create `/app/progress` page (separate from profile)
- [ ] Install charting library (Recharts or Chart.js)
- [ ] Create graph component for daily statistics
- [ ] Fetch quiz history from Supabase
- [ ] Plot: X = dates, Y = score/category
- [ ] Display daily stress statistics per date
- [ ] Add date range filter (optional)

### 4.3 Profile Page
- [ ] Create `/app/profile` page
- [ ] **Personal Data Section:**
  - Display full name (editable)
  - Edit profile photo functionality
  - Display/edit phone number
- [ ] **Account Settings Section:**
  - Change password functionality
  - Change email functionality
- [ ] Add logout functionality
- [ ] (Optional) History sections (quiz/journal history)

### 4.4 History Sections (Optional - can be in profile or separate)
- [ ] Create quiz history list component
- [ ] Create journal history list component
- [ ] Add pagination if needed
- [ ] Add detail view modals

---

## Phase 5: Mindfulness Features (Week 4)

### 5.1 PayloadCMS Content Collections
- [ ] Finalize Articles, Videos, Audio collections
- [ ] **Add specific content types:**
  - Short Meditation (Meditasi Singkat) + Video
  - Deep Breathing Relaxation (Relaksasi Nafas Dalam) + Video
  - Positive Affirmation (Afirmasi Positif) + Video
  - Mental Health Tips and Education articles
- [ ] Seed initial content (optional)
- [ ] Test content creation in PayloadCMS admin

### 5.2 Mindfulness Main Page
- [ ] Create `/app/mindfulness` page (main hub)
- [ ] Create navigation to three core features:
  - Short Meditation
  - Deep Breathing Relaxation
  - Positive Affirmation
- [ ] Create link to Tips and Education section
- [ ] Fetch content from PayloadCMS API
- [ ] Implement filtering by:
  - User's current stress category
  - Tags

### 5.3 Mindfulness Feature Pages
- [ ] Create `/app/mindfulness/meditation` page
- [ ] Create `/app/mindfulness/breathing` page
- [ ] Create `/app/mindfulness/affirmation` page
- [ ] Each page should have:
  - Content/audio player
  - Video player component
  - Related content suggestions

### 5.4 Tips and Education
- [ ] Create `/app/mindfulness/tips` or `/app/education` page
- [ ] Display articles on "How to Overcome Stress"
- [ ] Article viewer component
- [ ] Filter by stress category
- [ ] Add loading states

### 5.5 Content Display Components
- [ ] Article viewer component
- [ ] Video player component (for meditation, breathing, affirmation videos)
- [ ] Audio player component
- [ ] Add loading states

---

## Phase 6: Admin Dashboard (Week 5)

### 6.1 Admin Authentication
- [ ] Add role check middleware
- [ ] Create admin route protection
- [ ] Set up admin layout

### 6.2 Admin Dashboard
- [ ] Create `/app/admin` page
- [ ] Display total active users today
- [ ] Display average stress score today
- [ ] Display stress category distribution (pie/bar chart)
- [ ] Display trend chart (last 7/30 days)
- [ ] Fetch aggregated data from Supabase

### 6.3 User Management
- [ ] Create `/app/admin/users` page
- [ ] List all users
- [ ] View user details
- [ ] View user quiz history
- [ ] View user journal history
- [ ] CRUD operations (if needed)

### 6.4 Content Management
- [ ] Use PayloadCMS admin for content CRUD
- [ ] Verify content filtering works correctly

---

## Phase 7: Polish & Optimization (Week 6)

### 7.1 UI/UX Improvements
- [ ] Mobile responsiveness check
- [ ] Loading states everywhere
- [ ] Error handling & messages
- [ ] Empty states
- [ ] Accessibility audit

### 7.2 Performance
- [ ] Optimize database queries
- [ ] Add caching where appropriate
- [ ] Optimize images/media
- [ ] Lighthouse audit & fixes

### 7.3 Security
- [ ] Review RLS policies
- [ ] Test authorization on all routes
- [ ] Verify no secrets exposed
- [ ] Security audit

### 7.4 Testing
- [ ] Test complete user flow
- [ ] Test admin flow
- [ ] Test edge cases (multiple quizzes per day, etc.)
- [ ] Fix bugs

---

## Technical Decisions Needed

### Before Starting:
1. **Database Strategy**:
   - ✅ Use Supabase auth.users + extend with public.app_users table (already decided)

2. **Quiz Questions**:
   - ⚠️ **URGENT:** Confirm exact PSS-10 questions in Indonesian with client
   - Confirm reverse scoring logic (if any)
   - Confirm scoring calculation (how to get 0-40 range from 1-5 scale)

3. **24-Hour Validity**:
   - ✅ Use `created_at` timestamp from `daily_quiz` table
   - Check: `created_at > NOW() - INTERVAL '24 hours'`

4. **Idle Timeout**:
   - How long before auto-logout? (PRD says "configurable")

5. **Chart Library**:
   - Recharts or Chart.js? (Recommend Recharts for React)

6. **Date Handling**:
   - Timezone considerations? (Indonesia timezone - WIB/WITA/WIT?)
   - Use `TIMESTAMPTZ` for proper timezone handling

7. **Profile Photo Storage**:
   - Store in Supabase Storage or external service?
   - Update `profile_photo_url` in `app_users` table

---

## File Structure to Create

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/
│   │   ├── page.tsx (Homepage/Beranda - shows last assessment score)
│   │   ├── quiz/
│   │   ├── journal/
│   │   ├── consultation/
│   │   ├── progress/ (Check Progress/Cek Progres)
│   │   ├── profile/
│   │   ├── mindfulness/
│   │   │   ├── meditation/
│   │   │   ├── breathing/
│   │   │   ├── affirmation/
│   │   │   └── tips/ (or education/)
│   │   └── admin/
│   ├── api/
│   │   └── [server actions]
│   └── middleware.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── db/
│   │   ├── users.ts
│   │   ├── quiz.ts
│   │   └── journal.ts
│   └── types/
│       ├── database.ts
│       └── quiz.ts
├── components/
│   ├── quiz/
│   ├── journal/
│   ├── charts/
│   └── mindfulness/
└── data/
    └── quiz-questions.json
```

---

## Next Steps

1. **Start with Phase 0** - Get Supabase set up and database schema created
2. **Then Phase 1** - Build authentication foundation
3. **Follow sequentially** - Each phase builds on the previous

Would you like me to start with Phase 0 setup?

