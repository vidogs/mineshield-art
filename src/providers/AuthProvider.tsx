import React, { useEffect, type ReactNode } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import { useAuthStore } from '../store/authStore'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { User } from '../types'

type AuthProviderProps = {
  children: ReactNode
}

const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User | null => {
  const metadata = supabaseUser.user_metadata || {}
  const providerMetadata = supabaseUser.app_metadata?.provider === 'twitch' 
    ? supabaseUser.user_metadata 
    : null

  // Twitch предоставляет данные в user_metadata
  const twitchData = providerMetadata || metadata

  // Twitch обычно предоставляет: full_name, avatar_url, preferred_username
  // Также может быть: name, picture, user_name
  const name = twitchData.full_name || twitchData.name || supabaseUser.email?.split('@')[0] || 'User'
  const avatar = twitchData.avatar_url || twitchData.picture || ''
  const handle = twitchData.preferred_username || twitchData.user_name || twitchData.name || name.toLowerCase().replace(/\s+/g, '')

  return {
    id: supabaseUser.id,
    name,
    avatar,
    handle,
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setSession, setIsLoading, resetAuthState } = useAuthStore()
  const supabase = useSupabase()

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        setIsLoading(false)
        return
      }

      if (session?.user) {
        setSession(session)
        const user = mapSupabaseUserToUser(session.user)
        setUser(user)
      } else {
        resetAuthState()
      }
      setIsLoading(false)
    })

    // Подписываемся на изменения авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setSession(session)
          const user = mapSupabaseUserToUser(session.user)
          setUser(user)
        }
      } else if (event === 'SIGNED_OUT') {
        resetAuthState()
      } else if (event === 'USER_UPDATED') {
        if (session?.user) {
          const user = mapSupabaseUserToUser(session.user)
          setUser(user)
        }
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser, setSession, setIsLoading, resetAuthState])

  // Автоматический рефреш токена обрабатывается Supabase автоматически
  // через настройки autoRefreshToken: true в конфигурации клиента

  return <>{children}</>
}

// Хук для использования авторизации
export const useAuth = () => {
  const { user, session, isLoading } = useAuthStore()
  const supabase = useSupabase()

  const signInWithTwitch = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in with Twitch:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user,
    session,
    isLoading,
    signInWithTwitch,
    signOut,
    isAuthenticated: !!user && !!session,
  }
}

