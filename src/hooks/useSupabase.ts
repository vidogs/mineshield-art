import { useContext } from 'react'
import { SupabaseContext } from '../providers/SupabaseContext'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabase(): SupabaseClient {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase должен вызываться внутри <SupabaseProvider>')
  }
  return context
}

