import { useState, useEffect } from 'react'
import { ScreenerQuestion } from './ScreenerQuestion'
import { getScreenerData, submitAnswers } from "../lib/supabase"
import '../styles/Screener.css'

type Answer = {
  title: string
  value: number
}

type Question = {
  question_id: string
  title: string
}

type Section = {
  type: string
  title: string
  answers: Answer[]
  questions: Question[]
}

type ScreenerData = {
  id: string
  name: string
  disorder: string
  content: {
    sections: Section[]
    display_name: string
  }
  full_name: string
}

type DomainScores = {
  depression: number
  mania: number
  anxiety: number
  substanceUse: number
}

type SubmissionResult = {
  id?: string
  scores: DomainScores
  results: string[]
  nextIds: string[]
}

export function Screener() {
  const [screenerData, setScreenerData] = useState<ScreenerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [assessmentResults, setAssessmentResults] =
    useState<SubmissionResult | null>(null)

  useEffect(() => {
    async function loadScreenerData() {
      try {
        const data = await getScreenerData()
        setScreenerData(data)
      } catch (err) {
        setError("Failed to load screener data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadScreenerData()
  }, [])

  if (loading) {
    return (
      <div className="screener-container" style={{ margin: "0 auto" }}>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading screener...</p>
        </div>
      </div>
    )
  }

  if (error)
    return (
      <div className="screener-container">
        <div className="error-container">
          <p className="error">{error}</p>
        </div>
      </div>
    )

  if (!screenerData)
    return (
      <div className="screener-container">
        <div className="error-container">
          <p className="error">No screener data available</p>
        </div>
      </div>
    )

  const section = screenerData.content.sections[0]
  const questions = section.questions
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))

    // Add a small delay before advancing to next question or submitting
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        // This is the last question, submit automatically
        try {
          setSubmitting(true)
          const result = await submitAnswers({
            ...answers,
            [questionId]: value,
          })

          if (result && result.data) {
            setAssessmentResults(result.data as SubmissionResult)
          }
          setSubmitSuccess(true)
        } catch (err) {
          console.error("Error submitting answers:", err)
          setError("Failed to submit answers. Please try again.")
        } finally {
          setSubmitting(false)
        }
      }
    }, 500)
  }

  // If submission was successful, show assessment results
  if (submitSuccess) {
    return (
      <div className="screener-container">
        <div className="results-container">
          <h2 className="results-title">Screener Results</h2>

          {assessmentResults?.id && (
            <div className="submission-id">
              Submission ID:{" "}
              <span className="id-value">{assessmentResults.id}</span>
            </div>
          )}

          {assessmentResults && (
            <>
              <div className="scores-table">
                <table>
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Total Score</th>
                      <th>Level-2 Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={
                        assessmentResults.scores.depression >= 2
                          ? "threshold-met"
                          : ""
                      }
                    >
                      <td>Depression</td>
                      <td>{assessmentResults.scores.depression}</td>
                      <td>
                        {assessmentResults.scores.depression >= 2
                          ? "PHQ-9"
                          : "-"}
                      </td>
                    </tr>
                    <tr
                      className={
                        assessmentResults.scores.mania >= 2
                          ? "threshold-met"
                          : ""
                      }
                    >
                      <td>Mania</td>
                      <td>{assessmentResults.scores.mania}</td>
                      <td>
                        {assessmentResults.scores.mania >= 2 ? "ASRM" : "-"}
                      </td>
                    </tr>
                    <tr
                      className={
                        assessmentResults.scores.anxiety >= 2
                          ? "threshold-met"
                          : ""
                      }
                    >
                      <td>Anxiety</td>
                      <td>{assessmentResults.scores.anxiety}</td>
                      <td>
                        {assessmentResults.scores.anxiety >= 2 ? "PHQ-9" : "-"}
                      </td>
                    </tr>
                    <tr
                      className={
                        assessmentResults.scores.substanceUse >= 1
                          ? "threshold-met"
                          : ""
                      }
                    >
                      <td>Substance Use</td>
                      <td>{assessmentResults.scores.substanceUse}</td>
                      <td>
                        {assessmentResults.scores.substanceUse >= 1
                          ? "ASSIST"
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {assessmentResults.results.length > 0 ? (
                <div className="recommendations">
                  <h3>Recommended Level-2 Assessments:</h3>
                  <ul className="assessment-list">
                    {assessmentResults.results.map((assessment, index) => (
                      <li key={assessment} className="assessment-item">
                        {assessment}
                        {assessmentResults.nextIds &&
                          assessmentResults.nextIds[index] && (
                            <span className="assessment-id">
                              (ID:{" "}
                              {assessmentResults.nextIds[index].slice(0, 8)})
                            </span>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="no-recommendations">
                  <p>No Level-2 assessments recommended at this time.</p>
                </div>
              )}
            </>
          )}

          <div className="completion-message">
            <p>Thank you for completing the screener.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screener-container">
      <div className="screener-header">
        <h2>
          {screenerData.content.display_name}: {screenerData.full_name}
        </h2>
        <p className="section-title">{section.title}</p>
      </div>

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <ScreenerQuestion
        question={currentQuestion}
        answers={section.answers}
        onAnswer={handleAnswer}
        selectedValue={answers[currentQuestion.question_id]}
      />
    </div>
  )
} 