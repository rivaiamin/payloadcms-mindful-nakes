'use client'

import { useState } from 'react'
import { submitQuiz } from '@/lib/actions/quiz'
import { QUIZ_QUESTIONS, ANSWER_OPTIONS } from '@/lib/quiz-utils'
import type { QuizResult } from '@/lib/types/database'
import { useRouter } from 'next/navigation'

export default function QuizClient() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    // Auto-advance to next question
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1 && answers[currentQuestion] !== -1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmit = async () => {
    // Validate all questions answered
    if (answers.some((a) => a === -1)) {
      setError('Mohon jawab semua pertanyaan sebelum mengirim.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const response = await submitQuiz(answers)

    if (response.error) {
      setError(response.error)
      setIsSubmitting(false)
    } else if (response.success && response.result) {
      setResult(response.result)
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    if (result) {
      const redirectPath = result.category === 'berat' ? '/consultation' : '/journal'
      router.push(redirectPath)
    }
  }

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
  const allAnswered = answers.every((a) => a !== -1)

  // Show result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hasil Penilaian Stres Anda
              </h1>
              <p className="text-gray-600">Perceived Stress Scale (PSS-10)</p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-white text-center">
              <p className="text-sm font-medium mb-2 opacity-90">Skor Total Anda</p>
              <p className="text-6xl font-bold mb-2">{result.score}</p>
              <p className="text-sm opacity-90">dari 40</p>
            </div>

            {/* Category Display */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-gray-600">Kategori:</span>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-lg ${
                    result.category === 'rendah'
                      ? 'bg-green-100 text-green-800'
                      : result.category === 'sedang'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Rekomendasi untuk Anda:
              </h2>
              <ul className="space-y-3">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning for Berat category */}
            {result.category === 'berat' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-red-800 font-semibold mb-1">Perhatian Penting</h3>
                    <p className="text-red-700 text-sm">
                      Tingkat stres Anda tergolong berat. Kami sangat menyarankan Anda untuk
                      berkonsultasi dengan profesional kesehatan mental.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {result.category === 'berat' ? 'Lihat Rekomendasi Konsultasi' : 'Lanjut ke Jurnal'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Penilaian Stres Harian</h1>
          <p className="text-gray-600">Perceived Stress Scale (PSS-10)</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pertanyaan {currentQuestion + 1} dari {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Pertanyaan {currentQuestion + 1}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
              {QUIZ_QUESTIONS[currentQuestion].text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {ANSWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === option.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === option.value
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestion] === option.value && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      answers[currentQuestion] === option.value
                        ? 'text-indigo-900'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            ← Sebelumnya
          </button>

          {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Selanjutnya →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban ✓'}
            </button>
          )}
        </div>

        {/* Answer Summary */}
        <div className="mt-6 bg-white rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-2">Status Jawaban:</p>
          <div className="flex gap-2 flex-wrap">
            {QUIZ_QUESTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                  index === currentQuestion
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                    : answers[index] !== -1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
