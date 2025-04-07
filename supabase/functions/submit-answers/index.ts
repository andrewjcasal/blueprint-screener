import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Answer = {
  value: number
  question_id: string
}

type AnswerSubmission = {
  answers: Answer[]
}

// Define domains and their related questions
const domainQuestions = {
  depression: ['question_a', 'question_b'],
  mania: ['question_c', 'question_d'],
  anxiety: ['question_e', 'question_f', 'question_g'],
  substanceUse: ['question_h']
}

// Define scoring thresholds for domains
const domainThresholds = {
  depression: 2,
  mania: 2,
  anxiety: 2,
  substanceUse: 1
}

// Define level-2 assessments for each domain
const domainAssessments = {
  depression: 'PHQ-9',
  mania: 'ASRM',
  anxiety: 'PHQ-9',
  substanceUse: 'ASSIST'
}

// Initialize Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
      
      // Score the answers by domain
      const domainScores = {
        depression: 0,
        mania: 0,
        anxiety: 0,
        substanceUse: 0
      }
      
      // Calculate scores for each domain
      submission.answers.forEach(answer => {
        if (domainQuestions.depression.includes(answer.question_id)) {
          domainScores.depression += answer.value
        }
        if (domainQuestions.mania.includes(answer.question_id)) {
          domainScores.mania += answer.value
        }
        if (domainQuestions.anxiety.includes(answer.question_id)) {
          domainScores.anxiety += answer.value
        }
        if (domainQuestions.substanceUse.includes(answer.question_id)) {
          domainScores.substanceUse += answer.value
        }
      })
      
      // Determine which level-2 assessments are needed based on thresholds
      const recommendedAssessments: string[] = []
      
      if (domainScores.depression >= domainThresholds.depression) {
        recommendedAssessments.push(domainAssessments.depression)
      }
      
      if (domainScores.mania >= domainThresholds.mania) {
        recommendedAssessments.push(domainAssessments.mania)
      }
      
      if (domainScores.anxiety >= domainThresholds.anxiety) {
        recommendedAssessments.push(domainAssessments.anxiety)
      }
      
      if (domainScores.substanceUse >= domainThresholds.substanceUse) {
        recommendedAssessments.push(domainAssessments.substanceUse)
      }
      
      // Remove duplicates from recommended assessments
      const uniqueAssessments = [...new Set(recommendedAssessments)]
      
      // Get the assessment IDs for the next assessments
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('id, name')
        .in('name', uniqueAssessments)
      
      if (assessmentError) {
        throw new Error(`Error fetching assessment IDs: ${assessmentError.message}`)
      }
      
      // Map assessment names to their IDs
      const assessmentIdMap = assessmentData?.reduce((acc, curr) => {
        acc[curr.name] = curr.id
        return acc
      }, {} as Record<string, string>) || {}
      
      // Create next assessment IDs array
      const nextAssessmentIds = uniqueAssessments.map(name => assessmentIdMap[name]).filter(Boolean)
      
      // Store submission in database
      // For the initial submission, we're setting the assessment_id to null
      // since this is the initial screener, not a specific assessment
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          assessment_id: null, // Initial screener has no specific assessment
          responses: submission.answers,
          scores: domainScores,
          next: nextAssessmentIds
        })
        .select()
      
      if (submissionError) {
        throw new Error(`Error storing submission: ${submissionError.message}`)
      }
      
      // Return success response with scores and recommended assessments
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Answers scored and stored successfully',
          data: {
            id: submissionData?.[0]?.id,
            scores: domainScores,
            results: uniqueAssessments,
            nextIds: nextAssessmentIds
          }
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