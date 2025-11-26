'use server'

import { createClient } from '@/lib/supabase/server'
import { createQuiz } from '@/lib/db/quiz'
import {
  processQuizAnswers,
  validateQuizAnswers,
  getRedirectPath,
} from '@/lib/quiz-utils'
import { redirect } from 'next/navigation'

/**
 * Submit quiz answers and create quiz entry in database
 * @param answers - Array of 10 answers (0-4)
 * @returns Quiz result or error
 */
export async function submitQuiz(answers: number[]) {
  try {
    // Validate answers
    const validation = validateQuizAnswers(answers)
    if (!validation.isValid) {
      return { error: validation.error }
    }

    // Get current user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Unauthorized. Please login.' }
    }

    // Process quiz answers
    const result = processQuizAnswers(answers)

    // Create quiz entry
    const today = new Date().toISOString().split('T')[0]
    const { data: quizData, error: dbError } = await createQuiz({
      user_id: user.id,
      date: today,
      answers: result.answers,
      score: result.score,
      category: result.category,
    })

    if (dbError) {
      console.error('Error creating quiz:', dbError)
      return { error: 'Failed to save quiz. Please try again.' }
    }

    return {
      success: true,
      result: {
        ...result,
        id: quizData?.id,
      },
    }
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Get redirect path after quiz completion
 * @param category - Quiz category
 */
export async function redirectAfterQuiz(category: 'rendah' | 'sedang' | 'berat') {
  const path = getRedirectPath(category)
  redirect(path)
}
