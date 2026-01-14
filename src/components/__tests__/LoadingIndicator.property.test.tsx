/**
 * Property-based tests for LoadingIndicator component
 * Feature: ai-study-assistant, Property 3: Loading State Management
 * Validates: Requirements 4.1, 4.2, 4.3
 */

import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import LoadingIndicator from '../LoadingIndicator';

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});

describe('LoadingIndicator Property Tests', () => {
  /**
   * Property 3: Loading State Management
   * For any question submission, the system should immediately show a loading indicator,
   * maintain it during processing, and hide it when the response is received or an error occurs.
   * Validates: Requirements 4.1, 4.2, 4.3
   */
  it('should manage loading state visibility correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          isVisible: fc.boolean(),
          message: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: undefined })
        }),
        async ({ isVisible, message }) => {
          const { unmount } = render(
            <LoadingIndicator 
              isVisible={isVisible}
              message={message}
            />
          );
          
          try {
            if (isVisible) {
              // When visible, loading indicator should be present (Requirement 4.1)
              const loadingElement = screen.getByRole('status');
              expect(loadingElement).toBeInTheDocument();
              expect(loadingElement).toHaveAttribute('aria-live', 'polite');
              
              // Should display the spinner
              const spinnerContainer = loadingElement.querySelector('.loading-spinner');
              expect(spinnerContainer).toBeInTheDocument();
              
              // Should display the message (Requirement 4.2 - maintain loading state)
              const expectedMessage = (message && message.trim()) ? message.trim() : "Processing your question...";
              expect(screen.getByText(expectedMessage)).toBeInTheDocument();
              
              // Should have proper accessibility attributes
              expect(loadingElement).toHaveAttribute('role', 'status');
              expect(loadingElement).toHaveAttribute('aria-live', 'polite');
            } else {
              // When not visible, loading indicator should not be present (Requirement 4.3)
              expect(screen.queryByRole('status')).not.toBeInTheDocument();
              expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100, timeout: 30000 }
    );
  }, 30000);

  /**
   * Property: Message display consistency
   * For any valid message string, the loading indicator should display it correctly
   * when visible, and not display anything when hidden.
   */
  it('should display messages consistently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 200 })
          .filter(s => s.trim().length > 0)
          .filter(s => /^[a-zA-Z0-9\s.,!?-]+$/.test(s)), // Safe characters only
        async (customMessage) => {
          const { rerender, unmount } = render(
            <LoadingIndicator 
              isVisible={true}
              message={customMessage.trim()}
            />
          );
          
          try {
            // Should display the custom message when visible
            expect(screen.getByText(customMessage.trim())).toBeInTheDocument();
            
            // Rerender with isVisible=false
            rerender(
              <LoadingIndicator 
                isVisible={false}
                message={customMessage.trim()}
              />
            );
            
            // Should not display the message when hidden
            expect(screen.queryByText(customMessage.trim())).not.toBeInTheDocument();
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 20000 }
    );
  }, 20000);

  /**
   * Property: Default message behavior
   * When no message is provided, the component should use the default message
   * consistently across all visibility states.
   */
  it('should use default message when none provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (isVisible) => {
          const { unmount } = render(
            <LoadingIndicator isVisible={isVisible} />
          );
          
          try {
            if (isVisible) {
              // Should display default message
              expect(screen.getByText("Processing your question...")).toBeInTheDocument();
              expect(screen.getByRole('status')).toBeInTheDocument();
            } else {
              // Should not display anything when hidden
              expect(screen.queryByText("Processing your question...")).not.toBeInTheDocument();
              expect(screen.queryByRole('status')).not.toBeInTheDocument();
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 20000 }
    );
  }, 20000);

  /**
   * Property: Accessibility attributes consistency
   * For any loading state, the component should maintain proper accessibility
   * attributes when visible.
   */
  it('should maintain accessibility attributes consistently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          isVisible: fc.constant(true), // Only test when visible
          message: fc.option(fc.string({ minLength: 3, maxLength: 50 }), { nil: undefined })
        }),
        async ({ isVisible, message }) => {
          const { unmount } = render(
            <LoadingIndicator 
              isVisible={isVisible}
              message={message}
            />
          );
          
          try {
            const loadingElement = screen.getByRole('status');
            
            // Should have proper ARIA attributes
            expect(loadingElement).toHaveAttribute('role', 'status');
            expect(loadingElement).toHaveAttribute('aria-live', 'polite');
            
            // Should have the loading-indicator class
            expect(loadingElement).toHaveClass('loading-indicator');
            
            // Should contain spinner elements
            const spinnerRings = loadingElement.querySelectorAll('.spinner-ring');
            expect(spinnerRings).toHaveLength(3); // Three spinner rings as per CSS
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 15000);
});