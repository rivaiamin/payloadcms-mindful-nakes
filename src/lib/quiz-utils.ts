import quizQuestions from '@/data/quiz-questions.json'

/**
 * PSS-10 Quiz Constants and Utilities
 */

// Answer options for PSS-10 (0-4 scale)
export const ANSWER_OPTIONS = [
  { value: 0, label: 'Tidak Pernah' },
  { value: 1, label: 'Hampir Tidak Pernah' },
  { value: 2, label: 'Kadang-Kadang' },
  { value: 3, label: 'Cukup Sering' },
  { value: 4, label: 'Sangat Sering' },
] as const

// Quiz questions with reverse scoring flags
export const QUIZ_QUESTIONS = quizQuestions

// Questions that need reverse scoring (4, 5, 7, 8)
export const REVERSE_SCORED_QUESTIONS = [4, 5, 7, 8]

// Category thresholds
export const CATEGORY_THRESHOLDS = {
  rendah: { min: 0, max: 13 },
  sedang: { min: 14, max: 26 },
  berat: { min: 27, max: 40 },
} as const

export type QuizCategory = 'rendah' | 'sedang' | 'berat'

export interface QuizQuestion {
  id: number
  text: string
  reverse: boolean
}

export interface QuizAnswer {
  questionId: number
  value: number // 0-4
}

export interface QuizResult {
  answers: number[]
  score: number
  category: QuizCategory
  recommendations: string[]
}

/**
 * Calculate score for a single answer with reverse scoring if needed
 * @param questionId - Question ID (1-10)
 * @param answer - Answer value (0-4)
 * @returns Calculated score
 */
export function calculateAnswerScore(questionId: number, answer: number): number {
  const isReverse = REVERSE_SCORED_QUESTIONS.includes(questionId)
  return isReverse ? 4 - answer : answer
}

/**
 * Calculate total quiz score from answers
 * @param answers - Array of 10 answers (0-4)
 * @returns Total score (0-40)
 */
export function calculateTotalScore(answers: number[]): number {
  if (answers.length !== 10) {
    throw new Error('Quiz must have exactly 10 answers')
  }

  return answers.reduce((total, answer, index) => {
    const questionId = index + 1 // Questions are 1-indexed
    return total + calculateAnswerScore(questionId, answer)
  }, 0)
}

/**
 * Determine category based on score
 * @param score - Total score (0-40)
 * @returns Category (rendah, sedang, berat)
 */
export function getCategoryFromScore(score: number): QuizCategory {
  if (score >= CATEGORY_THRESHOLDS.berat.min && score <= CATEGORY_THRESHOLDS.berat.max) {
    return 'berat'
  }
  if (score >= CATEGORY_THRESHOLDS.sedang.min && score <= CATEGORY_THRESHOLDS.sedang.max) {
    return 'sedang'
  }
  return 'rendah'
}

/**
 * Get recommendations based on category
 * @param category - Quiz category
 * @returns Array of recommendation strings
 */
export function getRecommendations(category: QuizCategory): string[] {
  switch (category) {
    case 'rendah':
      return [
        'Relaksasi Nafas Dalam',
        'Baca Tips dan Edukasi Kesehatan Mental',
      ]
    case 'sedang':
      return [
        'Mindfulness (Meditasi, Relaksasi Nafas Dalam, Afirmasi Positif)',
        'Baca Tips dan Edukasi Kesehatan Mental',
        'Pertimbangkan untuk Berkonsultasi dengan Profesional',
      ]
    case 'berat':
      return [
        'Mindfulness (Meditasi, Relaksasi Nafas Dalam, Afirmasi Positif)',
        'Baca Tips dan Edukasi Kesehatan Mental',
        'PERINGATAN: Jika gejala berat muncul (gangguan tidur parah, merasa tidak mampu mengontrol diri) → segera cari bantuan profesional',
        'Hubungi Halodoc atau Alodokter untuk konsultasi profesional',
      ]
  }
}

/**
 * Get redirect path based on category
 * @param category - Quiz category
 * @returns Path to redirect to
 */
export function getRedirectPath(category: QuizCategory): string {
  return category === 'berat' ? '/consultation' : '/journal'
}

/**
 * Process quiz answers and return complete result
 * @param answers - Array of 10 answers (0-4)
 * @returns Complete quiz result with score, category, and recommendations
 */
export function processQuizAnswers(answers: number[]): QuizResult {
  const score = calculateTotalScore(answers)
  const category = getCategoryFromScore(score)
  const recommendations = getRecommendations(category)

  return {
    answers,
    score,
    category,
    recommendations,
  }
}

/**
 * Validate quiz answers
 * @param answers - Array of answers to validate
 * @returns Validation result with isValid flag and error message
 */
export function validateQuizAnswers(answers: number[]): {
  isValid: boolean
  error?: string
} {
  if (!Array.isArray(answers)) {
    return { isValid: false, error: 'Answers must be an array' }
  }

  if (answers.length !== 10) {
    return { isValid: false, error: 'Quiz must have exactly 10 answers' }
  }

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i]
    if (typeof answer !== 'number' || answer < 0 || answer > 4) {
      return {
        isValid: false,
        error: `Answer ${i + 1} must be a number between 0 and 4`,
      }
    }
  }

  return { isValid: true }
}
