import type { AIService, OptionalFeatureType } from '../types'
import { AIServiceError } from './aiService'

// Configuration for mock responses
export interface MockAIServiceConfig {
  responseDelay: number;
  errorRate: number; // 0-1, probability of error
  timeoutRate: number; // 0-1, probability of timeout
  networkErrorRate: number; // 0-1, probability of network error
  customResponses?: Map<string, string>;
  enableRetryTesting: boolean;
}

// Default configuration for testing
const DEFAULT_CONFIG: MockAIServiceConfig = {
  responseDelay: 100, // 100ms delay for testing
  errorRate: 0,
  timeoutRate: 0,
  networkErrorRate: 0,
  enableRetryTesting: false,
}

// Mock response templates based on mode
const RESPONSE_TEMPLATES = {
  'explain-simple': (question: string) => 
    `Here's a simple explanation for "${question}": This is a basic concept that can be understood by thinking of it like everyday things you already know. The key points are easy to remember and apply.`,
  
  'summarize': (question: string) => 
    `Summary of "${question}": Key points include the main concepts, important details, and practical applications. This covers the essential information you need to know.`,
  
  'generate-quiz': (question: string) => 
    `Quiz questions for "${question}":
1. What is the main concept behind this topic?
2. How does this apply in real-world situations?
3. What are the key benefits or advantages?
4. What challenges might you encounter?
5. How does this relate to other similar concepts?`,
  
  'default': (question: string) => 
    `This is a comprehensive explanation for "${question}". The topic involves several important aspects that are worth understanding. Here are the key concepts and how they work together to form a complete picture of the subject.`
}

/**
 * Mock AI Service for testing purposes
 * Provides configurable responses, delays, and error simulation
 */
export class MockAIService implements AIService {
  private config: MockAIServiceConfig
  private callCount: number = 0
  private retryAttempts: Map<string, number> = new Map()

  constructor(config: Partial<MockAIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Update configuration for different test scenarios
  updateConfig(newConfig: Partial<MockAIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Reset internal state for clean testing
  reset(): void {
    this.callCount = 0
    this.retryAttempts.clear()
  }

  // Get call statistics for testing
  getStats() {
    return {
      callCount: this.callCount,
      retryAttempts: new Map(this.retryAttempts)
    }
  }

  async generateResponse(question: string, mode?: OptionalFeatureType): Promise<string> {
    this.callCount++
    
    // Input validation (same as real service)
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

    // Track retry attempts for testing
    const requestKey = `${trimmedQuestion}-${mode || 'default'}`
    const currentAttempts = this.retryAttempts.get(requestKey) || 0
    this.retryAttempts.set(requestKey, currentAttempts + 1)

    // Simulate processing delay
    if (this.config.responseDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.config.responseDelay))
    }

    // Simulate timeout errors
    if (Math.random() < this.config.timeoutRate) {
      throw new AIServiceError('Request timeout', 'timeout', true)
    }

    // Simulate network errors
    if (Math.random() < this.config.networkErrorRate) {
      throw new AIServiceError(
        'Network error: Unable to connect to AI service',
        'network',
        true
      )
    }

    // Simulate API errors
    if (Math.random() < this.config.errorRate) {
      // Randomly choose error type
      const errorTypes = [
        { type: 'api' as const, message: 'AI service responded with status 500', retryable: true },
        { type: 'api' as const, message: 'AI service responded with status 429', retryable: false },
        { type: 'api' as const, message: 'AI service responded with status 503', retryable: true },
        { type: 'api' as const, message: 'Invalid response format from AI service', retryable: false },
      ]
      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)]
      throw new AIServiceError(errorType.message, errorType.type, errorType.retryable)
    }

    // Check for custom responses first
    if (this.config.customResponses?.has(trimmedQuestion)) {
      return this.config.customResponses.get(trimmedQuestion)!
    }

    // Generate response based on mode
    const template = mode ? RESPONSE_TEMPLATES[mode] : RESPONSE_TEMPLATES.default
    return template(trimmedQuestion)
  }

  // Utility methods for testing specific scenarios

  // Configure for successful responses
  configureForSuccess(delay: number = 100): void {
    this.updateConfig({
      responseDelay: delay,
      errorRate: 0,
      timeoutRate: 0,
      networkErrorRate: 0,
    })
  }

  // Configure for network errors
  configureForNetworkErrors(errorRate: number = 1): void {
    this.updateConfig({
      responseDelay: 50,
      errorRate: 0,
      timeoutRate: 0,
      networkErrorRate: errorRate,
    })
  }

  // Configure for API errors
  configureForAPIErrors(errorRate: number = 1): void {
    this.updateConfig({
      responseDelay: 50,
      errorRate: errorRate,
      timeoutRate: 0,
      networkErrorRate: 0,
    })
  }

  // Configure for timeout errors
  configureForTimeouts(timeoutRate: number = 1): void {
    this.updateConfig({
      responseDelay: 50,
      errorRate: 0,
      timeoutRate: timeoutRate,
      networkErrorRate: 0,
    })
  }

  // Configure for retry testing
  configureForRetryTesting(): void {
    this.updateConfig({
      responseDelay: 50,
      errorRate: 0.7, // 70% chance of error on first attempts
      timeoutRate: 0,
      networkErrorRate: 0.3, // 30% chance of network error
      enableRetryTesting: true,
    })
  }

  // Add custom response for specific question
  addCustomResponse(question: string, response: string): void {
    if (!this.config.customResponses) {
      this.config.customResponses = new Map()
    }
    this.config.customResponses.set(question.trim(), response)
  }

  // Remove custom response
  removeCustomResponse(question: string): void {
    this.config.customResponses?.delete(question.trim())
  }

  // Clear all custom responses
  clearCustomResponses(): void {
    this.config.customResponses?.clear()
  }
}

// Export a default instance for easy testing
export const mockAIService = new MockAIService()

// Utility function to create mock service with specific configuration
export const createMockAIService = (config?: Partial<MockAIServiceConfig>): MockAIService => {
  return new MockAIService(config)
}

// Predefined configurations for common testing scenarios
export const MOCK_CONFIGS = {
  SUCCESS: {
    responseDelay: 100,
    errorRate: 0,
    timeoutRate: 0,
    networkErrorRate: 0,
  },
  
  NETWORK_ERRORS: {
    responseDelay: 50,
    errorRate: 0,
    timeoutRate: 0,
    networkErrorRate: 1,
  },
  
  API_ERRORS: {
    responseDelay: 50,
    errorRate: 1,
    timeoutRate: 0,
    networkErrorRate: 0,
  },
  
  TIMEOUTS: {
    responseDelay: 50,
    errorRate: 0,
    timeoutRate: 1,
    networkErrorRate: 0,
  },
  
  MIXED_ERRORS: {
    responseDelay: 100,
    errorRate: 0.3,
    timeoutRate: 0.2,
    networkErrorRate: 0.2,
  },
  
  RETRY_TESTING: {
    responseDelay: 50,
    errorRate: 0.6,
    timeoutRate: 0.2,
    networkErrorRate: 0.4,
    enableRetryTesting: true,
  }
} as const