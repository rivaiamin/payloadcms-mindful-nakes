import { createClient } from '@/lib/supabase/server'
import type { DailyQuiz } from '@/lib/types/database'

/**
 * Get today's quiz for a user
 * @param userId - The user's UUID
 * @returns DailyQuiz object or null if not found
 */
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

/**
 * Get a quiz by date for a user
 * @param userId - The user's UUID
 * @param date - Date string in YYYY-MM-DD format
 * @returns DailyQuiz object or null if not found
 */
export async function getQuizByDate(userId: string, date: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  if (error || !data) {
    return null
  }

  return data as DailyQuiz
}

/**
 * Create a new quiz entry
 * @param quizData - Quiz data object
 * @returns Object with created quiz data and error if any
 */
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

/**
 * Get quiz history for a user
 * @param userId - The user's UUID
 * @param limit - Maximum number of quizzes to return
 * @returns Array of DailyQuiz objects
 */
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

/**
 * Get quiz statistics for a user over a specified number of days
 * @param userId - The user's UUID
 * @param days - Number of days to look back
 * @returns Array of DailyQuiz objects ordered by date ascending
 */
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

/**
 * Get all quizzes (admin only)
 * @param limit - Maximum number of quizzes to return
 * @returns Array of DailyQuiz objects
 */
export async function getAllQuizzes(limit = 100) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data || []) as DailyQuiz[]
}

/**
 * Get today's quizzes for all users (admin only)
 * @returns Array of DailyQuiz objects
 */
export async function getTodayQuizzes() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_quiz')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return (data || []) as DailyQuiz[]
}

/**
 * Get quiz statistics aggregated by category for today (admin only)
 * @returns Object with counts for each category
 */
export async function getTodayQuizStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase.from('daily_quiz').select('category').eq('date', today)

  if (error || !data) {
    return {
      ringan: 0,
      sedang: 0,
      berat: 0,
      total: 0,
    }
  }

  const stats = {
    ringan: data.filter((q) => q.category === 'ringan').length,
    sedang: data.filter((q) => q.category === 'sedang').length,
    berat: data.filter((q) => q.category === 'berat').length,
    total: data.length,
  }

  return stats
}

/**
 * Get average quiz score for today (admin only)
 * @returns Average score or 0 if no quizzes
 */
export async function getTodayAverageScore() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase.from('daily_quiz').select('score').eq('date', today)

  if (error || !data || data.length === 0) {
    return 0
  }

  const sum = data.reduce((acc, quiz) => acc + quiz.score, 0)
  return Math.round((sum / data.length) * 100) / 100 // Round to 2 decimal places
}
