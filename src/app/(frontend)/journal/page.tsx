import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTodayJournal, getJournalHistory } from '@/lib/db/journal'
import { getValidQuizWithin24Hours } from '@/lib/db/quiz'
import JournalClient from '@/app/(frontend)/journal/JournalClient'

export default async function JournalPage() {
  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/journal')
  }

  // Get today's journal if exists
  const todayJournal = await getTodayJournal(user.id)

  // Get recent journal history
  const journalHistory = await getJournalHistory(user.id, 5)

  // Get latest quiz to show context
  const latestQuiz = await getValidQuizWithin24Hours(user.id)

  return (
    <JournalClient
      todayJournal={todayJournal}
      journalHistory={journalHistory}
      latestQuiz={latestQuiz}
    />
  )
}
