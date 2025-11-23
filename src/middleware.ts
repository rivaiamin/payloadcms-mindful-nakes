import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  // Exclude PayloadCMS admin routes and API routes from auth checks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return response
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to quiz
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/quiz', request.url))
  }

  // Quiz blocking logic: Check if today's quiz is completed
  if (user && !isPublicRoute) {
    // Routes that are part of the quiz flow - allow access even without quiz
    const quizFlowRoutes = ['/quiz', '/consultation', '/journal']
    const isQuizFlowRoute = quizFlowRoutes.some((route) => pathname.startsWith(route))

    // If not in quiz flow, check if today's quiz is completed
    if (!isQuizFlowRoute) {
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
