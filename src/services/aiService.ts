import type { AIService, OptionalFeatureType, AppError } from '../types'
import { demoAIService } from './demoAIService'

// Demo mode configuration
// Set to true to use demo responses instead of real AI service
// This allows manual testing and demos without a real AI backend
const DEMO_MODE = true // Change to false to use real AI service

// Configuration for AI service
const AI_SERVICE_CONFIG = {
  timeout: 5000, // 5 seconds as per requirement 4.4
  maxRetries: 3,
  retryDelay: 1000, // Start with 1 second delay
}

// Custom error class for AI service errors
export class AIServiceError extends Error {
  public type: 'network' | 'api' | 'timeout' | 'validation';
  public retryable: boolean;

  constructor(
    message: string,
    type: 'network' | 'api' | 'timeout' | 'validation',
    retryable: boolean = false
  ) {
    super(message)
    this.name = 'AIServiceError'
    this.type = type
    this.retryable = retryable
  }
}

// Utility function to create delay for retry logic
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Utility function to create timeout promise
const createTimeoutPromise = (ms: number): Promise<never> => 
  new Promise((_, reject) => 
    setTimeout(() => reject(new AIServiceError('Request timeout', 'timeout', true)), ms)
  )

// Format the prompt based on optional feature mode
const formatPrompt = (question: string, mode?: OptionalFeatureType): string => {
  const basePrompt = question.trim()
  
  switch (mode) {
    case 'explain-simple':
      return `Please explain this in simple terms that a 12-year-old could understand: ${basePrompt}`
    case 'summarize':
      return `Please provide a concise summary of this topic: ${basePrompt}`
    case 'generate-quiz':
      return `Please generate 5 quiz questions about this topic: ${basePrompt}`
    default:
      return basePrompt
  }
}

// Main AI service implementation
export class KiroAIService implements AIService {
  private async makeRequest(prompt: string): Promise<string> {
    // Create the request with timeout
    const requestPromise = fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        timestamp: Date.now(),
      }),
    })

    try {
      // Race between request and timeout
      const response = await Promise.race([
        requestPromise,
        createTimeoutPromise(AI_SERVICE_CONFIG.timeout)
      ])

      if (!response.ok) {
        throw new AIServiceError(
          `AI service responded with status ${response.status}`,
          'api',
          response.status >= 500 // Server errors are retryable
        )
      }

      const data = await response.json()
      
      if (!data.content || typeof data.content !== 'string') {
        throw new AIServiceError(
          'Invalid response format from AI service',
          'api',
          false
        )
      }

      return data.content
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new AIServiceError(
          'Network error: Unable to connect to AI service',
          'network',
          true
        )
      }

      // Handle other errors
      throw new AIServiceError(
        `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'api',
        false
      )
    }
  }

  async generateResponse(question: string, mode?: OptionalFeatureType): Promise<string> {
    // Input validation
    if (!question || typeof question !== 'string') {
      throw new AIServiceError(
        'Question must be a non-empty string',
        'validation',
        false
      )
    }

    const trimmedQuestion = question.trim()
    if (trimmedQuestion.length === 0) {
      throw new AIServiceError(
        'Question cannot be empty or only whitespace',
        'validation',
        false
      )
    }

    if (trimmedQuestion.length > 5000) {
      throw new AIServiceError(
        'Question is too long (maximum 5000 characters)',
        'validation',
        false
      )
    }

    const formattedPrompt = formatPrompt(trimmedQuestion, mode)
    let lastError: AIServiceError | null = null

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= AI_SERVICE_CONFIG.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(formattedPrompt)
        return response
      } catch (error) {
        lastError = error instanceof AIServiceError ? error : new AIServiceError(
          `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'api',
          false
        )

        // Don't retry if error is not retryable or this is the last attempt
        if (!lastError.retryable || attempt === AI_SERVICE_CONFIG.maxRetries) {
          break
        }

        // Wait before retrying with exponential backoff
        const delayMs = AI_SERVICE_CONFIG.retryDelay * Math.pow(2, attempt - 1)
        await delay(delayMs)
      }
    }

    // If we get here, all retries failed
    throw lastError || new AIServiceError('All retry attempts failed', 'api', false)
  }
}

// Create and export a singleton instance
// Use demo service if DEMO_MODE is enabled, otherwise use real service
export const aiService: AIService = DEMO_MODE ? demoAIService : new KiroAIService()

// Export demo mode status for UI indicator
export const isDemoMode = DEMO_MODE

// Error handler utility functions
export const createAppError = (aiError: AIServiceError): AppError => ({
  type: aiError.type,
  message: aiError.message,
  retryable: aiError.retryable,
})

// User-friendly error messages
export const getErrorMessage = (error: AIServiceError): string => {
  switch (error.type) {
    case 'network':
      return 'Unable to connect to the AI service. Please check your internet connection and try again.'
    case 'timeout':
      return 'The request took too long to complete. Please try again.'
    case 'validation':
      return error.message
    case 'api':
      if (error.message.includes('status 429')) {
        return 'Too many requests. Please wait a moment before trying again.'
      }
      if (error.message.includes('status 503')) {
        return 'The AI service is temporarily unavailable. Please try again in a few minutes.'
      }
      return 'The AI service encountered an error. Please try again.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}