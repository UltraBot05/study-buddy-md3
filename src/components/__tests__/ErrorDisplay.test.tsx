import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';
import type { AppError } from '../../types';

describe('ErrorDisplay Component', () => {
  it('should not render when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display error message', () => {
    const error: AppError = {
      type: 'network',
      message: 'Network connection failed',
      retryable: false
    };
    
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('Network connection failed')).toBeInTheDocument();
  });

  it('should show retry button when error is retryable', () => {
    const error: AppError = {
      type: 'api',
      message: 'API error occurred',
      retryable: true
    };
    const onRetry = jest.fn();
    
    render(<ErrorDisplay error={error} onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not show retry button when error is not retryable', () => {
    const error: AppError = {
      type: 'validation',
      message: 'Validation error',
      retryable: false
    };
    
    render(<ErrorDisplay error={error} />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('should not show retry button when onRetry is not provided', () => {
    const error: AppError = {
      type: 'timeout',
      message: 'Request timed out',
      retryable: true
    };
    
    render(<ErrorDisplay error={error} />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const error: AppError = {
      type: 'api',
      message: 'Error message',
      retryable: false
    };
    
    render(<ErrorDisplay error={error} />);
    const errorDisplay = screen.getByRole('alert');
    expect(errorDisplay).toBeInTheDocument();
  });
});
