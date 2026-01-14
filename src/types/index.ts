// Core TypeScript interfaces and types for AI Study Assistant

// Optional feature types
export type OptionalFeatureType = 'explain-simple' | 'summarize' | 'generate-quiz';

// Question model
export interface Question {
  id: string;
  text: string;
  timestamp: number;
  mode?: OptionalFeatureType;
}

// Response model
export interface Response {
  id: string;
  questionId: string;
  content: string;
  timestamp: number;
  mode?: OptionalFeatureType;
  processingTime?: number;
}

// Conversation model
export interface Conversation {
  id: string;
  questions: Question[];
  responses: Response[];
  startTime: number;
  lastActivity: number;
}

// Error types
export type ErrorType = 'validation' | 'network' | 'api' | 'timeout';

export interface AppError {
  type: ErrorType;
  message: string;
  retryable: boolean;
}

// Application state model
export interface ApplicationState {
  currentConversation: Conversation;
  uiState: {
    isLoading: boolean;
    error: AppError | null;
    inputValue: string;
    selectedFeature: OptionalFeatureType | null;
  };
  settings: {
    responseTimeout: number;
    maxRetries: number;
    enableOptionalFeatures: boolean;
  };
}

// App component state interface
export interface AppState {
  currentQuestion: string;
  responses: Response[];
  isLoading: boolean;
  error: string | null;
  optionalFeatureMode: OptionalFeatureType | null;
}

// Component prop interfaces
export interface QuestionInputProps {
  onSubmit: (question: string, mode?: OptionalFeatureType) => void;
  isLoading: boolean;
  error: string | null;
}

export interface ResponseDisplayProps {
  responses: Response[];
  isLoading: boolean;
}

export interface LoadingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

// AI Service interfaces
export interface AIRequest {
  question: string;
  mode?: 'simple' | 'summary' | 'quiz';
  context?: string;
}

export interface AIResponse {
  content: string;
  timestamp: number;
  mode?: OptionalFeatureType;
}

export interface AIService {
  generateResponse(question: string, mode?: OptionalFeatureType): Promise<string>;
}

// Error handling interface
export interface ErrorHandler {
  handleAPIError(error: Error): string;
  handleValidationError(input: string): string | null;
  handleNetworkError(error: NetworkError): string;
}

// Network error interface
export interface NetworkError extends Error {
  code?: string;
  status?: number;
}

// Optional feature configuration
export interface OptionalFeatureConfig {
  type: OptionalFeatureType;
  label: string;
  description: string;
  promptModifier: string;
}