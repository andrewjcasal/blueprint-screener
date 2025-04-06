import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

type Answer = {
  value: number
  question_id: string
}

type AnswerSubmission = {
  answers: Answer[]
}

serve(async (req) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }
  
  // Handle OPTIONS request (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    })
  }
  
  // Handle POST request
  if (req.method === 'POST') {
    try {
      const submission = await req.json() as AnswerSubmission
      
      // Here you could store the answers in Supabase database
      // or perform any other processing/validation
      
      // Log answers for debugging
      console.log('Received answers:', submission.answers)
      
      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Answers submitted successfully',
          data: submission
        }),
        {
          status: 200,
          headers
        }
      )
    } catch (error) {
      console.error('Error processing submission:', error)
      
      // Return error response
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error processing submission',
          error: error.message
        }),
        {
          status: 400,
          headers
        }
      )
    }
  }
  
  // Return method not allowed for other request types
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Method not allowed'
    }),
    {
      status: 405,
      headers
    }
  )
}) 