# MindLock - Mindful Question Practice

![MindLock Logo](public/favicon.png)

MindLock is a modern web application designed to help students practice exam questions in a focused, mindful environment. It provides structured study sessions, exam simulations, and question management across various academic subjects.

## Features

### 📚 Course-Based Organization
- Questions organized by courses (Algorithms, Probability, etc.)
- Visual dashboard with course cards and progress tracking
- Filter questions by difficulty, tags, and question types

### 🧠 Study Mode
- Focused study sessions with individual questions
- Distraction tracking and time management
- Hints and solution viewing options
- Note-taking capabilities for each question

### 📝 Exam Simulation
- Timed exam sessions with configurable parameters
- Customizable exam creation by course, difficulty, and topics
- Random question selection option
- Progress tracking during exams

### 🔍 Question Management
- Comprehensive question browser with filtering options
- Detailed question view with content, difficulty, and metadata
- Support for various question types across different courses

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query
- **Routing**: React Router
- **Animations**: Framer Motion
- **Build Tool**: Vite

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mindful-quester

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Dashboard

The dashboard provides an overview of available courses and quick access to study and exam modes. Each course card displays the number of questions and allows direct navigation to course-specific questions.

### Questions Browser

Browse all questions with filtering options for:
- Course
- Difficulty level
- Tags/topics
- Search by keyword

### Study Mode

1. Select a question from the questions browser
2. View the question content and attempt to solve it
3. Use the timer to track your focus time
4. Access hints if needed
5. View the solution when ready
6. Take notes on your understanding

### Exam Mode

1. Click "Exam Mode" in the navigation bar
2. Configure your exam parameters:
   - Select a course
   - Choose difficulty level
   - Set exam duration
   - Select specific topics (optional)
   - Enable/disable random question order
3. Start the exam and answer questions within the time limit
4. Navigate between questions using the previous/next buttons
5. Submit your exam when finished

## Project Structure

```
mindful-quester/
├── public/               # Static assets
├── src/
│   ├── components/       # UI components
│   │   ├── layout/       # Layout components
│   │   ├── questions/    # Question-related components
│   │   └── ui/           # Reusable UI components
│   ├── data/             # Mock data and constants
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
└── ...                   # Configuration files
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## License

[MIT](LICENSE)