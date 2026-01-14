import React from 'react';
import type { AppError } from '../types';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  // Don't render if no error
  if (!error) {
    return null;
  }

  return (
    <div className="error-display" role="alert">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-details">
          <div className="error-message">{error.message}</div>
          {error.retryable && onRetry && (
            <button 
              className="retry-button" 
              onClick={onRetry}
              aria-label="Retry request"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
