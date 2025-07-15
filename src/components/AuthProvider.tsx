"use client"

import { SessionProvider, useSession } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Simple useAuth hook for compatibility
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    profile: session?.user || null,
    loading: status === 'loading',
    signInWithGoogle: async () => {},
    signOut: async () => {},
    refreshProfile: async () => {}
  };
}
