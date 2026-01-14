/**
 * Unit tests for Mock AI Service
 * Validates mock service functionality for testing scenarios
 */

import { MockAIService, createMockAIService, MOCK_CONFIGS } from '../mockAIService';
import { AIServiceError } from '../aiService';

describe('Mock AI Service', () => {
  let mockService: MockAIService;

  beforeEach(() => {
    mockService = new MockAIService();
  });

  describe('Basic functionality', () => {
    it('should generate responses for valid questions', async () => {
      const response = await mockService.generateResponse('What is React?');
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      expect(response).toContain('What is React?');
    });

    it('should handle different optional feature modes', async () => {
      const question = 'Explain photosynthesis';
      
      const simpleResponse = await mockService.generateResponse(question, 'explain-simple');
      const summaryResponse = await mockService.generateResponse(question, 'summarize');
      const quizResponse = await mockService.generateResponse(question, 'generate-quiz');
      
      expect(simpleResponse).toContain('simple explanation');
      expect(summaryResponse).toContain('Summary');
      expect(quizResponse).toContain('Quiz questions');
      expect(quizResponse).toContain('1.');
    });

    it('should validate input like the real service', async () => {
      await expect(mockService.generateResponse('')).rejects.toThrow(AIServiceError);
      await expect(mockService.generateResponse('   ')).rejects.toThrow(AIServiceError);
      await expect(mockService.generateResponse('a'.repeat(5001))).rejects.toThrow(AIServiceError);
    });
  });

  describe('Error simulation', () => {
    it('should simulate network errors when configured', async () => {
      mockService.configureForNetworkErrors();
      
      await expect(mockService.generateResponse('test question')).rejects.toThrow(AIServiceError);
      
      try {
        await mockService.generateResponse('test question');
      } catch (error) {
        expect(error).toBeInstanceOf(AIServiceError);
        expect((error as AIServiceError).type).toBe('network');
        expect((error as AIServiceError).retryable).toBe(true);
      }
    });

    it('should simulate API errors when configured', async () => {
      mockService.configureForAPIErrors();
      
      await expect(mockService.generateResponse('test question')).rejects.toThrow(AIServiceError);
      
      try {
        await mockService.generateResponse('test question');
      } catch (error) {
        expect(error).toBeInstanceOf(AIServiceError);
        expect((error as AIServiceError).type).toBe('api');
      }
    });

    it('should simulate timeout errors when configured', async () => {
      mockService.configureForTimeouts();
      
      await expect(mockService.generateResponse('test question')).rejects.toThrow(AIServiceError);
      
      try {
        await mockService.generateResponse('test question');
      } catch (error) {
        expect(error).toBeInstanceOf(AIServiceError);
        expect((error as AIServiceError).type).toBe('timeout');
        expect((error as AIServiceError).retryable).toBe(true);
      }
    });
  });

  describe('Custom responses', () => {
    it('should return custom responses when configured', async () => {
      const customResponse = 'This is a custom response for testing';
      mockService.addCustomResponse('test question', customResponse);
      
      const response = await mockService.generateResponse('test question');
      expect(response).toBe(customResponse);
    });

    it('should manage custom responses correctly', async () => {
      mockService.addCustomResponse('question1', 'response1');
      mockService.addCustomResponse('question2', 'response2');
      
      expect(await mockService.generateResponse('question1')).toBe('response1');
      expect(await mockService.generateResponse('question2')).toBe('response2');
      
      mockService.removeCustomResponse('question1');
      const response = await mockService.generateResponse('question1');
      expect(response).not.toBe('response1');
      expect(response).toContain('question1');
    });
  });

  describe('Statistics and monitoring', () => {
    it('should track call statistics', async () => {
      mockService.reset();
      
      await mockService.generateResponse('question1');
      await mockService.generateResponse('question2');
      
      const stats = mockService.getStats();
      expect(stats.callCount).toBe(2);
      expect(stats.retryAttempts.size).toBe(2);
    });

    it('should reset statistics correctly', async () => {
      await mockService.generateResponse('test');
      mockService.reset();
      
      const stats = mockService.getStats();
      expect(stats.callCount).toBe(0);
      expect(stats.retryAttempts.size).toBe(0);
    });
  });

  describe('Configuration management', () => {
    it('should use predefined configurations correctly', () => {
      const successService = createMockAIService(MOCK_CONFIGS.SUCCESS);
      const errorService = createMockAIService(MOCK_CONFIGS.NETWORK_ERRORS);
      
      expect(successService).toBeInstanceOf(MockAIService);
      expect(errorService).toBeInstanceOf(MockAIService);
    });

    it('should update configuration dynamically', async () => {
      // Start with success configuration
      mockService.configureForSuccess();
      const successResponse = await mockService.generateResponse('test');
      expect(successResponse).toBeDefined();
      
      // Switch to error configuration
      mockService.configureForNetworkErrors();
      await expect(mockService.generateResponse('test')).rejects.toThrow();
    });
  });

  describe('Response delay simulation', () => {
    it('should simulate response delays', async () => {
      const delay = 200;
      mockService.updateConfig({ responseDelay: delay });
      
      const startTime = Date.now();
      await mockService.generateResponse('test question');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(delay - 50); // Allow some tolerance
    });
  });
});