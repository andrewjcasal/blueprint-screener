export interface Database {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assessment_id: string | null
          responses: Array<{
            value: number
            question_id: string
          }>
          scores: {
            depression: number
            mania: number
            anxiety: number
            substanceUse: number
          }
          next: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id?: string | null
          responses: Array<{
            value: number
            question_id: string
          }>
          scores: {
            depression: number
            mania: number
            anxiety: number
            substanceUse: number
          }
          next: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string | null
          responses?: Array<{
            value: number
            question_id: string
          }>
          scores?: {
            depression: number
            mania: number
            anxiety: number
            substanceUse: number
          }
          next?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 