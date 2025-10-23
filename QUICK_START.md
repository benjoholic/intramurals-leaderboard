# 🚀 Quick Start Guide - Create Your First Admin User

## The 401 Error You're Seeing

The **401 Unauthorized** error means your Supabase connection is working, but the credentials are invalid. This is expected if you haven't created a user yet!

## Step-by-Step Setup (5 minutes)

### Step 1: Verify Your Supabase Project URL ✅

Your Supabase project URL appears to be: `rkrqcwbqolbpkjoqerpn.supabase.co`

This is working! The connection is successful.

---

### Step 2: Create Your First Admin User

Go to your Supabase dashboard and follow these steps:

#### Option A: Using the Dashboard (Easiest - Recommended)

1. **Navigate to Authentication**
   - Open your Supabase dashboard: https://app.supabase.com
   - Select your project
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

2. **Add a New User**
   - Click the **"Add user"** button (green button in top right)
   - Choose **"Create new user"**
   - Enter your admin email (e.g., `admin@intramurals.edu`)
   - Enter a strong password
   - **IMPORTANT**: Toggle **"Auto Confirm User"** to ON (this skips email confirmation)
   - Click **"Create user"**

3. **Test Login**
   - Go back to your app: `http://localhost:3000/admin/login`
   - Use the email and password you just created
   - You should now be able to log in!

---

#### Option B: Using SQL Editor (Alternative)

1. **Go to SQL Editor**
   - In Supabase dashboard, click on "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run This SQL**
   ```sql
   -- Create a new admin user (replace with your email/password)
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     recovery_sent_at,
     last_sign_in_at,
     raw_app_meta_data,
     raw_user_meta_data,
     created_at,
     updated_at,
     confirmation_token,
     email_change,
     email_change_token_new,
     recovery_token
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'admin@intramurals.edu',  -- Change this to your email
     crypt('Admin123!', gen_salt('bf')),  -- Change this to your password
     NOW(),
     NOW(),
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{}',
     NOW(),
     NOW(),
     '',
     '',
     '',
     ''
   );
   ```

3. **Click "Run"** and the user will be created

---

### Step 3: Disable Email Confirmation (For Testing)

If you want to skip email confirmation during development:

1. Go to **Authentication** → **Settings** → **Auth Providers**
2. Find **Email** provider
3. Scroll down to **"Email Confirmations"**
4. Toggle **"Enable email confirmations"** to **OFF**
5. Click **"Save"**

**Note**: Re-enable this in production for security!

---

### Step 4: Test Your Login

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/admin/login`

3. Enter your credentials:
   - Email: `admin@intramurals.edu` (or whatever you used)
   - Password: Your password

4. You should see:
   - ✅ Success toast notification
   - ✅ Redirect to `/admin/dashboard`

---

## Common Issues & Solutions

### Issue: "Invalid login credentials"
**Solution**: 
- Double-check your email and password
- Make sure the user was created successfully
- Check if email confirmation is required

### Issue: "Email not confirmed"
**Solution**: 
- Either confirm the email through the link sent
- OR disable email confirmation (see Step 3 above)

### Issue: "Failed to fetch" or Network Error
**Solution**:
- Check your `.env.local` file has correct Supabase URL and key
- Restart your dev server after changing `.env.local`
- Make sure you have internet connection

### Issue: Still can't log in
**Solution**:
1. Check browser console for detailed error messages
2. Go to Supabase dashboard → Authentication → Users
3. Verify the user exists and is confirmed
4. Try creating a new user
5. Make sure your Supabase project is not paused

---

## Quick Test Credentials

For testing purposes, you can use:
- **Email**: `admin@intramurals.edu`
- **Password**: `Admin123!` (or whatever you set)

---

## Next Steps After Login

Once logged in, you'll see the admin dashboard with:
- ✅ Stats overview
- ✅ Quick actions
- ✅ Sign out button
- ✅ Your email displayed

From there, you can start building out your admin features!

---

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Check Supabase dashboard logs (Authentication → Logs)
3. Verify your environment variables are correct
4. Make sure your dev server restarted after adding env vars

Your Supabase connection is already working - you just need to create a user! 🎉

