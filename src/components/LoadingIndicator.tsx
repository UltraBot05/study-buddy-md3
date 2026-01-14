import React from 'react';
import './LoadingIndicator.css';

interface LoadingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isVisible, 
  message = "Processing your question..." 
}) => {
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Use default message if provided message is empty or whitespace-only
  const displayMessage = message && message.trim() ? message.trim() : "Processing your question...";

  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-message">
        {displayMessage}
      </div>
    </div>
  );
};

export default LoadingIndicator;