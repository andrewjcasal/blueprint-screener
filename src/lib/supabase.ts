import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getScreenerData() {
  try {
    const { data } = await supabase.functions.invoke('get-screener')
    return data
  } catch (error) {
    console.error('Error fetching screener data:', error)
    throw error
  }
} 