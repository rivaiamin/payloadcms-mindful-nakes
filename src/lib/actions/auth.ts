'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Format email tidak valid' }
  }

  // Validate password length
  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || null,
      },
    },
  })

  if (error) {
    // Translate common Supabase errors to Indonesian
    let errorMessage = error.message
    if (error.message.includes('already registered')) {
      errorMessage = 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.'
    } else if (error.message.includes('invalid email')) {
      errorMessage = 'Format email tidak valid'
    } else if (error.message.includes('password')) {
      errorMessage = 'Password terlalu lemah. Gunakan password yang lebih kuat.'
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi nanti.'
    }
    return { error: errorMessage }
  }

  if (!data.user) {
    return { error: 'Gagal membuat akun. Silakan coba lagi.' }
  }

  // Note: app_users record is automatically created by database trigger
  // when auth.users record is created. No manual insert needed.
  // The trigger handles RLS bypass using SECURITY DEFINER.

  revalidatePath('/', 'layout')
  redirect('/quiz')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Translate common Supabase errors to Indonesian
    let errorMessage = error.message
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Email atau password salah. Silakan coba lagi.'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda.'
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi nanti.'
    } else if (error.message.includes('User not found')) {
      errorMessage = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.'
    }
    return { error: errorMessage }
  }

  revalidatePath('/', 'layout')
  redirect('/quiz')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
