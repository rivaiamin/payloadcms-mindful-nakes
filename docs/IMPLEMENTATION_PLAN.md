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
- [ ] Create `lib/supabase/client.ts` (browser client)
- [ ] Create `lib/supabase/server.ts` (server client)
- [ ] Create `lib/db/users.ts` (user queries)
- [ ] Create `lib/db/quiz.ts` (quiz queries)
- [ ] Create `lib/db/journal.ts` (journal queries)

### 1.3 Middleware & Routing
- [ ] Create `middleware.ts` with quiz blocking logic
- [ ] Set up protected routes
- [ ] Implement redirect logic (quiz → journal/consultation)

---

## Phase 2: Daily Quiz Feature (Week 2)

### 2.1 Quiz Data & Logic
- [ ] Create static quiz questions JSON (10 questions)
- [ ] Create quiz scoring logic (sum calculation)
- [ ] Create category mapping (0-13: ringan, 14-20: sedang, 21+: berat)
- [ ] Create TypeScript types for quiz

### 2.2 Quiz UI
- [ ] Create `/app/quiz` page
- [ ] Build quiz form component (Likert 1-5 scale)
- [ ] Implement form validation
- [ ] Add progress indicator
- [ ] Handle quiz submission

### 2.3 Quiz Result Flow
- [ ] Create result calculation server action
- [ ] Save quiz to database
- [ ] Implement redirect logic:
  - Ringan/Sedang → `/journal`
  - Berat → `/consultation`
- [ ] Create `/app/consultation` page (recommendation message)

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

## Phase 4: Profile & Progress Tracking (Week 3)

### 4.1 Profile Page
- [ ] Create `/app/profile` page
- [ ] Display user information
- [ ] Add logout functionality

### 4.2 Stress Progress Graph
- [ ] Install charting library (Recharts or Chart.js)
- [ ] Create graph component
- [ ] Fetch quiz history from Supabase
- [ ] Plot: X = days, Y = score/category
- [ ] Add date range filter (optional)

### 4.3 History Sections
- [ ] Create quiz history list component
- [ ] Create journal history list component
- [ ] Add pagination if needed
- [ ] Add detail view modals

---

## Phase 5: Mindfulness Content (Week 4)

### 5.1 PayloadCMS Content Collections
- [ ] Finalize Articles, Videos, Audio collections
- [ ] Seed initial content (optional)
- [ ] Test content creation in PayloadCMS admin

### 5.2 Mindfulness Page
- [ ] Create `/app/mindfulness` page
- [ ] Fetch content from PayloadCMS API
- [ ] Implement filtering by:
  - User's current stress category
  - Tags
- [ ] Create content cards/components
- [ ] Add content detail view

### 5.3 Content Display
- [ ] Article viewer component
- [ ] Video player component
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
   - Use Supabase auth.users + extend with public.users table?
   - Or create separate users table and sync with auth?

2. **Quiz Questions**:
   - What are the actual 10 questions? (Need content)

3. **Idle Timeout**:
   - How long before auto-logout? (PRD says "configurable")

4. **Chart Library**:
   - Recharts or Chart.js? (Recommend Recharts for React)

5. **Date Handling**:
   - Timezone considerations? (Indonesia timezone?)

---

## File Structure to Create

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/
│   │   ├── quiz/
│   │   ├── journal/
│   │   ├── consultation/
│   │   ├── profile/
│   │   ├── mindfulness/
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

