import { createClient } from '@/lib/supabase/server'
import type { User } from '@/lib/types/database'

/**
 * Get the current authenticated user from the database
 * @returns User object or null if not authenticated or not found
 */
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

/**
 * Get a user by their ID
 * @param userId - The user's UUID
 * @returns User object or null if not found
 */
export async function getUserById(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('app_users').select('*').eq('id', userId).single()

  if (error || !data) {
    return null
  }

  return data as User
}

/**
 * Update the last quiz date for a user
 * @param userId - The user's UUID
 * @param date - Date string in YYYY-MM-DD format
 * @returns Object with error if any
 */
export async function updateUserLastQuizDate(userId: string, date: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('app_users')
    .update({ last_quiz_date: date })
    .eq('id', userId)

  return { error }
}

/**
 * Get all users (admin only)
 * @param limit - Maximum number of users to return
 * @returns Array of User objects
 */
export async function getAllUsers(limit = 100) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data || []) as User[]
}

/**
 * Get user count (admin only)
 * @returns Total number of users
 */
export async function getUserCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('app_users')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return 0
  }

  return count || 0
}

/**
 * Check if a user is an admin
 * @param userId - The user's UUID
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin(userId: string) {
  const user = await getUserById(userId)
  return user?.role === 'admin'
}
