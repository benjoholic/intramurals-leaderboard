import { supabase } from './supabase'

/**
 * Get a user's role from the `admin_users` table.
 * Returns the role string (e.g. 'admin'|'coordinator') or null if not found.
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      // If the table doesn't exist or another error, log and return null
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return null
      }
      console.error('Error fetching user role:', error)
      return null
    }

    // `data` may be null if no matching row
    return (data && (data as any).role) ? (data as any).role : null
  } catch (err) {
    console.error('Unexpected error fetching user role:', err)
    return null
  }
}

/**
 * Check if a user is an admin by querying the admin_users table (role === 'admin').
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin'
}

