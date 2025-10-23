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

