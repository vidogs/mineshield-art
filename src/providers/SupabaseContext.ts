import { type Context, createContext } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

export const SupabaseContext: Context<SupabaseClient | undefined> =
  createContext<SupabaseClient | undefined>(undefined)

