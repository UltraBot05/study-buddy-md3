import { useState } from 'react'
import type { Response, OptionalFeatureType, AppError } from './types'
import { aiService, AIServiceError, getErrorMessage } from './services/aiService'
import Header from './components/Header'
import QuestionInput from './components/QuestionInput'
import ResponseDisplay from './components/ResponseDisplay'
import LoadingIndicator from './components/LoadingIndicator'
import ErrorDisplay from './components/ErrorDisplay'
import './App.css'

function App() {
  // State management for the AI Study Assistant
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<AppError | null>(null)
  const [lastQuestion, setLastQuestion] = useState<{ question: string; mode?: OptionalFeatureType } | null>(null)

  // Handler for question submission
  const handleQuestionSubmit = async (question: string, mode?: OptionalFeatureType) => {
    if (!question.trim()) {
      setError({
        type: 'validation',
        message: 'Please enter a question',
        retryable: false
      })
      return
    }

    // Store the question for retry functionality
    setLastQuestion({ question, mode })
    
    setIsLoading(true)
    setError(null)

    const startTime = Date.now()

    try {
      // Use the AI service to generate response
      const content = await aiService.generateResponse(question, mode)
      
      const processingTime = Date.now() - startTime
      
      const newResponse: Response = {
        id: Date.now().toString(),
        questionId: Date.now().toString(),
        content,
        timestamp: Date.now(),
        mode: mode,
        processingTime
      }
      
      setResponses(prev => [...prev, newResponse])
      setIsLoading(false)
      setError(null)
    } catch (err) {
      setIsLoading(false)
      if (err instanceof AIServiceError) {
        setError({
          type: err.type,
          message: getErrorMessage(err),
          retryable: err.retryable
        })
      } else {
        setError({
          type: 'api',
          message: 'An unexpected error occurred. Please try again.',
          retryable: true
        })
      }
    }
  }

  // Handler for retry functionality
  const handleRetry = () => {
    if (lastQuestion) {
      handleQuestionSubmit(lastQuestion.question, lastQuestion.mode)
    }
  }

  return (
    <div className="app">
      <Header />
      
      <main className="app-main">
        <div className="question-section">
          <QuestionInput 
            onSubmit={handleQuestionSubmit}
            isLoading={isLoading}
            error={error ? error.message : null}
          />
        </div>

        <div className="response-section">
          {/* Error display */}
          <ErrorDisplay error={error} onRetry={handleRetry} />
          
          {/* Loading indicator */}
          <LoadingIndicator isVisible={isLoading} />
          
          {/* Response display with conversation history */}
          <ResponseDisplay responses={responses} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}

export default App
