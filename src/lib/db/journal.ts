import { createClient } from '@/lib/supabase/server'
import type { Journal } from '@/lib/types/database'

export async function getTodayJournal(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('journal')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error || !data) {
    return null
  }

  return data as Journal
}

export async function createJournal(journalData: {
  user_id: string
  date: string
  title?: string | null
  content: string
  mood: number
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journal')
    .insert(journalData)
    .select()
    .single()

  return { data: data as Journal | null, error }
}

export async function updateJournal(
  journalId: string,
  updates: {
    title?: string | null
    content?: string
    mood?: number
  },
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journal')
    .update(updates)
    .eq('id', journalId)
    .select()
    .single()

  return { data: data as Journal | null, error }
}

export async function getJournalHistory(userId: string, limit = 30) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journal')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data || []) as Journal[]
}

