# Flowchart-Based Documentation Updates

## Overview

This document summarizes the updates made to the documentation based on the client's flowchart for the MeNu Care application.

**Date:** Based on client flowchart review
**Status:** Documentation updated, implementation pending

---

## Key Changes from Previous Documentation

### 1. Quiz System Change

**Previous:** Zung Self Anxiety Rating Scale (20 questions, 1-4 scale)
**Updated:** Perceived Stress Scale PSS-10 (10 questions, 1-5 scale)

**Impact:**
- Quiz questions reduced from 20 to 10
- Answer scale changed from 1-4 to 1-5
- Scoring range changed from 20-80 to 0-40
- Category labels updated: `ringan` → `rendah`, categories now: `rendah`, `sedang`, `berat`

### 2. Score Ranges Updated

**Previous:**
- 0-13: Ringan
- 14-20: Sedang
- 21+: Berat

**Updated (from flowchart):**
- 0-13: Rendah (Low)
- 14-26: Sedang (Medium)
- 27-40: Berat (High)

### 3. Quiz Validity Rule Changed

**Previous:** Daily quiz (once per day, based on date)
**Updated:** 24-hour validity window (quiz valid for 1x24 hours from completion time)

**Implementation:**
- Check `created_at` timestamp instead of just date
- If quiz completed within last 24 hours → allow homepage access
- If quiz expired or not completed → redirect to `/quiz`

### 4. New Features Added

#### 4.1 Homepage (Beranda)
- **New feature** - Main landing page after login
- Displays last assessment score result prominently
- Shows user's current stress category status
- Navigation hub to all features

#### 4.2 Check Progress (Cek Progres)
- **Separate feature** - Not just in profile
- Displays daily stress statistics per date
- Shows trend over time with charts/graphs
- Dedicated `/app/progress` page

#### 4.3 Enhanced Profile Page
- **Personal Data Section:**
  - Full Name (Nama Lengkap)
  - Edit Profile Photo
  - Phone Number (No Telepon)
- **Account Settings:**
  - Change Password (Ganti Password)
  - Change Email (Ganti Email)
- Logout functionality

#### 4.4 Structured Mindfulness Features
- **Short Meditation (Meditasi Singkat)** + Video
- **Deep Breathing Relaxation (Relaksasi Nafas Dalam)** + Video
- **Positive Affirmation (Afirmasi Positif)** + Video
- **Tips and Mental Health Education** (Articles)

### 5. Quiz Result Recommendations

**Rendah (0-13):**
- Deep Breathing Relaxation
- Read Mental Health Tips and Education
- Redirect to `/journal`

**Sedang (14-26):**
- Mindfulness (Meditation, Deep Breathing, Positive Affirmation)
- Read Mental Health Tips and Education
- Consider Consulting a Professional
- Redirect to `/journal`

**Berat (27-40):**
- Mindfulness (Meditation, Deep Breathing, Positive Affirmation)
- Read Mental Health Tips and Education
- **Warning:** If severe symptoms appear (severe sleep disorder, feeling unable to control oneself) → immediately seek professional help
- Links to Halodoc or Alodokter
- Redirect to `/consultation`

### 6. Database Schema Updates

**app_users table:**
- Added `phone_number` (TEXT, optional)
- Added `profile_photo_url` (TEXT, optional)
- Added `last_quiz_timestamp` (TIMESTAMPTZ) for 24-hour validity check

**daily_quiz table:**
- Updated `answers` to be array of 10 items (was 20)
- Updated `score` range: 0-40 (was different)
- Updated `category` values: `rendah`, `sedang`, `berat` (was `ringan`, `sedang`, `berat`)
- `created_at` timestamp now critical for 24-hour validity check

---

## Files Updated

1. ✅ `PRD.md` - Updated with all flowchart requirements
2. ✅ `QUIZ_PSS10.md` - Created new PSS-10 documentation (replaces QUIZ_ZUNG.md)
3. ✅ `DATABASE_SCHEMA.md` - Updated schema for new fields and requirements
4. ✅ `IMPLEMENTATION_PLAN.md` - Updated phases and technical decisions

---

## Action Items for Implementation

### Critical (Before Development)
1. ⚠️ **Confirm exact PSS-10 questions in Indonesian** with client
2. ⚠️ **Confirm reverse scoring logic** (if any questions need reverse scoring)
3. ⚠️ **Confirm scoring calculation** (how to get 0-40 range from 1-5 scale answers)

### High Priority
4. Update `src/data/quiz-questions.json` with actual PSS-10 questions
5. Update middleware to use 24-hour validity check
6. Create homepage (`/app` or `/app/home`) component
7. Create progress page (`/app/progress`) component
8. Update profile page with new sections

### Medium Priority
9. Create mindfulness feature pages (meditation, breathing, affirmation)
10. Implement recommendations display in quiz result
11. Add profile photo upload functionality
12. Add phone number field to user registration/profile

### Low Priority
13. Update existing quiz data if any exists
14. Migration script for existing data (if applicable)

---

## Notes

- The old `QUIZ_ZUNG.md` file is now superseded by `QUIZ_PSS10.md`
- All documentation now aligns with the client flowchart
- Implementation should follow the updated PRD and implementation plan
- Database migration may be needed if schema changes are required

---

## Questions for Client

1. What are the exact PSS-10 questions in Indonesian?
2. Are there any reverse-scored questions in PSS-10? (Standard PSS-10 has some reverse-scored items)
3. How should the scoring work to get 0-40 range from 1-5 scale answers?
4. Should profile photos be stored in Supabase Storage or external service?
5. What timezone should be used for the 24-hour validity check? (WIB/WITA/WIT?)

