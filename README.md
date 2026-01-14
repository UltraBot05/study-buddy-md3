# Study Buddy - AI Study Assistant

A web application that helps students understand academic concepts through AI-generated explanations and summaries. Built with React, TypeScript, and Material Design 3.

## 🎓 About This Project

Study Buddy is a student-built portfolio project that demonstrates modern web development practices, including:
- Component-driven architecture with React 19
- Type-safe development with TypeScript
- Property-based testing with fast-check
- Material Design 3 UI implementation
- Responsive, accessible design

## ⚠️ Demo Mode

**Important**: This project currently runs in **Demo Mode** with simulated AI responses. It does not connect to a real AI provider. This was an intentional choice to focus on:
- Building a polished user interface
- Implementing comprehensive testing
- Demonstrating frontend architecture skills
- Creating a complete user experience

Future versions will integrate with real AI services (OpenAI, Anthropic, or similar).

## ✨ Features

- **Question Input**: Clean, distraction-free interface for asking study questions
- **Multiple Response Modes**:
  - Normal Mode: Standard explanations
  - Explain Simply: Simplified language for complex topics
  - Summarize: Concise topic summaries
- **Material Design 3**: Modern, accessible UI following Google's design system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Visual feedback during processing
- **Error Handling**: Clear error messages and recovery options

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/UltraBot05/study-buddy-md3.git
cd study-buddy-md3

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🧪 Testing

This project includes comprehensive testing with both unit tests and property-based tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Technology Stack

- **Frontend**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Testing**: Jest 30.2.0 with @testing-library/react and fast-check
- **Styling**: CSS with Material Design 3 principles
- **Code Quality**: ESLint with TypeScript and React plugins

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── QuestionInput.tsx   # Question input form
│   ├── ResponseDisplay.tsx # AI response display
│   ├── LoadingIndicator.tsx # Loading state
│   ├── ErrorDisplay.tsx    # Error handling
│   └── __tests__/      # Component tests
├── services/           # Service layer
│   ├── aiService.ts    # AI service interface
│   └── demoAIService.ts # Demo mode implementation
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🎯 Future Plans

- [ ] Integrate real AI provider (OpenAI/Anthropic)
- [ ] Add conversation history
- [ ] Implement user authentication
- [ ] Add quiz generation feature
- [ ] Support for file uploads (PDFs, images)
- [ ] Dark mode support
- [ ] Offline mode with service workers

## 📝 License

This is a student portfolio project. Feel free to use it as inspiration for your own projects.

## 👤 Author

Built by UltraBot05

## 🙏 Acknowledgments

- Material Design 3 guidelines by Google
- React and TypeScript communities
- Testing best practices from Kent C. Dodds and the Testing Library team
