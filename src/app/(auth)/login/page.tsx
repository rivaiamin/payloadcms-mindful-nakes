import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is already logged in, redirect to quiz
  if (user) {
    redirect('/quiz')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 to-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/website-template-OG.webp')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <h2 className="text-4xl font-bold text-primary-foreground">
            Kesehatan Mental Tenaga Kesehatan
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Platform untuk memantau dan menjaga kesehatan mental Anda dengan
            quiz harian, jurnal, dan konten mindfulness yang disesuaikan.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
            <div className="h-px w-12 bg-primary-foreground/30" />
            <span className="text-sm">Dukung kesehatan mental Anda</span>
            <div className="h-px w-12 bg-primary-foreground/30" />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Masuk</h1>
            <p className="text-muted-foreground">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
