import React from 'react';
import type { ResponseDisplayProps } from '../types';
import './ResponseDisplay.css';

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ responses, isLoading }) => {
  // Don't render anything if there are no responses and not loading
  if (responses.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="response-display">
      {/* Render conversation history with question-response pairs */}
      {responses.map((response) => (
        <div key={response.id} className="conversation-item">
          <div className="response-content">
            {/* Format response content for readability */}
            <div className="response-text">
              {response.content}
            </div>
            
            {/* Response metadata */}
            <div className="response-meta">
              {response.mode && (
                <span className="response-mode" title={`Mode: ${response.mode}`}>
                  {response.mode === 'explain-simple' && '👶 Simple'}
                  {response.mode === 'summarize' && '📝 Summary'}
                  {response.mode === 'generate-quiz' && '❓ Quiz'}
                </span>
              )}
              <span className="response-timestamp">
                {new Date(response.timestamp).toLocaleTimeString()}
              </span>
              {response.processingTime && (
                <span className="processing-time" title="Processing time">
                  {response.processingTime}ms
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponseDisplay;