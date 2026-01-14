import React, { useState, type FormEvent } from 'react';
import type { QuestionInputProps, OptionalFeatureType } from '../types';
import OptionalFeature from './OptionalFeature';
import { detectIntent, cleanQuestionText } from '../utils/intentDetection';
import './QuestionInput.css';

const QuestionInput: React.FC<QuestionInputProps> = ({ onSubmit, isLoading, error }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<OptionalFeatureType | null>(null);

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear any previous validation errors
    setValidationError(null);
    
    // Validate input - check for empty or whitespace-only questions
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setValidationError('Please enter a question');
      return;
    }
    
    // Detect intent from the question text (NLP detection takes precedence)
    const detectedIntent = detectIntent(trimmedValue);
    const finalMode = detectedIntent || selectedMode || undefined;
    
    // Clean the question text if intent was detected
    const cleanedQuestion = detectedIntent 
      ? cleanQuestionText(trimmedValue, detectedIntent)
      : trimmedValue;
    
    // Submit the question with detected or selected mode and clear the input field
    onSubmit(cleanedQuestion, finalMode);
    setInputValue('');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  // Handle button click (alternative to form submission)
  const handleButtonClick = () => {
    // Clear any previous validation errors
    setValidationError(null);
    
    // Validate input
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setValidationError('Please enter a question');
      return;
    }
    
    // Detect intent from the question text (NLP detection takes precedence)
    const detectedIntent = detectIntent(trimmedValue);
    const finalMode = detectedIntent || selectedMode || undefined;
    
    // Clean the question text if intent was detected
    const cleanedQuestion = detectedIntent 
      ? cleanQuestionText(trimmedValue, detectedIntent)
      : trimmedValue;
    
    // Submit the question with detected or selected mode and clear the input field
    onSubmit(cleanedQuestion, finalMode);
    setInputValue('');
  };

  return (
    <div className="question-input">
      <form onSubmit={handleSubmit} className="question-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask your study question..."
            disabled={isLoading}
            className={`question-field ${validationError ? 'error' : ''}`}
            aria-label="Study question input"
            aria-describedby={validationError ? 'validation-error' : undefined}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading || !inputValue.trim()}
            className="ask-button"
            aria-label={isLoading ? 'Processing question' : 'Submit question'}
          >
            {isLoading ? 'Processing...' : 'Ask'}
          </button>
        </div>
        
        {/* Optional feature toggle */}
        <OptionalFeature 
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          disabled={isLoading}
        />
        
        {/* Display validation errors */}
        {validationError && (
          <div id="validation-error" className="error-message validation-error" role="alert">
            {validationError}
          </div>
        )}
        
        {/* Display external errors passed from parent */}
        {error && (
          <div className="error-message external-error" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionInput;