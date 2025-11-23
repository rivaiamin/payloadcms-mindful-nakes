import { createClient } from '@/lib/supabase/server'
import type { User } from '@/lib/types/database'

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  const { data: user, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error || !user) {
    return null
  }

  return user as User
}

export async function getUserById(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as User
}

export async function updateUserLastQuizDate(userId: string, date: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('app_users')
    .update({ last_quiz_date: date })
    .eq('id', userId)

  return { error }
}

