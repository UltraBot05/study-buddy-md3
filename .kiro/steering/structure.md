# Project Structure

## Root Directory

```
ai-study-assistant/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── .kiro/                  # Kiro configuration and specs
├── .vscode/                # VS Code settings
└── config files            # TypeScript, Vite, Jest, ESLint configs
```

## Source Code Organization

```
src/
├── components/             # React components
│   ├── Header.tsx         # Application header
│   ├── QuestionInput.tsx  # Question input form
│   ├── *.css             # Component-specific styles
│   └── __tests__/        # Component tests
├── types/                 # TypeScript type definitions
│   ├── index.ts          # Core interfaces and types
│   └── css.d.ts          # CSS module type declarations
├── services/             # External service integrations (future)
├── __tests__/            # Global test setup
├── App.tsx               # Root application component
├── main.tsx              # Application entry point
└── *.css                 # Global styles
```

## Component Architecture

- **App.tsx**: Root component managing application state and orchestrating child components
- **Header.tsx**: Simple header displaying application title
- **QuestionInput.tsx**: Handles user input, validation, and question submission
- **Future Components**: ResponseDisplay, LoadingIndicator, ErrorDisplay

## Type System Organization

- **src/types/index.ts**: Central location for all TypeScript interfaces
- **Component Props**: Defined alongside component interfaces
- **Data Models**: Question, Response, Conversation, and ApplicationState interfaces
- **Service Interfaces**: AI service and error handling contracts

## Testing Structure

```
__tests__/
├── Component tests in src/components/__tests__/
├── Property-based tests with .property.test.ts suffix
├── Unit tests with .test.tsx/.test.ts suffix
└── Global test setup in src/__tests__/setup.test.ts
```

## Configuration Files

- **tsconfig.*.json**: TypeScript configurations for different contexts
- **vite.config.ts**: Vite build tool configuration
- **jest.config.js**: Jest testing framework setup
- **eslint.config.js**: ESLint code quality rules

## Naming Conventions

- **Components**: PascalCase (e.g., QuestionInput.tsx)
- **Files**: camelCase for utilities, PascalCase for components
- **CSS**: Component-specific CSS files match component names
- **Tests**: Component.test.tsx for unit tests, Component.property.test.ts for property-based tests
- **Types**: Interfaces use PascalCase, types use camelCase with descriptive suffixes