export type User = {
  id: string
  email: string
  name: string | null
  phone_number: string | null
  profile_photo_url: string | null
  role: 'user' | 'admin'
  last_quiz_date: string | null
  last_quiz_timestamp: string | null // For 24-hour validity check
  created_at: string
  updated_at: string
}

export type DailyQuiz = {
  id: string
  user_id: string
  date: string
  answers: number[] // Array of 10 numbers (0-4) for PSS-10, with reverse scoring for questions 4, 5, 7, 8
  score: number // Range: 0-40
  category: 'rendah' | 'sedang' | 'berat' // rendah: 0-13, sedang: 14-26, berat: 27-40
  created_at: string // Critical for 24-hour validity check
}

export type Journal = {
  id: string
  user_id: string
  date: string
  title: string | null
  content: string
  mood: number // 1-5
  created_at: string
  updated_at: string
}

// Quiz-related types
export type QuizCategory = 'rendah' | 'sedang' | 'berat'

export type QuizAnswer = {
  questionId: number
  value: number // 0-4
}

export type QuizResult = {
  answers: number[]
  score: number
  category: QuizCategory
  recommendations: string[]
}
