# ✅ **PERCEIVED STRESS SCALE (PSS-10) — DOCUMENTATION FOR CURSOR**

## **1. Quiz Name**

**Perceived Stress Scale (PSS-10)**
10 questions, 5-point Likert scale answers (0-4 scale).

**Note:** This replaces the previous Zung Self Anxiety Rating Scale. The application uses PSS-10 as specified in the client flowchart.

---

## **2. Answer Options (Fixed)**

| Option Label              | Value | Meaning        |
| ------------------------- | ----- | -------------- |
| "Tidak Pernah"            | 0     | Never          |
| "Hampir Tidak Pernah"      | 1     | Almost Never   |
| "Kadang-Kadang"           | 2     | Sometimes      |
| "Cukup Sering"            | 3     | Fairly Often   |
| "Sangat Sering"           | 4     | Very Often     |

Use **numeric values 0–4** only.

These values must be stored exactly as integers in Supabase.

---

## **3. Questions List (Structured)**

Store these as constant JSON (used by frontend + backend):

### **Questions Reference Table**

| No | Pertanyaan                                                                                                                                                        | Tidak Pernah (0) | Hampir Tidak Pernah (1) | Kadang-Kadang (2) | Cukup Sering (3) | Sangat Sering (4) |
| -- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------- | ----------------- | ---------------- | ----------------- |
| 1  | Dalam sebulan terakhir, seberapa sering Anda merasa kecewa/gundah/terganggu karena sesuatu hal yang terjadi di luar harapan/dugaan Anda?                          | 0                | 1                       | 2                 | 3                | 4                 |
| 2  | Dalam sebulan terakhir, seberapa sering Anda merasa tidak mampu untuk mengontrol hal-hal penting dalam hidup Anda? (contoh: pekerjaan, sekolah, keluarga, ibadah) | 0                | 1                       | 2                 | 3                | 4                 |
| 3  | Dalam sebulan terakhir, seberapa sering Anda merasa gelisah dan stres?                                                                                            | 0                | 1                       | 2                 | 3                | 4                 |
| 4  | Dalam sebulan terakhir, seberapa sering Anda merasa percaya diri bahwa Anda mampu untuk menyelesaikan masalah pribadi Anda?                                       | 4                | 3                       | 2                 | 1                | 0                 |
| 5  | Dalam sebulan terakhir, seberapa sering Anda merasa bahwa segala sesuatunya berjalan sesuai keinginan Anda?                                                       | 4                | 3                       | 2                 | 1                | 0                 |
| 6  | Dalam sebulan terakhir, seberapa sering Anda menyadari bahwa Anda tidak dapat menyelesaikan semua hal yang harus Anda lakukan?                                    | 0                | 1                       | 2                 | 3                | 4                 |
| 7  | Dalam sebulan terakhir, seberapa sering Anda dapat mengontrol perasaan jengkel atau tidak nyaman yang mengganggu dalam hidup Anda?                                | 4                | 3                       | 2                 | 1                | 0                 |
| 8  | Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda berada dalam situasi yang nyaman?                                                                  | 4                | 3                       | 2                 | 1                | 0                 |
| 9  | Dalam sebulan terakhir, seberapa sering Anda marah karena sesuatu hal yang terjadi di luar kendali Anda?                                                          | 0                | 1                       | 2                 | 3                | 4                 |
| 10 | Dalam sebulan terakhir, seberapa sering Anda merasa segala kesulitan atau masalah menumpuk begitu tinggi sehingga Anda merasa tidak mampu mengatasinya?           | 0                | 1                       | 2                 | 3                | 4                 |

### **Questions JSON Structure**

```json
[
  { "id": 1, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa kecewa/gundah/terganggu karena sesuatu hal yang terjadi di luar harapan/dugaan Anda?", "reverse": false },
  { "id": 2, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa tidak mampu untuk mengontrol hal-hal penting dalam hidup Anda? (contoh: pekerjaan, sekolah, keluarga, ibadah)", "reverse": false },
  { "id": 3, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa gelisah dan stres?", "reverse": false },
  { "id": 4, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa percaya diri bahwa Anda mampu untuk menyelesaikan masalah pribadi Anda?", "reverse": true },
  { "id": 5, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa segala sesuatunya berjalan sesuai keinginan Anda?", "reverse": true },
  { "id": 6, "text": "Dalam sebulan terakhir, seberapa sering Anda menyadari bahwa Anda tidak dapat menyelesaikan semua hal yang harus Anda lakukan?", "reverse": false },
  { "id": 7, "text": "Dalam sebulan terakhir, seberapa sering Anda dapat mengontrol perasaan jengkel atau tidak nyaman yang mengganggu dalam hidup Anda?", "reverse": true },
  { "id": 8, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda berada dalam situasi yang nyaman?", "reverse": true },
  { "id": 9, "text": "Dalam sebulan terakhir, seberapa sering Anda marah karena sesuatu hal yang terjadi di luar kendali Anda?", "reverse": false },
  { "id": 10, "text": "Dalam sebulan terakhir, seberapa sering Anda merasa segala kesulitan atau masalah menumpuk begitu tinggi sehingga Anda merasa tidak mampu mengatasinya?", "reverse": false }
]
```

**Reverse Scoring Rules:**
- **Questions 4, 5, 7, 8 are reverse-scored** (positive items that need to be inverted)
- For reverse-scored questions: `score = 4 - answer`
  - If user selects 0 → score = 4
  - If user selects 1 → score = 3
  - If user selects 2 → score = 2
  - If user selects 3 → score = 1
  - If user selects 4 → score = 0
- **Questions 1, 2, 3, 6, 9, 10 are forward-scored** (use answer value directly)

---

