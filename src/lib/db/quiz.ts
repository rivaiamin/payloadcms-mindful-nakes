import { createClient } from '@/lib/supabase/server'
import type { DailyQuiz } from '@/lib/types/database'

export async function getTodayQuiz(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error || !data) {
    return null
  }

  return data as DailyQuiz
}

export async function createQuiz(quizData: {
  user_id: string
  date: string
  answers: number[]
  score: number
  category: 'ringan' | 'sedang' | 'berat'
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('daily_quiz').insert(quizData).select().single()

  return { data: data as DailyQuiz | null, error }
}

export async function getQuizHistory(userId: string, limit = 30) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data || []) as DailyQuiz[]
}

export async function getQuizStats(userId: string, days = 30) {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: true })

  if (error) {
    return []
  }

  return (data || []) as DailyQuiz[]
}
