/**
 * Property-based tests for QuestionInput component
 * Feature: ai-study-assistant, Property 1: Question Processing Pipeline
 * Validates: Requirements 1.2, 1.4, 2.1
 */

import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import QuestionInput from '../QuestionInput';

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});

// Custom generator for safe input strings (avoiding user-event issues)
const safeStringArbitrary = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => s.trim().length > 0)
  .filter(s => !s.includes('[') && !s.includes(']') && !s.includes('{') && !s.includes('}'))
  .map(s => s.replace(/[{}[\]]/g, '')); // Remove problematic characters

describe('QuestionInput Property Tests', () => {
  /**
   * Property 1: Question Processing Pipeline
   * For any valid question text, when submitted through the interface, the system should 
   * accept the input, send it to the AI service, and initiate the response process 
   * without data loss or corruption.
   * Validates: Requirements 1.2, 1.4, 2.1
   */
  it('should process valid questions through the pipeline correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        safeStringArbitrary,
        async (question) => {
          const mockOnSubmit = jest.fn();
          
          const { unmount } = render(
            <QuestionInput 
              onSubmit={mockOnSubmit}
              isLoading={false}
              error={null}
            />
          );
          
          try {
            const input = screen.getByLabelText('Study question input');
            const askButton = screen.getByRole('button', { name: /submit question/i });
            
            // Initially, button should be disabled for empty input
            expect(askButton).toBeDisabled();
            
            // Use fireEvent to set input value directly (more reliable than user.type)
            fireEvent.change(input, { target: { value: question } });
            
            // Verify input contains the question (Requirement 1.2 - accept text input)
            expect(input).toHaveValue(question);
            
            // Button should be enabled for non-empty input
            expect(askButton).toBeEnabled();
            
            // Submit the question using fireEvent (more reliable)
            fireEvent.click(askButton);
            
            // Verify onSubmit was called with the trimmed question and optional mode (Requirement 1.4, 2.1)
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith(question.trim(), undefined);
            
            // Verify input field is cleared after submission (proper pipeline behavior)
            expect(input).toHaveValue('');
            
            // Button should be disabled again after input is cleared
            expect(askButton).toBeDisabled();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100, timeout: 30000 }
    );
  }, 30000);

  /**
   * Property: Input validation consistency
   * For any input that contains only whitespace, the system should consistently
   * prevent submission and maintain proper state.
   */
  it('should consistently handle whitespace-only inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length === 0), // Only whitespace
        async (whitespaceInput) => {
          const mockOnSubmit = jest.fn();
          
          const { unmount } = render(
            <QuestionInput 
              onSubmit={mockOnSubmit}
              isLoading={false}
              error={null}
            />
          );
          
          try {
            const input = screen.getByLabelText('Study question input');
            const askButton = screen.getByRole('button', { name: /submit question/i });
            
            // Set the whitespace input using fireEvent
            fireEvent.change(input, { target: { value: whitespaceInput } });
            
            // Button should remain disabled for whitespace-only input
            expect(askButton).toBeDisabled();
            
            // Try to submit by triggering form submission
            const form = input.closest('form');
            if (form) {
              fireEvent.submit(form);
            }
            
            // Verify onSubmit was NOT called
            expect(mockOnSubmit).not.toHaveBeenCalled();
            
            // Input should still contain the whitespace
            expect(input).toHaveValue(whitespaceInput);
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 20000 }
    );
  }, 20000);

  /**
   * Property: Loading state behavior
   * When the component is in loading state, it should properly disable controls
   * and maintain input state.
   */
  it('should handle loading state correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        safeStringArbitrary,
        async (question) => {
          const mockOnSubmit = jest.fn();
          
          // Test with loading state
          const { rerender, unmount } = render(
            <QuestionInput 
              onSubmit={mockOnSubmit}
              isLoading={true}
              error={null}
            />
          );
          
          try {
            const input = screen.getByLabelText('Study question input');
            const askButton = screen.getByRole('button', { name: /processing question/i });
            
            // In loading state, input should be disabled
            expect(input).toBeDisabled();
            expect(askButton).toBeDisabled();
            expect(askButton).toHaveTextContent('Processing...');
            
            // Switch to non-loading state
            rerender(
              <QuestionInput 
                onSubmit={mockOnSubmit}
                isLoading={false}
                error={null}
              />
            );
            
            // Now input should be enabled
            expect(input).toBeEnabled();
            const enabledButton = screen.getByRole('button', { name: /submit question/i });
            expect(enabledButton).toHaveTextContent('Ask');
            
            // Should be able to change input now
            fireEvent.change(input, { target: { value: question } });
            expect(input).toHaveValue(question);
            
            // Button should be enabled with valid input
            expect(enabledButton).toBeEnabled();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 20000 }
    );
  }, 20000);

  /**
   * Property: Error state display
   * When errors are provided, they should be properly displayed and accessible.
   */
  it('should display errors correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 50 })
          .filter(s => s.trim().length > 2)
          .filter(s => /^[a-zA-Z0-9\s.,!?-]+$/.test(s)), // Only alphanumeric and basic punctuation
        async (errorMessage) => {
          const mockOnSubmit = jest.fn();
          
          const { unmount } = render(
            <QuestionInput 
              onSubmit={mockOnSubmit}
              isLoading={false}
              error={errorMessage.trim()}
            />
          );
          
          try {
            // Error should be displayed
            const errorElements = screen.getAllByRole('alert');
            const externalErrorElement = errorElements.find(el => el.classList.contains('external-error'));
            expect(externalErrorElement).toBeDefined();
            
            // The DOM normalizes consecutive whitespace to single spaces when rendering text content
            // So we need to normalize both the expected and actual values for comparison
            const normalizedExpected = errorMessage.trim().replace(/\s+/g, ' ');
            const actualContent = externalErrorElement?.textContent || '';
            expect(actualContent).toBe(normalizedExpected);
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 15000);
});