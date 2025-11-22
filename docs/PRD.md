# **PRODUCT REQUIREMENT DOCUMENT (AI-OPTIMIZED FOR CURSOR)**

**Project:** Web Apps – Kesehatan Mental Tenaga Kesehatan
**Tech Stack:** NextJS 14, TailwindCSS, Supabase, PayloadCMS, Vercel
**Goal:** Build a mental-health tracking platform for medical workers with daily stress quiz, journaling, progress charts, and personalized mindfulness content. Admins monitor aggregated trends and manage content.

---

## **1. User Roles**

### **1. Medical Worker (User)**

* Must complete daily stress quiz before accessing other features.
* Writes daily journals.
* Views mental health progress graph.
* Accesses mindfulness content (article/audio/video) based on stress level.

### **2. Admin**

* Views dashboards of all users’ stress trends.
* Manages content (articles, videos, audios).
* Manages user accounts.
* Views user journal and quiz history.

---

## **2. Core Features (User)**

### **2.1 Authentication**

* Email/password login via Supabase Auth.
* Auto-logout after idle (configurable in client + server session expiration).

---

### **2.2 Daily Stress Quiz**

* 10 questions (Likert 1–5).
* Score is sum or weighted sum → mapped to levels:

  * 0–13 → Ringan
  * 14–20 → Sedang
  * 21+ → Berat
* Blocking rule:

  * If quiz for today not completed → redirect to /quiz (block all other routes).

---

### **2.3 Quiz Result Flow**

* If **Ringan/Sedang** → Redirect to /journal (user writes journal).
* If **Berat** → Redirect to /consultation (show recommendation to seek help).

---

### **2.4 Journaling**

* Fields:

  * title: string | optional
  * content: text
  * mood: integer (1–5)
* Journaling required only once after quiz.

---

### **2.5 Profile Page**

Contains:

#### **Graph: Stress Progress**

* X = days
* Y = score/category
* Data pulled from Supabase daily_quiz table.

#### **History**

* Quiz history
* Journal history

---

### **2.6 Mindfulness Page**

* Content types: article, audio, video
* Filtered by:

  * user stress category
  * admin-defined tags
* Content stored in PayloadCMS.

---

## **3. Admin Features**

### **3.1 Dashboard**

* Total active users today
* Average stress score today
* Distribution of stress categories (ringan/sedang/berat)
* Trend chart (last 7 / 30 days)

---

### **3.2 User Management**

* CRUD users (via Supabase or PayloadCMS)
* View quiz history
* View journal history

---

### **3.3 Content Management (PayloadCMS)**

Collections:

* `articles`
* `videos`
* `audio`
  Fields include:
* title
* content/body
* media file (optional)
* tags
* recommended_state: ringan | sedang | berat | semua

---

## **4. Database Schema (Supabase)**

### **users**

id (uuid)
email
name
role (user | admin)
last_quiz_date
created_at

### **daily_quiz**

id
user_id
date
answers (json)
score (int)
category (ringan | sedang | berat)
created_at

### **journal**

id
user_id
date
title
content
mood (int)
created_at

PayloadCMS will manage its own collections; Supabase is only for user activity + analytics.

---

## **5. Technical Architecture**

* NextJS App Router (server components + server actions).
* Supabase client for DB + Auth.
* Next Middleware:

  * Redirect user to /quiz if today’s quiz not completed.
* PayloadCMS deployed separately but can be on Vercel.
* TailwindCSS for UI.
* Charts built using Recharts or Chart.js.

---

## **6. Non-Functional Requirements**

* Data encryption (supabase default + RLS).
* Auto logout (idle timeout + session expiration).
* High Lighthouse performance score.
* Responsive UI for mobile nurses/doctors.

---

## **7. KPIs**

* Daily Active Users
* Daily Quiz Completion Rate
* Stress Score Trend (downward = success)
* Mindfulness Content Engagement
