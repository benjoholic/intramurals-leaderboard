# Supabase Setup Instructions

## Prerequisites
1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Where to find these values:
1. Go to your Supabase project dashboard
2. Click on the "Settings" icon (gear icon) in the sidebar
3. Navigate to "API" section
4. Copy the following:
   - **Project URL** → Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

### Create Admin Users Table (Optional)
If you want to restrict admin access to specific users, you can create a custom table:

```sql
-- Create admin_users table
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read their own data
CREATE POLICY "Admins can view their own data" 
ON admin_users FOR SELECT 
USING (auth.uid() = id);
```

### Create Admin Check Function
```sql
-- Function to check if user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Authentication Setup

1. In your Supabase dashboard, go to "Authentication" → "Providers"
2. Enable "Email" provider
3. Configure email templates if needed
4. Optionally, disable email confirmation for testing (not recommended for production)

## Create Your First Admin User

You can create admin users in two ways:

### Option 1: Through Supabase Dashboard
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email and password
4. After creating the user, go to SQL Editor and run:
```sql
INSERT INTO admin_users (id, email) 
VALUES ('user-uuid-here', 'admin@example.com');
```

### Option 2: Through SQL Editor
```sql
-- This will create a user and add them to admin_users
-- Replace with your desired email and password
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin@intramurals.edu',
  crypt('your-password', gen_salt('bf')),
  NOW()
);
```

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong passwords for admin accounts
- Enable Multi-Factor Authentication (MFA) in production
- Regularly rotate your Supabase API keys
- Set up Row Level Security (RLS) policies for all tables

## Troubleshooting

If you encounter authentication errors:
1. Check that your environment variables are correctly set
2. Restart your Next.js development server after updating `.env.local`
3. Verify that the Email authentication provider is enabled in Supabase
4. Check the browser console and network tab for detailed error messages

## Database Tables Required by the App

The backend API routes expect two tables in your Supabase database: `teams` and `events`.
If you see an error like:

```
{"error":"Could not find the table 'public.teams' in the schema cache"}
```

it means the table does not exist yet. Run the SQL below in the Supabase SQL Editor (Dashboard → SQL Editor) to create them.

```sql
-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

Notes:
- The server code calls `select('*')` on these tables and expects `id`, `name` (teams) and `title`, `date`, `location` (events).
- If you prefer UUIDs, change the `id` definitions to `UUID DEFAULT gen_random_uuid()` (you'll need the pgcrypto extension).

## Row-Level Security (RLS) and Policies

If RLS is enabled on your database tables, anonymous (public) requests using the anon key will be denied unless you add policies. For quick testing you can disable RLS for those tables, or add permissive policies:

```sql
-- Disable RLS (not recommended for production)
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- OR create simple policies to allow public selects/inserts (testing only)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_public" ON public.teams FOR SELECT USING (true);
CREATE POLICY "allow_insert_public" ON public.teams FOR INSERT WITH CHECK (true);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_public" ON public.events FOR SELECT USING (true);
CREATE POLICY "allow_insert_public" ON public.events FOR INSERT WITH CHECK (true);
```

Security recommendation:
- For production, do NOT use the anon key for privileged server operations. Use a Service Role key on the server only and keep it secret (not exposed to the browser). If you will perform writes from server-side API routes, create a server Supabase client in a secure file using `process.env.SUPABASE_SERVICE_ROLE_KEY`.

## Quick test after creating tables

From your local machine you can test the API routes with curl (replace host if different):

```powershell
# List teams
curl http://localhost:3000/api/teams

# Create a team
curl -X POST http://localhost:3000/api/teams -H "Content-Type: application/json" -d '{"name":"Test Team","color":"#ff0000"}'
```

If the POST succeeds you'll get the created row back. If you still see a table-not-found error, make sure you ran the SQL in the correct Supabase project and schema (`public`).

-- If you added `department` and `event` fields in the UI, make sure the columns exist in the `teams` table. You can run these ALTER statements in the Supabase SQL editor, or apply the migration file `supabase/migrations/002_add_team_department_event.sql` that was added to the repository:

```sql
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS event TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo TEXT;
```

After running the ALTER statements, re-run the failing request (create/update) from the UI or via curl.

