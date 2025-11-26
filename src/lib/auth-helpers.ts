import { supabase } from './supabase'

/**
 * Check if a user is an admin by querying the admin_users table
 * @param userId - The user's UUID
 * @returns true if user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      // If the table doesn't exist or there's an error, return false
      if (error.code === 'PGRST116' || error.code === '42P01') {
        // No rows returned or table doesn't exist - user is not an admin
        return false
      }
      console.error('Error checking admin status:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

