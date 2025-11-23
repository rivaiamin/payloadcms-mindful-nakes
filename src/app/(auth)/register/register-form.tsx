'use client'

import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password !== confirmPassword) {
        setError('Password tidak cocok. Pastikan kedua password sama.')
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter')
        setIsLoading(false)
        return
      }

      const result = await signUp(formData)

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, redirect happens in server action
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Terjadi kesalahan</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nama
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Nama lengkap"
          disabled={isLoading}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nama@example.com"
          required
          disabled={isLoading}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          disabled={isLoading}
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">
          Minimal 6 karakter
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Konfirmasi Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          className="bg-background"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" className="text-primary-foreground" />
            Memproses...
          </span>
        ) : (
          'Daftar'
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Sudah punya akun? </span>
        <a
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Masuk
        </a>
      </div>
    </form>
  )
}

