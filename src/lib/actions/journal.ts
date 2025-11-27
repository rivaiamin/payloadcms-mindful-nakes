'use server'

import { createClient } from '@/lib/supabase/server'
import {
  createJournal,
  updateJournal,
  getTodayJournal,
  getJournalHistory,
} from '@/lib/db/journal'
import { revalidatePath } from 'next/cache'

/**
 * Save journal entry (create or update if exists for today)
 * @param formData - Journal form data
 * @returns Success status or error
 */
export async function saveJournal(formData: {
  title?: string
  content: string
  mood: number
  date?: string
}) {
  try {
    // Validate inputs
    if (!formData.content || formData.content.trim() === '') {
      return { error: 'Konten jurnal tidak boleh kosong.' }
    }

    if (!formData.mood || formData.mood < 1 || formData.mood > 5) {
      return { error: 'Mood harus dipilih (1-5).' }
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

    // Use provided date or today
    const date = formData.date || new Date().toISOString().split('T')[0]

    // Check if journal exists for this date
    const existingJournal = await getTodayJournal(user.id)

    let result

    if (existingJournal) {
      // Update existing journal
      result = await updateJournal(existingJournal.id, {
        title: formData.title || null,
        content: formData.content,
        mood: formData.mood,
      })
    } else {
      // Create new journal
      result = await createJournal({
        user_id: user.id,
        date,
        title: formData.title || null,
        content: formData.content,
        mood: formData.mood,
      })
    }

    if (result.error) {
      console.error('Error saving journal:', result.error)
      return { error: 'Gagal menyimpan jurnal. Silakan coba lagi.' }
    }

    // Revalidate the journal page
    revalidatePath('/journal')

    return {
      success: true,
      journal: result.data,
      message: existingJournal ? 'Jurnal berhasil diperbarui!' : 'Jurnal berhasil disimpan!',
    }
  } catch (error) {
    console.error('Error in saveJournal:', error)
    return { error: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}

/**
 * Get journal history for current user
 * @param limit - Number of entries to fetch
 */
export async function fetchJournalHistory(limit = 10) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const journals = await getJournalHistory(user.id, limit)

    return { success: true, journals }
  } catch (error) {
    console.error('Error fetching journal history:', error)
    return { error: 'Failed to fetch journal history' }
  }
}
