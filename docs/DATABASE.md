# MindLock Database Documentation

## Overview

After analyzing the codebase, I've determined that MindLock uses **Firebase Firestore** as its database solution. While the application still maintains mock data for development purposes, it has a fully implemented Firebase integration for production use.

## Firebase Implementation

### Firebase Configuration

The Firebase configuration is defined in `src/lib/firebase.ts` and initializes both Firestore and Authentication services:

```typescript
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
```

### Data Initialization

The application includes a utility in `src/lib/initFirebase.ts` to initialize the Firebase database with mock data. This function (`eraseAndReinitializeFirebase`) can be used to reset the database to a known state for testing or initial setup.

## Firebase Collections

The application uses the following Firestore collections:

- `questions` - Stores all question documents
- `courses` - Stores all course documents
- `users` - Stores user information (for authentication and admin privileges)

## Data Models

The data models are defined in `src/types/index.ts` with the following structures:

### Question Document

```typescript
export interface Question {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  course: string;
  tags: string[];
  questionTypes: string[];
  createdAt: Date;
  updatedAt: Date;
  solution?: string;
  hints?: string[];
  timeEstimate?: number; // in minutes
  imageUrl?: string; // Added for image support
  userAnswer?: string; // Added to store user answers in focus mode
}
```

### Course Document

```typescript
export interface Course {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
  color?: string; // For dashboard card styling
  questionTypes: string[]; // Available question types for this course
}
```

## Firebase Data Operations

The application interacts with Firebase through the `useFirebaseQuestions` hook in `src/hooks/useFirebaseQuestions.tsx`. This hook provides the following operations:

### Read Operations

- **Fetching Questions**: Retrieves questions with optional filtering by course, difficulty, and search query
  ```typescript
  const fetchQuestions = async () => {
    let q: Query | CollectionReference = collection(db, 'questions');
    // Apply filters
    if (options.courseId) {
      q = query(q, where('course', '==', options.courseId));
    }
    // ...
  }
  ```

- **Fetching Courses**: Retrieves all available courses
  ```typescript
  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    // ...
  }
  ```

- **Getting Question by ID**: Retrieves a specific question by its ID
  ```typescript
  const getQuestionById = async (id: string) => {
    // First try to find by originalId
    const questionsQuery = query(collection(db, 'questions'), where('originalId', '==', id));
    // ...
  }
  ```

### Write Operations

- **Adding Questions**: Creates a new question document
  ```typescript
  const addQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...question,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    // ...
  }
  ```

- **Updating Questions**: Updates an existing question document
  ```typescript
  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    const questionRef = doc(db, 'questions', id);
    await updateDoc(questionRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }
  ```

- **Deleting Questions**: Removes a question document
  ```typescript
  const deleteQuestion = async (id: string) => {
    const questionRef = doc(db, 'questions', id);
    // ...
    await deleteDoc(questionRef);
  }
  ```

- **Adding Courses**: Creates a new course document
  ```typescript
  const addCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...course,
      questionCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    // ...
  }
  ```

## Authentication

The application uses Firebase Authentication through the `useAuth` hook in `src/hooks/useAuth.tsx`. This hook provides:

- User authentication state management
- Sign-in functionality
- Sign-out functionality
- Admin role checking

```typescript
export function useAuth() {
  // ...
  const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
}
```

## Dual Data Management

The application currently has two data management approaches:

1. **Firebase Integration** (`useFirebaseQuestions` hook): For production use, connecting to the actual Firebase database

2. **Mock Data** (`useQuestions` hook): For development and testing, using in-memory data

Components throughout the application are currently using the Firebase implementation, as evidenced by imports of `useFirebaseQuestions` in various components like `Questions.tsx`, `Study.tsx`, and `Admin.tsx`.

## Future Enhancements

Potential enhancements to the Firebase implementation could include:

1. **Offline Support**: Implementing Firestore offline persistence for better mobile experience
2. **Real-time Updates**: Using Firestore's real-time listeners for collaborative features
3. **Security Rules**: Implementing more granular security rules for data access
4. **User Profiles**: Expanding the user collection to store user preferences and progress
5. **Cloud Functions**: Adding serverless functions for complex operations
