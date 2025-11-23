import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client for browser/client-side usage
 * This client is used in Client Components and handles authentication cookies automatically
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
