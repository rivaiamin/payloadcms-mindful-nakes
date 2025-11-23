import { createClient } from '@/lib/supabase/server'
import type { Journal } from '@/lib/types/database'

/**
 * Get today's journal entry for a user
 * @param userId - The user's UUID
 * @returns Journal object or null if not found
 */
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

/**
 * Get a journal entry by date for a user
 * @param userId - The user's UUID
 * @param date - Date string in YYYY-MM-DD format
 * @returns Journal object or null if not found
 */
export async function getJournalByDate(userId: string, date: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journal')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  if (error || !data) {
    return null
  }

  return data as Journal
}

/**
 * Get a journal entry by ID
 * @param journalId - The journal entry's UUID
 * @returns Journal object or null if not found
 */
export async function getJournalById(journalId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('journal').select('*').eq('id', journalId).single()

  if (error || !data) {
    return null
  }

  return data as Journal
}

/**
 * Create a new journal entry
 * @param journalData - Journal data object
 * @returns Object with created journal data and error if any
 */
export async function createJournal(journalData: {
  user_id: string
  date: string
  title?: string | null
  content: string
  mood: number
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('journal').insert(journalData).select().single()

  return { data: data as Journal | null, error }
}

/**
 * Update a journal entry
 * @param journalId - The journal entry's UUID
 * @param updates - Fields to update
 * @returns Object with updated journal data and error if any
 */
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

/**
 * Delete a journal entry
 * @param journalId - The journal entry's UUID
 * @returns Object with error if any
 */
export async function deleteJournal(journalId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('journal').delete().eq('id', journalId)

  return { error }
}

/**
 * Get journal history for a user
 * @param userId - The user's UUID
 * @param limit - Maximum number of journals to return
 * @returns Array of Journal objects
 */
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

/**
 * Get all journals (admin only)
 * @param limit - Maximum number of journals to return
 * @returns Array of Journal objects
 */
export async function getAllJournals(limit = 100) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journal')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data || []) as Journal[]
}

/**
 * Get journals for a specific user (admin only)
 * @param userId - The user's UUID
 * @param limit - Maximum number of journals to return
 * @returns Array of Journal objects
 */
export async function getJournalsByUserId(userId: string, limit = 100) {
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
