import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import "../styles/SubmissionsTable.css"
import { SubmissionRow } from "./SubmissionRow"

type Assessment = {
  id: string
  name: string
}

export type Submission = {
  id: string
  created_at: string
  scores: {
    depression: number
    mania: number
    anxiety: number
    substanceUse: number
  }
  next: string[] // Array of assessment IDs
}

export function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assessments, setAssessments] = useState<Record<string, string>>({}) // Map of ID to name
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch all assessments first to build the ID-to-name mapping
        const { data: assessmentData, error: assessmentError } = await supabase
          .from("assessments")
          .select("id, name")

        if (assessmentError) {
          throw new Error(
            `Error fetching assessments: ${assessmentError.message}`
          )
        }

        // Build the assessment mapping
        const assessmentMap: Record<string, string> = {}
        assessmentData?.forEach((assessment: Assessment) => {
          assessmentMap[assessment.id] = assessment.name
        })

        setAssessments(assessmentMap)

        // Now fetch the submissions
        const { data: submissionData, error: submissionError } = await supabase
          .from("submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (submissionError) {
          throw new Error(
            `Error fetching submissions: ${submissionError.message}`
          )
        }

        setSubmissions(submissionData || [])
      } catch (err) {
        console.error("Error loading data:", err)
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="submissions-container">
      <h2>Assessment Submissions</h2>

      <div className="table-container" style={{ minHeight: "500px" }}>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="no-data-container">
            <p className="no-data">No submissions found</p>
          </div>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Date</th>
                <th>Depression</th>
                <th>Mania</th>
                <th>Anxiety</th>
                <th>Substance Use</th>
                <th>Recommended Assessments</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  assessments={assessments}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
