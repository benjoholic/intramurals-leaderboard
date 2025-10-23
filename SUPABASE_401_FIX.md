# 🔧 Fixing the 401 Error

## What's Happening?

The **401 Unauthorized** error you're seeing is **NORMAL** and **EXPECTED**! 

Your Supabase connection is working perfectly ✅ (I can see it's reaching your Supabase project). The 401 just means you're trying to log in with credentials that don't exist yet.

## The Solution (2 Minutes)

### 1. Go to Supabase Dashboard
Open: https://app.supabase.com → Select your project

### 2. Create Your First User
- Click **"Authentication"** in the left sidebar
- Click **"Users"** tab
- Click **"Add user"** (green button)
- Fill in:
  - **Email**: `admin@intramurals.edu`
  - **Password**: `Admin123!` (or any password you want)
  - **Toggle ON**: "Auto Confirm User" ⚠️ IMPORTANT
- Click **"Create user"**

### 3. Try Logging In Again
- Go to: http://localhost:3000/admin/login
- Enter the email and password you just created
- You should now be able to log in! 🎉

---

## Test Your Setup

I've created a diagnostic page for you:

👉 Visit: **http://localhost:3000/admin/login/test-connection**

This will show you:
- ✅ If your environment variables are set
- ✅ If Supabase connection is working
- ✅ What to do next

---

## Why the 401 Error?

Think of it like this:
- ✅ Your app can talk to Supabase (connection works)
- ❌ But you're trying to use a username/password that doesn't exist
- 👉 Solution: Create the user first!

It's like trying to unlock a door with a key that hasn't been made yet.

---

## Alternative: Disable Email Confirmation

If you keep getting errors about unconfirmed emails:

1. Go to: **Authentication** → **Settings** → **Auth Providers**
2. Find **"Email"** provider
3. Scroll to **"Email Confirmations"**
4. Toggle **OFF**: "Enable email confirmations"
5. Click **"Save"**

This is fine for development. Re-enable it for production!

---

## Still Not Working?

Check these:

1. **Environment Variables Set?**
   - Look in your `.env.local` file
   - Should have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - If you just added them, **restart your dev server**

2. **User Created Successfully?**
   - Go to Supabase → Authentication → Users
   - Your user should be listed there
   - Status should be "Confirmed"

3. **Correct Credentials?**
   - Double-check email and password
   - They're case-sensitive!

---

## Quick Reference

```bash
# If you changed .env.local, restart server:
# Press Ctrl+C to stop the server
npm run dev

# Test connection page:
http://localhost:3000/admin/login/test-connection

# Login page:
http://localhost:3000/admin/login
```

---

You're almost there! The hard part (Supabase setup) is done. Just create a user and you're good to go! 🚀

