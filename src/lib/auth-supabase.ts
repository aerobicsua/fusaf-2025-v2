// Mock auth functions (Supabase removed)

// Mock client-side auth functions
export const useSupabaseAuth = () => {
  return {
    signInWithGoogle: async () => null,
    signOut: async () => {},
    getUser: async () => null,
    getSession: async () => null,
    supabase: null,
  }
}

// Mock user profile functions
export const getUserProfile = async (userId: string) => {
  return null
}

export const upsertUserProfile = async (user: any) => {
  return null
}

// Type definitions
export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'athlete' | 'club_owner' | 'coach_judge' | 'admin'
  phone?: string
  date_of_birth?: string
  city?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
