import { useState } from 'react'

type Answer = {
  title: string
  value: number
}

type Question = {
  question_id: string
  title: string
}

type ScreenerQuestionProps = {
  question: Question
  answers: Answer[]
  onAnswer: (questionId: string, value: number) => void
  selectedValue?: number
}

export function ScreenerQuestion({ 
  question, 
  answers, 
  onAnswer,
  selectedValue 
}: ScreenerQuestionProps) {
  return (
    <div className="screener-question">
      <h3 className="question-title">{question.title}</h3>
      
      <div className="answer-options">
        {answers.map((answer) => (
          <div 
            key={answer.value} 
            className={`answer-option ${selectedValue === answer.value ? 'selected' : ''}`}
            onClick={() => onAnswer(question.question_id, answer.value)}
          >
            <div className="answer-radio">
              <div className={`radio-inner ${selectedValue === answer.value ? 'checked' : ''}`} />
            </div>
            <div className="answer-text">
              <p>{answer.title}</p>
              <span className="answer-value">{answer.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 