import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware for authentication, route protection, and quiz blocking logic
 *
 * Flow:
 * 1. Exclude PayloadCMS admin and API routes
 * 2. Redirect unauthenticated users to login (except public routes)
 * 3. Redirect authenticated users away from auth pages
 * 4. Block access to protected routes if today's quiz is not completed
 * 5. Admins skip quiz blocking
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. Exclude PayloadCMS admin routes and API routes from auth checks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return response
  }

  // 2. Define route categories
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Routes that are part of the quiz flow - allow access even without completing quiz
  const quizFlowRoutes = ['/quiz', '/consultation', '/journal']
  const isQuizFlowRoute = quizFlowRoutes.some((route) => pathname.startsWith(route))

  // 3. Handle unauthenticated users
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Handle authenticated users trying to access auth pages
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/quiz', request.url))
  }

  // 5. Quiz blocking logic for authenticated users
  if (user && !isPublicRoute) {
    // Check if user is admin - admins skip quiz blocking
    const { data: userData } = await supabase
      .from('app_users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = userData?.role === 'admin'

    // Admins can access all routes without quiz requirement
    if (isAdmin) {
      return response
    }

    // Allow access to quiz flow routes (quiz, consultation, journal)
    if (isQuizFlowRoute) {
      return response
    }

    // For all other protected routes, check if today's quiz is completed
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    const { data: todayQuiz } = await supabase
      .from('daily_quiz')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    // If quiz not completed, redirect to /quiz
    if (!todayQuiz) {
      return NextResponse.redirect(new URL('/quiz', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
