'use client'

import { useState, useEffect } from 'react'
import { saveJournal } from '@/lib/actions/journal'
import type { Journal, DailyQuiz } from '@/lib/types/database'
import { useRouter } from 'next/navigation'

interface JournalClientProps {
  todayJournal: Journal | null
  journalHistory: Journal[]
  latestQuiz: DailyQuiz | null
}

const MOOD_OPTIONS = [
  { value: 1, label: 'Sangat Buruk', emoji: '😢', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 2, label: 'Buruk', emoji: '😟', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 3, label: 'Netral', emoji: '😐', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 4, label: 'Baik', emoji: '🙂', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 5, label: 'Sangat Baik', emoji: '😊', color: 'bg-blue-100 text-blue-700 border-blue-300' },
]

export default function JournalClient({
  todayJournal,
  journalHistory,
  latestQuiz,
}: JournalClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState(todayJournal?.title || '')
  const [content, setContent] = useState(todayJournal?.content || '')
  const [mood, setMood] = useState<number>(todayJournal?.mood || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isEditing = !!todayJournal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!content.trim()) {
      setError('Konten jurnal tidak boleh kosong.')
      return
    }

    if (!mood || mood < 1 || mood > 5) {
      setError('Silakan pilih mood Anda.')
      return
    }

    setIsSubmitting(true)

    const result = await saveJournal({
      title: title.trim() || undefined,
      content: content.trim(),
      mood,
    })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result.success) {
      setSuccess(result.message || 'Jurnal berhasil disimpan!')
      setIsSubmitting(false)
      // Refresh the page to show updated data
      router.refresh()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const getMoodEmoji = (moodValue: number) => {
    return MOOD_OPTIONS.find((m) => m.value === moodValue)?.emoji || '😐'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jurnal Harian</h1>
          <p className="text-gray-600">Tuliskan perasaan dan pengalaman Anda hari ini</p>
          {latestQuiz && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm text-gray-600">Skor Stres Hari Ini:</span>
              <span
                className={`font-bold ${
                  latestQuiz.category === 'rendah'
                    ? 'text-green-600'
                    : latestQuiz.category === 'sedang'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {latestQuiz.score} ({latestQuiz.category})
              </span>
            </div>
          )}
        </div>

        {/* Journal Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isEditing ? 'Edit Jurnal Hari Ini' : 'Buat Jurnal Baru'}
              </h2>
              <span className="text-sm text-gray-500">
                {formatDate(new Date().toISOString().split('T')[0])}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul (Opsional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Berikan judul untuk jurnal Anda..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Isi Jurnal <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan perasaan, pikiran, atau pengalaman Anda hari ini..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{content.length} karakter</p>
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bagaimana perasaan Anda hari ini? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-3">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mood === option.value
                        ? `${option.color} ring-2 ring-offset-2 ring-purple-500 scale-105`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : isEditing ? 'Perbarui Jurnal' : 'Simpan Jurnal'}
            </button>
          </form>
        </div>

        {/* Journal History */}
        {journalHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Jurnal Sebelumnya</h2>
            <div className="space-y-4">
              {journalHistory.map((journal) => (
                <div
                  key={journal.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {journal.title && (
                        <h3 className="font-semibold text-gray-900 mb-1">{journal.title}</h3>
                      )}
                      <p className="text-sm text-gray-500">{formatDate(journal.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMoodEmoji(journal.mood)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{journal.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
