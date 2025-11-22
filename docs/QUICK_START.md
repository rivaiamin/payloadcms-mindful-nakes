# Quick Start Guide

## Step 1: Install Supabase Dependencies

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

## Step 2: Set Up Environment Variables

Create `.env.local` in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PayloadCMS (already exists)
DATABASE_URI=your_postgres_connection_string
PAYLOAD_SECRET=your_payload_secret
```

## Step 3: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `.env.local`
4. Get service role key from Settings → API

## Step 4: Set Up Database Schema

1. Open Supabase SQL Editor
2. Copy SQL from `docs/DATABASE_SCHEMA.md`
3. Run all SQL scripts in order:
   - Create `users` table
   - Create `daily_quiz` table
   - Create `journal` table
   - Create indexes
   - Create RLS policies
   - Create triggers

## Step 5: Create Supabase Client Utilities

Create these files:

### `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

## Step 6: Create Quiz Questions Data

Create `src/data/quiz-questions.json`:

```json
[
  {
    "id": 1,
    "question": "Saya merasa cemas tentang pekerjaan hari ini",
    "type": "anxiety"
  },
  {
    "id": 2,
    "question": "Saya mengalami kesulitan tidur karena memikirkan pekerjaan",
    "type": "sleep"
  }
  // ... add 8 more questions
]
```

## Step 7: Create TypeScript Types

Create `src/lib/types/database.ts` (copy from `docs/DATABASE_SCHEMA.md`)

## Step 8: Test Supabase Connection

Create a test page or API route to verify connection:

```typescript
// app/api/test-supabase/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select('count')

  return Response.json({ data, error })
}
```

## Step 9: Set Up Middleware

Create `src/middleware.ts`:

```typescript
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TODO: Add quiz blocking logic here
  // TODO: Add route protection logic here

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
```

## Step 10: Install Chart Library (Optional, for later)

```bash
pnpm add recharts
# or
pnpm add chart.js react-chartjs-2
```

## Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Database schema created
- [ ] RLS policies active
- [ ] Supabase client utilities created
- [ ] Middleware file created
- [ ] Can connect to Supabase (test route works)
- [ ] TypeScript types defined

## Next Steps

Once verified, proceed with **Phase 1** from `IMPLEMENTATION_PLAN.md`:
1. Create login/register pages
2. Implement authentication
3. Test auth flow

