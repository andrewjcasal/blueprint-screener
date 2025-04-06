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

type Answer = {
  value: number
  question_id: string
}

export async function submitAnswers(answers: Record<string, number>) {
  try {
    // Convert the answers object to the expected format
    const formattedAnswers = Object.entries(answers).map(([question_id, value]) => ({
      question_id,
      value
    }))

    const { data, error } = await supabase.functions.invoke('submit-answers', {
      method: 'POST',
      body: {
        answers: formattedAnswers
      }
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error submitting answers:', error)
    throw error
  }
} 