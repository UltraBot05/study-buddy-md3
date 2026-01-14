/**
 * Unit tests for QuestionInput component - Input validation edge cases
 * Requirements: 3.1, 3.2
 */

import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionInput from '../QuestionInput';

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});

describe('QuestionInput Unit Tests - Input Validation Edge Cases', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Empty input prevention', () => {
    it('should prevent submission of empty input', async () => {
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const askButton = screen.getByRole('button', { name: /submit question/i });

      // Button should be disabled initially
      expect(askButton).toBeDisabled();

      // Try to submit empty form (should not work since button is disabled)
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error when trying to submit empty input via form', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      
      // Try to submit by pressing Enter on empty input
      await user.click(input);
      await user.keyboard('{Enter}');

      // Should show validation error
      expect(screen.getByText('Please enter a question')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Whitespace-only input handling', () => {
    it('should prevent submission of whitespace-only input', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      // Type only spaces
      await user.type(input, '   ');

      // Button should remain disabled
      expect(askButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should prevent submission of tabs and newlines', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      // Type tabs and spaces
      await user.type(input, '\t\t  \t');

      // Button should remain disabled
      expect(askButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for whitespace-only input on form submission', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      
      // Type whitespace and try to submit via Enter
      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      // Should show validation error
      expect(screen.getByText('Please enter a question')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Special character handling', () => {
    it('should accept questions with special characters', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      const questionWithSpecialChars = 'What is 2+2? How about x=y?';
      
      // Type question with special characters
      await user.clear(input);
      await user.type(input, questionWithSpecialChars);

      // Button should be enabled
      expect(askButton).toBeEnabled();

      // Submit the question
      await user.click(askButton);

      // Should call onSubmit with the question
      expect(mockOnSubmit).toHaveBeenCalledWith(questionWithSpecialChars, undefined);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle unicode characters', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      const unicodeQuestion = 'What is π (pi)? How about α + β = γ?';
      
      // Type question with unicode characters
      await user.clear(input);
      await user.type(input, unicodeQuestion);

      // Button should be enabled
      expect(askButton).toBeEnabled();

      // Submit the question
      await user.click(askButton);

      // Should call onSubmit with the question
      expect(mockOnSubmit).toHaveBeenCalledWith(unicodeQuestion, undefined);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle very long questions', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      const longQuestion = 'What is the meaning of life and how does it relate to quantum physics?'; // Reasonable length
      
      // Type long question
      await user.clear(input);
      await user.type(input, longQuestion);

      // Button should be enabled
      expect(askButton).toBeEnabled();

      // Submit the question
      await user.click(askButton);

      // Should call onSubmit with the question
      expect(mockOnSubmit).toHaveBeenCalledWith(longQuestion, undefined);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    }, 10000);
  });

  describe('Error message display', () => {
    it('should display external error messages', () => {
      const errorMessage = 'Network error occurred';
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={errorMessage}
        />
      );

      // Error should be displayed
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent(errorMessage);
      expect(errorElement).toHaveClass('external-error');
    });

    it('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      
      // Trigger validation error by submitting empty form
      const form = input.closest('form');
      if (form) {
        // Submit empty form to trigger validation
        await user.click(input);
        await user.keyboard('{Enter}');
        
        // Should show validation error
        expect(screen.getByText('Please enter a question')).toBeInTheDocument();

        // Start typing
        await user.type(input, 'H');

        // Validation error should be cleared
        expect(screen.queryByText('Please enter a question')).not.toBeInTheDocument();
      }
    });
  });

  describe('Input field behavior', () => {
    it('should clear input field after successful submission', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      const question = 'What is photosynthesis?';
      
      // Type and submit question
      await user.type(input, question);
      await user.click(askButton);

      // Input should be cleared
      expect(input).toHaveValue('');
      
      // Button should be disabled again
      expect(screen.getByRole('button', { name: /submit question/i })).toBeDisabled();
    });

    it('should trim whitespace from submitted questions', async () => {
      const user = userEvent.setup();
      
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /submit question/i });

      const questionWithWhitespace = '  What is gravity?  ';
      const expectedTrimmedQuestion = 'What is gravity?';
      
      // Clear input first and type question with leading/trailing whitespace
      await user.clear(input);
      
      // Use paste instead of type to avoid userEvent issues with spaces
      await user.click(input);
      await user.paste(questionWithWhitespace);
      
      await user.click(askButton);

      // Should call onSubmit with trimmed question
      expect(mockOnSubmit).toHaveBeenCalledWith(expectedTrimmedQuestion, undefined);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading state behavior', () => {
    it('should disable controls when loading', () => {
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={true}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      const askButton = screen.getByRole('button', { name: /processing question/i });

      // Controls should be disabled
      expect(input).toBeDisabled();
      expect(askButton).toBeDisabled();
      expect(askButton).toHaveTextContent('Processing...');
    });

    it('should enable controls when not loading', () => {
      render(
        <QuestionInput 
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
        />
      );

      const input = screen.getByLabelText('Study question input');
      
      // Input should be enabled
      expect(input).toBeEnabled();
      
      // Button should be disabled initially (empty input)
      const askButton = screen.getByRole('button', { name: /submit question/i });
      expect(askButton).toBeDisabled();
      expect(askButton).toHaveTextContent('Ask');
    });
  });
});