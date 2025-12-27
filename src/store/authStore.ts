import { create } from 'zustand'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { User } from '../types'

type AuthState = {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setIsLoading: (isLoading: boolean) => void
  resetAuthState: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set(() => ({ user })),
  setSession: (session) => set(() => ({ session })),
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  resetAuthState: () =>
    set(() => ({
      user: null,
      session: null,
      isLoading: false,
    })),
}))

