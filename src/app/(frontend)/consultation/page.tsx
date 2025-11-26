import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getValidQuizWithin24Hours } from '@/lib/db/quiz'
import { redirect } from 'next/navigation'

export default async function ConsultationPage() {
  // Get current user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get latest quiz to show score
  const latestQuiz = await getValidQuizWithin24Hours(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-red-600"
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
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rekomendasi Konsultasi Profesional
            </h1>
            {latestQuiz && (
              <p className="text-gray-600">
                Skor stres Anda: <span className="font-bold text-red-600">{latestQuiz.score}</span>{' '}
                (Kategori: <span className="font-bold">Berat</span>)
              </p>
            )}
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-3">⚠️ Perhatian Penting</h2>
            <p className="text-red-700 mb-4">
              Hasil penilaian menunjukkan tingkat stres Anda tergolong <strong>berat</strong>.
              Kami sangat menyarankan Anda untuk segera berkonsultasi dengan profesional kesehatan
              mental.
            </p>
            <p className="text-red-700 font-semibold">
              Jika Anda mengalami gejala berat seperti:
            </p>
            <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
              <li>Gangguan tidur yang parah</li>
              <li>Merasa tidak mampu mengontrol diri</li>
              <li>Pikiran untuk menyakiti diri sendiri</li>
              <li>Kesulitan menjalankan aktivitas sehari-hari</li>
            </ul>
            <p className="text-red-700 font-bold mt-4">
              → Segera cari bantuan profesional!
            </p>
          </div>

          {/* Professional Help Links */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Platform Konsultasi Online
            </h2>
            <p className="text-gray-600 mb-6">
              Anda dapat berkonsultasi dengan psikolog atau psikiater profesional melalui platform
              berikut:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Halodoc */}
              <a
                href="https://www.halodoc.com/kesehatan-mental"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Halodoc</h3>
                </div>
                <p className="text-green-50 mb-3">
                  Konsultasi dengan psikolog dan psikiater bersertifikat
                </p>
                <div className="flex items-center text-white font-semibold">
                  <span>Buka Halodoc</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>

              {/* Alodokter */}
              <a
                href="https://www.alodokter.com/cari-rumah-sakit/psikologi"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Alodokter</h3>
                </div>
                <p className="text-blue-50 mb-3">
                  Temukan psikolog dan fasilitas kesehatan mental terdekat
                </p>
                <div className="flex items-center text-white font-semibold">
                  <span>Buka Alodokter</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Mindfulness Recommendations */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sambil Menunggu Konsultasi
            </h2>
            <p className="text-gray-600 mb-4">
              Sambil menunggu jadwal konsultasi, Anda dapat mencoba aktivitas mindfulness berikut
              untuk membantu meredakan stres:
            </p>

            <div className="grid gap-3">
              <Link
                href="/mindfulness/meditation"
                className="flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border-2 border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Meditasi Singkat</h3>
                  <p className="text-sm text-gray-600">Tenangkan pikiran dengan meditasi terpandu</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/mindfulness/breathing"
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border-2 border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Relaksasi Nafas Dalam</h3>
                  <p className="text-sm text-gray-600">Teknik pernapasan untuk menenangkan diri</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/mindfulness/tips"
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border-2 border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Tips Kesehatan Mental</h3>
                  <p className="text-sm text-gray-600">Artikel dan edukasi mengatasi stres</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Continue to Journal */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/journal"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Lanjut ke Jurnal Harian
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
