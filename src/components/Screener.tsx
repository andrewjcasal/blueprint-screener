import { useState, useEffect } from 'react'
import { ScreenerQuestion } from './ScreenerQuestion'
import { getScreenerData } from '../lib/supabase'
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

export function Screener() {
  const [screenerData, setScreenerData] = useState<ScreenerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  
  useEffect(() => {
    async function loadScreenerData() {
      try {
        const data = await getScreenerData()
        setScreenerData(data)
      } catch (err) {
        setError('Failed to load screener data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadScreenerData()
  }, [])
  
  if (loading) return <div className="loading">Loading screener...</div>
  if (error) return <div className="error">{error}</div>
  if (!screenerData) return <div className="error">No screener data available</div>
  
  const section = screenerData.content.sections[0]
  const questions = section.questions
  const currentQuestion = questions[currentQuestionIndex]
  
  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0
  
  const handleSubmit = () => {
    // Here you would handle the submission of all answers
    console.log('All answers:', answers)
    alert('Screener completed! Check console for results.')
  }
  
  return (
    <div className="screener-container">
      <div className="screener-header">
        <h2>{screenerData.full_name}</h2>
        <p className="section-title">{section.title}</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
      
      <div className="navigation-buttons">
        {!isFirstQuestion && (
          <button className="prev-button" onClick={goToPrevQuestion}>
            Previous
          </button>
        )}
        
        {!isLastQuestion ? (
          <button 
            className="next-button" 
            onClick={goToNextQuestion}
            disabled={!answers[currentQuestion.question_id]}
          >
            Next
          </button>
        ) : (
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
} 