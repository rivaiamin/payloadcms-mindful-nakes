# ✅ **ZUNG SELF-ANXIETY SCALE — DOCUMENTATION FOR CURSOR**

## **1. Quiz Name**

**Zung Self Anxiety Rating Scale (ZSAS)**
20 questions, 4-point Likert answers.

---

# **2. Answer Options (Fixed)**

| Option Label    | Value | Meaning   |
| --------------- | ----- | --------- |
| "Tidak pernah"  | 1     | Never     |
| "Kadang-kadang" | 2     | Sometimes |
| "Sering"        | 3     | Often     |
| "Selalu"        | 4     | Always    |

Use **numeric values 1–4** only.

These values must be stored exactly as integers in Supabase.

---

# **3. Questions List (Structured)**

Store these as constant JSON (used by frontend + backend):

```json
[
  { "id": 1, "text": "Saya merasa lebih gelisah dan cemas dari biasanya" },
  { "id": 2, "text": "Saya merasa takut tanpa alasan yang jelas" },
  { "id": 3, "text": "Saya merasa panik" },
  { "id": 4, "text": "Saya merasa tubuh saya seperti hancur berantakan dan akan hancur berkeping-keping" },
  { "id": 5, "text": "Saya merasa semua baik-baik saja dan tidak akan ada hal buruk yang terjadi", "reverse": true },
  { "id": 6, "text": "Kedua tangan dan kaki saya gemetar" },
  { "id": 7, "text": "Saya sering terganggu oleh sakit kepala, leher, dan punggung" },
  { "id": 8, "text": "Saya merasa badan saya lemah dan mudah lelah" },
  { "id": 9, "text": "Saya merasa tenang dan dapat duduk dengan nyaman", "reverse": true },
  { "id": 10, "text": "Saya merasa jantung saya berdebar-debar dengan keras dan cepat" },
  { "id": 11, "text": "Saya sering mengalami pusing" },
  { "id": 12, "text": "Saya sering pingsan atau merasa seperti ingin pingsan" },
  { "id": 13, "text": "Saya dapat bernafas dengan mudah seperti biasanya", "reverse": true },
  { "id": 14, "text": "Saya merasa kaku atau mati rasa dan kesemutan pada jari-jari dan kaki saya" },
  { "id": 15, "text": "Saya merasa sakit perut atau gangguan pencernaan" },
  { "id": 16, "text": "Saya merasa sering kencing daripada biasanya" },
  { "id": 17, "text": "Tangan saya hangat dan kering seperti biasanya", "reverse": true },
  { "id": 18, "text": "Wajah saya terasa panas dan kemerahan" },
  { "id": 19, "text": "Tadi malam saya dapat tidur dan beristirahat pada malam hari dengan tenang", "reverse": true },
  { "id": 20, "text": "Saya mengalami mimpi-mimpi buruk" }
]
```

Notes:

* There are **5 reverse-scored items**: 5, 9, 13, 17, 19.
* For reverse scoring:

  * 1 → 4
  * 2 → 3
  * 3 → 2
  * 4 → 1

Cursor should implement this automatically when computing the score.

---

# **4. Scoring Rules**

Total score = sum of 20 answers (after applying reverse scoring).
Minimum: **20**
Maximum: **80**

### **Score Categories**

| Range | Category         | Label    |
| ----- | ---------------- | -------- |
| 20–44 | Normal           | "normal" |
| 45–59 | Anxiety Moderate | "sedang" |
| 60–74 | Anxiety Severe   | "berat"  |
| ≥ 75  | Panic            | "panik"  |

Cursor must implement category mapping exactly as above.

---

# **5. Business Logic**

### **Daily Rule**

* User must complete this quiz **once per day**.
* All other pages except `/quiz` must be locked until the quiz is done.

### **Post-Quiz Flow**

* If category = **normal/sedang/berat** → redirect to `/journal`
* If category = **panik** → redirect to `/consultation`

---

# **6. Database Schema (Supabase)**

### Table: `daily_quiz`

```
id               uuid (pk)
user_id          uuid (fk -> users.id)
date             date (unique per user)
answers          jsonb (20 items, each having id/value)
score            int
category         text  (normal | sedang | berat | panik)
created_at       timestamp
```

Constraints:

* `(user_id, date)` must be unique.

---

# **7. Frontend Requirements (for Cursor)**

### **Quiz Page (/quiz)**

* Display 20 questions sequentially or in a single form.
* Radio buttons or segmented control for 1–4.
* Submit button disabled until all 20 are answered.
* After submit:

  1. Compute reversed items.
  2. Sum score.
  3. Map category.
  4. Save to Supabase.
  5. Redirect based on category.

### **Components to generate**

* `QuizQuestionCard`
* `QuizProgressBar`
* `QuizNavigationButtons`

---

# **8. Backend Requirements (Cursor)**

### API / server action must:

* Validate 20 answers exist.
* Apply reverse scoring.
* Compute final score.
* Store into Supabase.
* Return `{ score, category }`.
