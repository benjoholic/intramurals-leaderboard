# Admin Role Management Scripts

## Setting a User as Admin

Use the `set-admin-role.ts` script to promote a registered user to admin status.

### Prerequisites

1. **Install tsx** (if not already installed):
   ```bash
   npm install -D tsx
   ```

2. **Environment Variables**: Ensure your `.env.local` file contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   For best results (especially if RLS is enabled), also add:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   
   You can find the service role key in your Supabase dashboard under Settings → API.

3. **Database Setup**: Ensure the `admin_users` table exists. If it doesn't, run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE admin_users (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
     PRIMARY KEY (id)
   );

   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Admins can view their own data" 
   ON admin_users FOR SELECT 
   USING (auth.uid() = id);

   -- Allow service role to insert (for this script)
   CREATE POLICY "Service role can insert admins" 
   ON admin_users FOR INSERT 
   WITH CHECK (true);
   ```

### Usage

```bash
npx tsx scripts/set-admin-role.ts <user-email>
```

### Example

```bash
npx tsx scripts/set-admin-role.ts user@example.com
```

### What the Script Does

1. Looks up the user by email in Supabase Auth
2. Checks if the user is already an admin
3. If not, adds the user to the `admin_users` table
4. Confirms the operation was successful

### Troubleshooting

**Error: "User not found"**
- Make sure the user has registered and confirmed their email
- Check that the email address is correct

**Error: "admin_users table does not exist"**
- Run the SQL provided in the Prerequisites section

**Error: "Permission denied" or RLS errors**
- Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file
- The service role key bypasses RLS policies

**Error: "Missing Supabase environment variables"**
- Ensure `.env.local` exists in the project root
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set correctly

