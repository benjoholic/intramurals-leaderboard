/**
 * Script to set a registered user's role as admin
 * 
 * Usage:
 *   npx tsx scripts/set-admin-role.ts <user-email>
 * 
 * Example:
 *   npx tsx scripts/set-admin-role.ts user@example.com
 * 
 * Prerequisites:
 *   1. Install tsx: npm install -D tsx
 *   2. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL
 *   3. For best results, add SUPABASE_SERVICE_ROLE_KEY to .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const envFile = readFileSync(envPath, 'utf-8')
    const envVars: Record<string, string> = {}
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    })
    
    Object.assign(process.env, envVars)
  } catch (error) {
    console.warn('⚠️  Could not load .env.local, using process.env')
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL is set in .env.local')
  console.error('For admin operations, SUPABASE_SERVICE_ROLE_KEY is recommended (but ANON_KEY will work if RLS allows)')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setUserAsAdmin(email: string) {
  try {
    console.log(`\n🔍 Looking up user: ${email}...`)

    // First, get the user by email from auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error fetching users:', listError.message)
      process.exit(1)
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found`)
      console.error('\n💡 Make sure the user has registered and confirmed their email address.')
      process.exit(1)
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`)

    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('id', user.id)
      .single()

    if (existingAdmin && !checkError) {
      console.log(`⚠️  User "${email}" is already an admin`)
      console.log(`   Admin record: ${existingAdmin.email}`)
      return
    }

    // Insert user into admin_users table
    console.log(`\n🔧 Setting user as admin...`)
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        id: user.id,
        email: user.email || email
      })
      .select()
      .single()

    if (error) {
      // Check if the table doesn't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.error('\n❌ Error: admin_users table does not exist')
        console.error('\n📝 Please create the table first by running this SQL in your Supabase SQL Editor:')
        console.error(`
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
        `)
        process.exit(1)
      }
      
      console.error('❌ Error setting user as admin:', error.message)
      console.error('   Error code:', error.code)
      process.exit(1)
    }

    console.log(`\n✅ Success! User "${email}" is now an admin`)
    console.log(`   Admin ID: ${data.id}`)
    console.log(`   Email: ${data.email}`)
    console.log(`\n🎉 The user can now log in through the admin portal at /admin/login`)

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

// Main execution
const email = process.argv[2]

if (!email) {
  console.error('❌ Error: Email address is required')
  console.error('\nUsage:')
  console.error('  npx tsx scripts/set-admin-role.ts <user-email>')
  console.error('\nExample:')
  console.error('  npx tsx scripts/set-admin-role.ts user@example.com')
  process.exit(1)
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  console.error(`❌ Error: "${email}" is not a valid email address`)
  process.exit(1)
}

setUserAsAdmin(email)
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

