import React, { useMemo, type ReactNode } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SupabaseContext } from './SupabaseContext'
import { useConfig } from '../hooks/useConfig'

type SupabaseProviderProps = {
  children: ReactNode
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const config = useConfig()

  const supabaseClient = useMemo<SupabaseClient>(() => {
    return createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }, [config.supabaseUrl, config.supabaseAnonKey])

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  )
}

