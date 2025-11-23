export type User = {
  id: string
  email: string
  name: string | null
  role: 'user' | 'admin'
  last_quiz_date: string | null
  created_at: string
  updated_at: string
}

export type DailyQuiz = {
  id: string
  user_id: string
  date: string
  answers: number[] // Array of 10 numbers (1-5)
  score: number
  category: 'ringan' | 'sedang' | 'berat'
  created_at: string
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