## **4. Scoring Rules**

**Total score = sum of all 10 answers (after applying reverse scoring)**

**Scoring Process:**
1. For forward-scored questions (1, 2, 3, 6, 9, 10): use answer value directly (0-4)
2. For reverse-scored questions (4, 5, 7, 8): calculate `4 - answer` (0→4, 1→3, 2→2, 3→1, 4→0)
3. Sum all 10 scores

**Score Range:**
- Minimum: 0 (all answers = 0, with reverse scoring applied)
- Maximum: 40 (all answers = 4, with reverse scoring applied)
- **Actual range: 0–40** (matches flowchart requirements)

### **Score Categories (Based on Flowchart)**

| Range | Category | Label    | Indonesian Label |
| ----- | -------- | -------- | ---------------- |
| 0–13  | Low      | "rendah" | Rendah           |
| 14–26 | Medium   | "sedang" | Sedang           |
| 27–40 | High     | "berat"  | Berat            |

Cursor must implement category mapping exactly as above.

---

## **5. Business Logic**

### **24-Hour Validity Rule**

* User must complete this quiz **once per 24 hours**.
* Quiz is valid for **1x24 hours** from the time of completion.
* If user completed quiz within the last 24 hours → redirect to homepage (skip quiz).
* If quiz not completed or expired (more than 24 hours ago) → redirect to `/quiz` (block all other routes).

### **Post-Quiz Flow**

Based on assessment score result:

* **Rendah (0-13):**
  * Show recommendations: Deep Breathing Relaxation, Read Mental Health Tips and Education
  * Redirect to `/journal`

* **Sedang (14-26):**
  * Show recommendations: Mindfulness (Meditation, Deep Breathing, Positive Affirmation), Read Mental Health Tips and Education, Consider Consulting a Professional
  * Redirect to `/journal`

* **Berat (27-40):**
  * Show recommendations: Mindfulness (Meditation, Deep Breathing, Positive Affirmation), Read Mental Health Tips and Education
  * Show warning: If severe symptoms appear (severe sleep disorder, feeling unable to control oneself) → immediately seek professional help
  * Show links to Halodoc or Alodokter
  * Redirect to `/consultation`

---

## **6. Database Schema (Supabase)**

### Table: `daily_quiz`

```
id               uuid (pk)
user_id          uuid (fk -> app_users.id)
date             date (unique per user per day)
answers          jsonb (10 items, each having id/value 0-4)
score            int (0-40)
category         text  (rendah | sedang | berat)
created_at       timestamptz (used for 24-hour validity check)
```

**Constraints:**
* `(user_id, date)` must be unique.
* `created_at` timestamp is critical for 24-hour validity calculation.

**24-Hour Check Logic:**
```sql
-- Example query to check if quiz is still valid (within 24 hours)
SELECT * FROM daily_quiz
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 1;
```

---

## **7. Frontend Requirements (for Cursor)**

### **Quiz Page (/quiz)**

* Display 10 questions sequentially or in a single form.
* Radio buttons or segmented control for 0–4 scale (5 options).
* Submit button disabled until all 10 are answered.
* After submit:
  1. Apply reverse scoring to questions 4, 5, 7, 8 (score = 4 - answer).
  2. Sum all 10 scores (after reverse scoring).
  3. Map category (rendah/sedang/berat).
  4. Save to Supabase with `created_at` timestamp.
  5. Show assessment score result with recommendations.
  6. Redirect based on category.

### **Components to generate**

* `QuizQuestionCard`
* `QuizProgressBar` (shows 1/10, 2/10, etc.)
* `QuizNavigationButtons`
* `QuizResultCard` (displays score, category, and recommendations)

---

## **8. Backend Requirements (Cursor)**

### API / server action must:

* Validate 10 answers exist (all values 0-4).
* Apply reverse scoring to questions 4, 5, 7, 8:
  - For each reverse-scored question: `score = 4 - answer`
  - For forward-scored questions: `score = answer`
* Compute final score (sum of all 10 scores after reverse scoring).
* Map to category (rendah/sedang/berat).
* Store into Supabase with `created_at` timestamp.
* Return `{ score, category, recommendations }`.

### Middleware Logic

* Check if user has completed quiz within last 24 hours:
  ```typescript
  const lastQuiz = await getLastQuizWithin24Hours(userId);
  if (lastQuiz && isWithin24Hours(lastQuiz.created_at)) {
    // Allow access to homepage
    return NextResponse.next();
  }
  // Redirect to /quiz
  return NextResponse.redirect('/quiz');
  ```

---

## **9. Differences from Previous Zung Scale**

| Aspect | Zung Scale (Old) | PSS-10 (New) |
|--------|------------------|--------------|
| Questions | 20 | 10 |
| Answer Scale | 1-4 | 0-4 |
| Score Range | 20-80 | 0-40 |
| Categories | normal, sedang, berat, panik | rendah, sedang, berat |
| Validity | Daily (once per day) | 24-hour window (1x24 hours) |
| Reverse Scoring | 5 questions (5, 9, 13, 17, 19) | 4 questions (4, 5, 7, 8) |

---

## **10. Action Items**

1. ✅ **Confirmed:** PSS-10 questions in Indonesian (provided by client)
2. ✅ **Confirmed:** Reverse scoring logic (questions 4, 5, 7, 8 use `4 - answer`)
3. ✅ **Confirmed:** Scoring calculation (0-4 scale, sum after reverse scoring = 0-40 range)
4. **Update quiz-questions.json** with actual PSS-10 questions from section 3
5. **Update database migration** - ensure answers field accepts 0-4 values
6. **Update middleware** to use 24-hour validity check instead of daily check
7. **Implement reverse scoring** in quiz submission logic

