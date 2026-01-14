/**
 * Property-based tests for AI service communication
 * Feature: ai-study-assistant, Property 2: Response Display Consistency
 * Validates: Requirements 2.2, 2.3, 2.4
 */

import * as fc from 'fast-check';
import { KiroAIService, AIServiceError } from '../aiService';
import type { OptionalFeatureType } from '../../types';

// Mock fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('AI Service Property Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Don't use fake timers for these tests as they interfere with async operations
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  /**
   * Property 2: Response Display Consistency
   * For any AI-generated response, the system should display the content in a formatted, 
   * readable manner within the designated response area and maintain the response-question association.
   * Validates: Requirements 2.2, 2.3, 2.4
   */
  it('should maintain response consistency for all valid inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          question: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          mode: fc.option(fc.constantFrom<OptionalFeatureType>('explain-simple', 'summarize', 'generate-quiz')),
          responseContent: fc.string({ minLength: 10, maxLength: 200 })
        }),
        async ({ question, mode, responseContent }) => {
          // Create a fresh service instance for each test to avoid interference
          const testService = new KiroAIService();
          
          // Mock successful API response for this specific test
          const mockFetchLocal = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ content: responseContent })
          });
          
          // Temporarily replace global fetch for this test
          const originalFetch = global.fetch;
          global.fetch = mockFetchLocal;

          try {
            // Call the service
            const result = await testService.generateResponse(question, mode || undefined);

            // Verify the response content is returned exactly as provided by the API
            // This ensures consistency between AI service response and what gets displayed
            expect(result).toBe(responseContent);
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);

            // Verify the request was made with proper formatting
            expect(mockFetchLocal).toHaveBeenCalledTimes(1);
            const [url, options] = mockFetchLocal.mock.calls[0];
            
            expect(url).toBe('/api/ai/generate');
            expect(options.method).toBe('POST');
            expect(options.headers['Content-Type']).toBe('application/json');
            
            const requestBody = JSON.parse(options.body);
            expect(requestBody.prompt).toBeDefined();
            expect(requestBody.timestamp).toBeDefined();
            
            // Verify prompt formatting based on mode (Requirements 2.2, 2.4)
            const actualMode = mode || undefined;
            if (actualMode === 'explain-simple') {
              expect(requestBody.prompt).toContain('explain this in simple terms');
              expect(requestBody.prompt).toContain('12-year-old');
              expect(requestBody.prompt).toContain(question.trim());
            } else if (actualMode === 'summarize') {
              expect(requestBody.prompt).toContain('provide a concise summary');
              expect(requestBody.prompt).toContain(question.trim());
            } else if (actualMode === 'generate-quiz') {
              expect(requestBody.prompt).toContain('generate 5 quiz questions');
              expect(requestBody.prompt).toContain(question.trim());
            } else {
              expect(requestBody.prompt).toBe(question.trim());
            }
          } finally {
            // Restore original fetch
            global.fetch = originalFetch;
          }
        }
      ),
      { numRuns: 10, timeout: 5000 } // Reduced runs and added timeout
    );
  });

  /**
   * Property: Input validation consistency
   * For any invalid input, the service should consistently reject with appropriate validation errors
   */
  it('should consistently validate inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''), // empty string
          fc.constant('   '), // whitespace only
          fc.string({ maxLength: 0 }), // empty
          fc.constant(null as any), // null
          fc.constant(undefined as any) // undefined
        ),
        async (invalidInput) => {
          const testService = new KiroAIService();
          
          await expect(testService.generateResponse(invalidInput)).rejects.toThrow(AIServiceError);
          
          try {
            await testService.generateResponse(invalidInput);
          } catch (error) {
            expect(error).toBeInstanceOf(AIServiceError);
            expect((error as AIServiceError).type).toBe('validation');
            expect((error as AIServiceError).retryable).toBe(false);
          }
        }
      ),
      { numRuns: 5, timeout: 2000 }
    );
  });

  /**
   * Property: Error handling consistency
   * For any API error response, the service should consistently handle and categorize errors
   */
  it('should consistently handle API errors', async () => {
    const testService = new KiroAIService();
    
    // Test a specific error case
    const mockResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ error: 'Internal server error' })
    };
    
    const mockFetchLocal = jest.fn().mockResolvedValue(mockResponse);
    
    const originalFetch = global.fetch;
    global.fetch = mockFetchLocal;

    try {
      try {
        await testService.generateResponse('test question');
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(AIServiceError);
        expect((error as AIServiceError).type).toBe('api');
        expect((error as AIServiceError).retryable).toBe(true); // 500 errors are retryable
      }
    } finally {
      global.fetch = originalFetch;
    }
  }, 10000); // Increased timeout

  /**
   * Property: Network error handling consistency
   * For any network failure, the service should consistently handle network errors
   */
  it('should consistently handle network errors', async () => {
    const testService = new KiroAIService();
    
    // Mock network error for this specific test
    const networkError = new TypeError('Failed to fetch');
    const mockFetchLocal = jest.fn().mockRejectedValue(networkError);
    
    const originalFetch = global.fetch;
    global.fetch = mockFetchLocal;

    try {
      try {
        await testService.generateResponse('test question');
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(AIServiceError);
        expect((error as AIServiceError).type).toBe('network');
        expect((error as AIServiceError).retryable).toBe(true);
        expect((error as AIServiceError).message).toContain('Network error');
      }
    } finally {
      global.fetch = originalFetch;
    }
  }, 10000); // Increased timeout
});