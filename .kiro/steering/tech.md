# Technology Stack

## Core Technologies

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4 for fast development and optimized builds
- **Language**: TypeScript 5.9.3 for type safety
- **Styling**: CSS with component-scoped styles

## Development Dependencies

- **Testing Framework**: Jest 30.2.0 with jsdom environment
- **Testing Libraries**: 
  - @testing-library/react for component testing
  - @testing-library/jest-dom for DOM assertions
  - fast-check for property-based testing
- **Linting**: ESLint 9.39.1 with TypeScript and React plugins
- **Type Definitions**: @types packages for React, Node, and Jest

## Build System

- **Development Server**: Vite dev server with Hot Module Replacement (HMR)
- **Production Build**: TypeScript compilation followed by Vite build
- **Module System**: ES modules (type: "module" in package.json)

## Common Commands

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally

# Testing
npm run test         # Run Jest tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint on all files
```

## Architecture Patterns

- **Component-Driven**: Functional React components with hooks
- **Type-First**: TypeScript interfaces defined in src/types/
- **No External State Management**: Uses React's built-in useState/useEffect
- **Direct AI Integration**: Integrates with Kiro AI assistant without backend
- **Property-Based Testing**: Uses fast-check for comprehensive test coverage

## Project Configuration

- **Vite Config**: Standard React plugin setup
- **TypeScript**: Multiple tsconfig files for different contexts (app, node, test)
- **Jest Config**: Configured for TypeScript and React testing with jsdom
- **ESLint**: Modern flat config with React and TypeScript rules