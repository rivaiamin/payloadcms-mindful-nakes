# Database Migrations

## How to Run Migrations

### For Supabase (Remote)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file (e.g., `001_initial_schema.sql`)
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Migration Files

- `001_initial_schema.sql` - Initial schema setup (users, daily_quiz, journal tables)

## Verification

After running the migration, verify the tables were created:

1. Go to **Table Editor** in Supabase
2. You should see:
   - `users` table
   - `daily_quiz` table
   - `journal` table

Or run this SQL to check:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'daily_quiz', 'journal');
```

## Troubleshooting

### Error: "relation already exists"
- The table already exists. The migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to re-run.

### Error: "permission denied"
- Make sure you're using the SQL Editor (not the API)
- Check that your Supabase project has the correct permissions

### Error: "column does not exist"
- Make sure you ran the migration completely
- Check that all CREATE TABLE statements executed successfully

