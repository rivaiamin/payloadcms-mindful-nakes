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

1. Open Supabase SQL Editor (in your Supabase dashboard)
2. Open the migration file: `docs/migrations/001_initial_schema.sql`
3. Copy the entire SQL content
4. Paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Important**: This creates all tables, indexes, RLS policies, and triggers in one go.

**Verification**: After running, check the Table Editor in Supabase to see:
- `users` table
- `daily_quiz` table  
- `journal` table

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

Create `src/data/quiz-questions.json` with all 20 Zung Self Anxiety Rating Scale questions:

```json
[
  { "id": 1, "text": "Saya merasa lebih gelisah dan cemas dari biasanya" },
  { "id": 2, "text": "Saya merasa takut tanpa alasan yang jelas" },
  { "id": 3, "text": "Saya merasa panik" },
  { "id": 4, "text": "Saya merasa tubuh saya seperti hancur berantakan dan akan hancur berkeping-keping" },
  { "id": 5, "text": "Saya merasa semua baik-baik saja dan tidak akan ada hal buruk yang terjadi", "reverse": true },
  { "id": 6, "text": "Kedua tangan dan kaki saya gemetar" },
  { "id": 7, "text": "Saya sering terganggu oleh sakit kepala, leher, dan punggung" },
  { "id": 8, "text": "Saya merasa badan saya lemah dan mudah lelah" },
  { "id": 9, "text": "Saya merasa tenang dan dapat duduk dengan nyaman", "reverse": true },
  { "id": 10, "text": "Saya merasa jantung saya berdebar-debar dengan keras dan cepat" },
  { "id": 11, "text": "Saya sering mengalami pusing" },
  { "id": 12, "text": "Saya sering pingsan atau merasa seperti ingin pingsan" },
  { "id": 13, "text": "Saya dapat bernafas dengan mudah seperti biasanya", "reverse": true },
  { "id": 14, "text": "Saya merasa kaku atau mati rasa dan kesemutan pada jari-jari dan kaki saya" },
  { "id": 15, "text": "Saya merasa sakit perut atau gangguan pencernaan" },
  { "id": 16, "text": "Saya merasa sering kencing daripada biasanya" },
  { "id": 17, "text": "Tangan saya hangat dan kering seperti biasanya", "reverse": true },
  { "id": 18, "text": "Wajah saya terasa panas dan kemerahan" },
  { "id": 19, "text": "Tadi malam saya dapat tidur dan beristirahat pada malam hari dengan tenang", "reverse": true },
  { "id": 20, "text": "Saya mengalami mimpi-mimpi buruk" }
]
```

**Answer Options (4-point Likert scale):**
- `1` = "Tidak pernah" (Never)
- `2` = "Kadang-kadang" (Sometimes)
- `3` = "Sering" (Often)
- `4` = "Selalu" (Always)

**Note:** Questions with `"reverse": true` (items 5, 9, 13, 17, 19) must be reverse-scored when calculating the total score:
- 1 → 4, 2 → 3, 3 → 2, 4 → 1

**Score Categories:**
- 20–44: "normal"
- 45–59: "sedang"
- 60–74: "berat"
- ≥ 75: "panik"

See `docs/QUIZ_ZUNG.md` for complete scoring logic and business rules.

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

- [x] Supabase project created
- [x] Environment variables set
- [x] Database schema created
- [x] RLS policies active
- [x] Supabase client utilities created
- [x] Middleware file created
- [x] Can connect to Supabase (test route works)
- [x] TypeScript types defined

## Next Steps

Once verified, proceed with **Phase 1** from `IMPLEMENTATION_PLAN.md`:
1. Create login/register pages
2. Implement authentication
3. Test auth flow

